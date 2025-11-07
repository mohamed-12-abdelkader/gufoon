import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import baseUrl from "../api/baseUrl";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  
  const { token, user, isAdmin } = useAuth();
  const typingTimeoutRef = useRef({});

  // Initialize Socket.IO connection
  useEffect(() => {
    if (token && user) {
      const newSocket = io("https://api.gufoon.shop/", {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      // Listen for new messages
      newSocket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
        
        // Add notification if message is not from current user
        if (message.senderId !== user.id) {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'message',
            message: message,
            timestamp: new Date()
          }]);
        }
      });

      // Listen for typing indicators
      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token, user]);

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.get(`/api/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async (conversationId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await baseUrl.post('/api/chat/messages', {
        conversationId,
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (socket) {
        socket.emit('send_message', {
          conversationId,
          content
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Send typing indicator
  const sendTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', {
        isTyping
      });
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Set messages
  const setMessagesList = (newMessages) => {
    setMessages(newMessages);
  };

  const value = {
    // State
    socket,
    messages,
    isConnected,
    notifications,
    typingUsers,
    
    // Actions
    fetchMessages,
    sendMessage,
    sendTyping,
    clearNotifications,
    removeNotification,
    setMessagesList
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};