import React from 'react';
import { useChat } from '../../contexts/ChatContext';

const ChatStatusIndicator = () => {
  const { isConnected } = useChat();

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-xs text-gray-500">
        {isConnected ? 'متصل' : 'غير متصل'}
      </span>
    </div>
  );
};

export default ChatStatusIndicator;






