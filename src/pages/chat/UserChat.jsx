import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import UserType from '../../Hook/userType/UserType';
import baseUrl from '../../api/baseUrl';
import { FaComments, FaUser, FaClock, FaCircle } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';

const UserChat = () => {
  const { user } = useAuth();
  const [userData, isAdmin, userFromHook] = UserType();
  const toast = useToast();
  const { 
    messages, 
    sendMessage, 
    sendTyping, 
    typingUsers, 
    fetchMessages,
    setMessagesList,
    isConnected 
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations list
  const fetchConversations = async () => {
    if (!isAdmin) return;
    
    setIsLoadingConversations(true);
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get('/api/chat/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Fetch messages for specific user
  const fetchUserMessages = async (userId) => {
    setIsLoadingMessages(true);
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get(`/api/chat/admin/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setConversationId(response.data.id);
        setMessagesList(response.data.messages || []);
        setSelectedUserId(userId);
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };
  // Load conversations on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchConversations();
    } else if (userData) {
      // For regular users, get their own conversation
      getOrCreateConversation();
    }
  }, [isAdmin, userData]);

  const getOrCreateConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      // Try to get existing conversation
      const response = await baseUrl.get('/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.length > 0) {
        setConversationId(response.data[0].id);
        fetchMessages(response.data[0].id);
      } else {
        // Create new conversation
        const newConvResponse = await baseUrl.post('/api/chat/conversations', {
          message: "مرحبا، أحتاج مساعدة"
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setConversationId(newConvResponse.data.id);
        setMessagesList([newConvResponse.data]);
      }
    } catch (error) {
      console.error('Error getting conversation:', error);
    }
  };

  // Auto-refresh conversations every 30 seconds for admin
  useEffect(() => {
    let interval;
    if (isAdmin) {
      interval = setInterval(() => {
        fetchConversations();
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAdmin]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear message text when switching conversations
    if (selectedUserId) {
      setMessageText('');
    }
  }, [selectedUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !conversationId || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      if (isAdmin && selectedUserId) {
        // For admin: send message to specific user
        const token = localStorage.getItem('token');
        await baseUrl.post('/api/chat/send', {
          content: messageText.trim(),
          recipientId: selectedUserId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Add the sent message to the messages list immediately
        const newMessage = {
          id: Date.now(),
          chatId: conversationId,
          senderId: userFromHook?.id,
          content: messageText.trim(),
          isRead: false,
          createdAt: new Date().toISOString(),
          sender: {
            id: userFromHook?.id,
            email: userFromHook?.email || 'admin@example.com',
            fullName: userFromHook?.name || 'الأدمن',
            isSuperuser: true
          }
        };
        
        setMessagesList(prev => [...prev, newMessage]);
        setMessageText('');
        setIsTyping(false);
        
        // Show success message
        toast({
          title: "تم إرسال الرسالة",
          description: "تم إرسال رسالتك بنجاح",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        // Refresh messages from server after a short delay
        setTimeout(() => {
          fetchUserMessages(selectedUserId);
          // Also refresh conversations list to update unread counts
          fetchConversations();
        }, 500);
      } else {
        // For regular users: use existing chat context
        await sendMessage(conversationId, messageText.trim());
        setMessageText('');
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "حدث خطأ أثناء إرسال الرسالة",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    // Only handle typing indicator if connected and not admin
    if (!isAdmin && isConnected) {
      if (!isTyping) {
        setIsTyping(true);
        if (sendTyping) {
          sendTyping(true);
        }
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (sendTyping) {
          sendTyping(false);
        }
      }, 1000);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ساعة`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const getTypingIndicator = () => {
    const isAdminTyping = typingUsers[1]; // Assuming admin has ID 1
    if (isAdminTyping) {
      return (
        <div className="flex items-center space-x-2 text-gray-500 text-sm p-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>الدعم الفني يكتب...</span>
        </div>
      );
    }
    return null;
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600">يجب عليك تسجيل الدخول للوصول إلى نظام الدردشة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .chat-container {
          height: calc(100vh - 120px);
        }
        .messages-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        .messages-container::-webkit-scrollbar-track {
          background: #f7fafc;
        }
        .messages-container::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        .sidebar-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        .sidebar-container::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-container::-webkit-scrollbar-track {
          background: #f7fafc;
        }
        .sidebar-container::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
      {/* Header */}
   

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-120px)]">
        <div className="flex gap-6 h-full">
          {/* Sidebar for Admin */}
          {isAdmin && (
            <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaComments className="mr-2 text-blue-500" />
                  المحادثات
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto sidebar-container">
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">جاري التحميل...</div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center text-gray-500">
                      <FaComments className="text-4xl mb-2 mx-auto text-gray-300" />
                      <p>لا توجد محادثات</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {conversations.map((conversation) => {
                      const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                      // Count unread messages from users (not admin)
                      const unreadCount = conversation.messages?.filter(msg => 
                        !msg.isRead && msg.sender?.isSuperuser !== true
                      ).length || 0;
                      
                      return (
                        <div
                          key={conversation.id}
                          onClick={() => fetchUserMessages(conversation.userId)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                            selectedUserId === conversation.userId
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <FaUser className="text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {conversation.user.fullName}
                                  </h5>
                                  {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {lastMessage?.content || 'لا توجد رسائل'}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <FaClock className="text-xs text-gray-400" />
                                  <span className="text-xs text-gray-400">
                                    {formatConversationTime(conversation.updatedAt)}
                                  </span>
                                  {unreadCount > 0 && (
                                    <span className="text-xs text-red-500 font-medium">
                                      {unreadCount} رسالة جديدة
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${isAdmin ? 'flex-1' : 'w-full'}`}>
            {isAdmin && !selectedUserId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FaComments className="text-6xl text-gray-300 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة</h3>
                  <p className="text-gray-500">اختر محادثة من القائمة لعرض الرسائل</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-1 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {isAdmin ? (
                        conversations.find(c => c.userId === selectedUserId)?.user?.fullName?.charAt(0) || 'م'
                      ) : (
                        'د'
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isAdmin ? (
                          conversations.find(c => c.userId === selectedUserId)?.user?.fullName || 'مستخدم'
                        ) : (
                          'الدعم الفني'
                        )}
                      </h3>
                
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">جاري تحميل الرسائل...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-2">💬</div>
                        <p className="text-gray-500">لا توجد رسائل بعد</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Determine if message is from admin or user
                      const isFromAdmin = message.sender?.isSuperuser === true;
                      const isFromCurrentUser = message.senderId === userFromHook?.id;
                      
                      // For admin view: show user messages on right, admin messages on left
                      // For user view: show user messages on right, admin messages on left
                      const shouldShowOnRight = isFromCurrentUser;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${shouldShowOnRight ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              shouldShowOnRight
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">
                                {shouldShowOnRight 
                                  ? (isAdmin ? conversations.find(c => c.userId === selectedUserId)?.user?.fullName || 'مستخدم' : 'أنت')
                                  : 'الأدمن'
                                }
                              </span>
                              <span className={`text-xs ${
                                shouldShowOnRight 
                                  ? 'text-blue-100' 
                                  : 'text-green-100'
                              }`}>
                                {formatMessageTime(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {!message.isRead && !shouldShowOnRight && (
                              <div className="flex justify-end mt-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  
                  {/* Typing Indicator */}
                  {getTypingIndicator()}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={handleTyping}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                      disabled={!isConnected && !isAdmin}
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim() || (!isConnected && !isAdmin) || isSendingMessage}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {isSendingMessage ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          إرسال...
                        </>
                      ) : (
                        'إرسال'
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;

