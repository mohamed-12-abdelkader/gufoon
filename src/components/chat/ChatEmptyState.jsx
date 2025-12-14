import React from 'react';

const ChatEmptyState = ({ isAdmin = false }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">
          {isAdmin ? '👥' : '💬'}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isAdmin ? 'لا توجد محادثات' : 'اختر محادثة'}
        </h3>
        <p className="text-gray-500">
          {isAdmin 
            ? 'ستظهر المحادثات هنا عندما يبدأ المستخدمون محادثات جديدة'
            : 'اختر محادثة من القائمة لبدء الدردشة'
          }
        </p>
      </div>
    </div>
  );
};

export default ChatEmptyState;







