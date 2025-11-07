import React, { useState } from "react";
import { Box, Text, Icon } from "@chakra-ui/react";
import { FaComments, FaTimes } from "react-icons/fa";

const ChatTooltip = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <Box
      position="absolute"
      bottom="70px"
      right="0"
      bg="white"
      borderRadius="lg"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
      p={3}
      minWidth="200px"
      border="1px solid"
      borderColor="gray.200"
      className="chat-tooltip"
      style={{
        fontFamily: 'var(--font-primary)',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontSize="sm" fontWeight="semibold" color="blue.600">
          الدردشة السريعة
        </Text>
        <Icon 
          as={FaTimes} 
          boxSize={3} 
          color="gray.400" 
          cursor="pointer"
          onClick={onClose}
          _hover={{ color: "gray.600" }}
        />
      </Box>
      
      <Text fontSize="xs" color="gray.600" lineHeight="1.4">
        اضغط للدردشة مع فريق الدعم أو طرح الأسئلة
      </Text>
      
      {/* Arrow pointing down */}
      <Box
        position="absolute"
        bottom="-8px"
        right="20px"
        width="0"
        height="0"
        borderLeft="8px solid transparent"
        borderRight="8px solid transparent"
        borderTop="8px solid white"
      />
    </Box>
  );
};

export default ChatTooltip;





