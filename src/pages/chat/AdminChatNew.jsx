import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import UserType from '../../Hook/userType/UserType';
import baseUrl from '../../api/baseUrl';

const AdminChatNew = () => {
  const { user } = useAuth();
  const [userData, isAdmin, userFromHook] = UserType();
  const { 
    messages, 
    sendMessage, 
    sendTyping, 
    typingUsers, 
    fetchMessages,
    setMessagesList,
    isConnected 
  } = useChat();
  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch users who have sent messages
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get('/api/chat/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Get conversation with selected user
  const getConversationWithUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get(`/api/chat/conversations/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setConversationId(response.data.id);
        fetchMessages(response.data.id);
      }
    } catch (error) {
      console.error('Error getting conversation:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedUserId) {
      getConversationWithUser(selectedUserId);
      const user = users.find(u => u.id === selectedUserId);
      setSelectedUser(user);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !conversationId) return;

    try {
      await sendMessage(conversationId, messageText.trim());
      setMessageText('');
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1000);
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

  const getTypingIndicator = () => {
    const isUserTyping = typingUsers[selectedUserId];
    if (isUserTyping) {
      return (
        <div className="flex items-center space-x-2 text-gray-500 text-sm p-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>{selectedUser?.name} يكتب...</span>
        </div>
      );
    }
    return null;
  };

  if (!userData || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600">يجب أن تكون إداري للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">إدارة المحادثات</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-500">
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Users List */}
            <div className="w-1/3 border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">المستخدمون</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-gray-400 text-4xl mb-2">👥</div>
                      <p className="text-gray-500">لا يوجد مستخدمون</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          selectedUserId === user.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name?.[0] || 'م'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {user.name || 'مستخدم'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email || 'لا يوجد إيميل'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedUser.name?.[0] || 'م'}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedUser.name || 'مستخدم'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email || 'لا يوجد إيميل'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-gray-400 text-4xl mb-2">💬</div>
                          <p className="text-gray-500">لا توجد رسائل بعد</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === userFromHook?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === userFromHook?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">
                                {message.senderId === userFromHook?.id ? 'أنت' : selectedUser.name}
                              </span>
                              <span className={`text-xs ${
                                message.senderId === userFromHook?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatMessageTime(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {/* Typing Indicator */}
                    {getTypingIndicator()}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={handleTyping}
                        placeholder="اكتب رسالتك..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                        disabled={!isConnected}
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim() || !isConnected}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        إرسال
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">اختر مستخدم</h3>
                    <p className="text-gray-500">اختر مستخدم من القائمة لبدء الدردشة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatNew;

