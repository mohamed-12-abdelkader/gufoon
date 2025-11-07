import React from "react";
import { Button, Box, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, VStack, HStack, Text, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { FaComments, FaPaperPlane, FaUser } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import UserType from "../../Hook/userType/UserType";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import ChatTooltip from "./ChatTooltip";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import baseUrl from "../../api/baseUrl";
import io from "socket.io-client";

const FloatingChatButton = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  const toast = useToast();
  
  const { userData } = useAuth();
  const { unreadCount } = useChat();
  const [userDataFromHook, isAdmin] = UserType();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Fetch messages from API
  const fetchMessages = async () => {
    if (!userData && !userDataFromHook) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get('/api/chat/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.messages) {
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender.isSuperuser ? "admin" : "user",
          timestamp: new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          isRead: msg.isRead,
          senderName: msg.sender.fullName
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "خطأ في جلب الرسائل",
        description: "حدث خطأ أثناء جلب الرسائل",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    if (!userData && !userDataFromHook) {
      // Show login modal for unauthenticated users
      setShowLoginModal(true);
      return;
    }
    // Open chat modal for authenticated users and fetch messages
    setShowChatModal(true);
    fetchMessages();
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    const tempId = Date.now();
    
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.post('/api/chat/send', {
        content: message.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Add the sent message to the messages list immediately
        const newMessage = {
          id: tempId, // Temporary ID
          text: message.trim(),
          sender: "user",
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          senderName: userData?.name || userDataFromHook?.name || "مستخدم"
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage("");
        
        toast({
          title: "تم إرسال الرسالة",
          description: "تم إرسال رسالتك بنجاح",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        // Emit message via socket for real-time updates
        if (socket) {
          socket.emit('send_message', {
            content: message.trim(),
            tempId: tempId
          });
        }
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
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Socket.IO connection
  useEffect(() => {
    if (userData || userDataFromHook) {
      const token = localStorage.getItem('token');
      const newSocket = io('https://api.gufoon.shop/', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('new_message', (messageData) => {
        console.log('New message received:', messageData);
        const formattedMessage = {
          id: messageData.id,
          text: messageData.content,
          sender: messageData.sender.isSuperuser ? "admin" : "user",
          timestamp: new Date(messageData.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          isRead: messageData.isRead,
          senderName: messageData.sender.fullName
        };
        
        setMessages(prev => [...prev, formattedMessage]);
        scrollToBottom();
      });

      newSocket.on('message_sent', (messageData) => {
        console.log('Message sent confirmation:', messageData);
        // Update the message with real ID from server
        setMessages(prev => prev.map(msg => 
          msg.id === messageData.tempId ? {
            ...msg,
            id: messageData.id,
            isRead: messageData.isRead
          } : msg
        ));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userData, userDataFromHook]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (actionText) => {
    setMessage(actionText);
    // Auto send the quick action message after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex="1000"
        className="floating-chat-container"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ChatTooltip 
          isVisible={showTooltip} 
          onClose={() => setShowTooltip(false)} 
        />
        <Button
          onClick={handleOpenChat}
          size="lg"
          borderRadius="full"
          bgGradient="linear(to-r, #0078FF, #0056CC)"
          _hover={{
            bgGradient: "linear(to-r, #0056CC, #004499)",
            transform: "scale(1.05)",
            boxShadow: "0 8px 25px rgba(0, 120, 255, 0.4)"
          }}
          _active={{
            transform: "scale(0.95)"
          }}
          boxShadow="0 4px 15px rgba(0, 120, 255, 0.3)"
          transition="all 0.3s ease"
          className="floating-chat-button"
          style={{
            width: "60px",
            height: "60px",
            position: "relative"
          }}
          title="الدردشة السريعة"
        >
          <Icon as={FaComments} boxSize={6} color="white" />
          
          {/* Notification Badge */}
          {userData && unreadCount > 0 && (
            <Box
              position="absolute"
              top="-5px"
              right="-5px"
              bg="red.500"
              color="white"
              borderRadius="full"
              width="20px"
              height="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              className="notification-badge"
              minWidth="20px"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Box>
          )}
        </Button>
      </Box>

      {/* Chat Modal */}
      <Modal isOpen={showChatModal} onClose={handleCloseChatModal} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={bgColor} 
          borderRadius="xl" 
          boxShadow="2xl"
          border="1px solid"
          borderColor={borderColor}
          dir="rtl"
          position="fixed"
          bottom="100px"
          right="20px"
          width="400px"
          maxHeight="500px"
        >
          <ModalHeader 
            textAlign="center" 
            fontSize="lg" 
            fontWeight="bold" 
            color="blue.500"
            borderBottom="1px solid"
            borderColor={borderColor}
            pb={3}
            style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}
          >
            <HStack spacing={3} justify="center">
              <Icon as={FaComments} color="blue.500" />
              <Text>الدردشة السريعة</Text>
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={isConnected ? "green.500" : "red.500"}
                title={isConnected ? "متصل" : "غير متصل"}
              />
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={4}>
            <VStack spacing={4} align="stretch">
              {/* User Info */}
  

              {/* Chat Messages Area */}
              <Box 
                height="300px" 
                overflowY="auto" 
                p={3} 
                bg="gray.50" 
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                {isLoading ? (
                  <VStack spacing={3} align="center" justify="center" height="100%">
                    <Text fontSize="sm" color="gray.500" style={{ fontFamily: 'var(--font-primary)' }}>
                      جاري تحميل الرسائل...
                    </Text>
                  </VStack>
                ) : messages.length === 0 ? (
                  <VStack spacing={3} align="center" justify="center" height="100%">
                    <Text fontSize="sm" color="gray.500" style={{ fontFamily: 'var(--font-primary)' }}>
                      لا توجد رسائل بعد. ابدأ المحادثة!
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {messages.map((msg) => (
                      <Box 
                        key={msg.id}
                        alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                        bg={msg.sender === "user" ? "blue.500" : "white"}
                        color={msg.sender === "user" ? "white" : "gray.800"}
                        p={2} 
                        borderRadius="lg" 
                        boxShadow="sm"
                        maxWidth="80%"
                      >
                        <Text fontSize="sm" style={{ fontFamily: 'var(--font-primary)' }}>
                          {msg.text}
                        </Text>
                        <Text 
                          fontSize="xs" 
                          color={msg.sender === "user" ? "blue.100" : "gray.500"} 
                          mt={1}
                        >
                          {msg.timestamp}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <HStack spacing={2}>
                <Box flex={1}>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    borderRadius="full"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#0078FF",
                      boxShadow: "0 0 0 1px #0078FF"
                    }}
                    style={{
                      fontFamily: 'var(--font-primary)',
                      fontSize: '14px'
                    }}
                  />
                </Box>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  borderRadius="full"
                  bgGradient="linear(to-r, #0078FF, #0056CC)"
                  _hover={{
                    bgGradient: "linear(to-r, #0056CC, #004499)",
                    transform: "scale(1.05)"
                  }}
                  disabled={!message.trim() || isSending}
                  isLoading={isSending}
                  loadingText="إرسال..."
                  style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px"
                  }}
                >
                  <Icon as={FaPaperPlane} boxSize={4} color="white" />
                </Button>
              </HStack>

              {/* Quick Actions */}
            
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Auth Modals */}
      <LoginModal 
        show={showLoginModal} 
        handleClose={() => setShowLoginModal(false)} 
      />
      <SignupModal 
        show={showSignupModal} 
        handleClose={() => setShowSignupModal(false)} 
      />

      {/* Custom Styles */}
      <style jsx>{`
        .floating-chat-button {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 15px rgba(0, 120, 255, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(0, 120, 255, 0.5);
          }
          100% {
            box-shadow: 0 4px 15px rgba(0, 120, 255, 0.3);
          }
        }
        
        .notification-badge {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
        
        .floating-chat-container:hover .floating-chat-button {
          animation: none;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .floating-chat-container {
            bottom: 15px !important;
            right: 15px !important;
          }
          
          .floating-chat-button {
            width: 50px !important;
            height: 50px !important;
          }
        }
        
        @media (max-width: 480px) {
          .floating-chat-container {
            bottom: 10px !important;
            right: 10px !important;
          }
          
          .floating-chat-button {
            width: 45px !important;
            height: 45px !important;
          }
        }
        
        /* Tooltip Animation */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chat-tooltip {
          z-index: 1001;
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;