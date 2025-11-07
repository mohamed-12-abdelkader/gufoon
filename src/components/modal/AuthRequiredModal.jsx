import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FaShoppingCart, FaUserLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const AuthRequiredModal = ({ show, handleClose, onLoginClick, onSignupClick }) => {
  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Modal isOpen={show} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent 
        bg={bgColor} 
        borderRadius="xl" 
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        dir="rtl"
      >
        <ModalHeader 
          textAlign="center" 
          fontSize="2xl" 
          fontWeight="bold" 
          color="orange.500"
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
        >
          <HStack justify="center" spacing={3}>
            <Icon as={FaUserLock} />
            <Text>تسجيل الدخول مطلوب</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={8}>
          <VStack spacing={6}>
            <Box textAlign="center">
              <Text fontSize="lg" color={textColor} mb={4}>
                يجب أن تكون مسجلاً للدخول لإتمام عملية الشراء
              </Text>
              <Text fontSize="sm" color={textColor}>
                اختر إحدى الخيارات التالية للمتابعة
              </Text>
            </Box>

            <Divider />

            <VStack spacing={4} w="full">
              <Button
                colorScheme="blue"
                onClick={onLoginClick}
                size="lg"
                w="full"
                borderRadius="lg"
                fontWeight="medium"
                bgGradient="linear(to-r, blue.400, blue.600)"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: "lg",
                  bgGradient: "linear(to-r, blue.500, blue.700)"
                }}
                transition="all 0.2s"
                _active={{
                  transform: "translateY(0px)"
                }}
                leftIcon={<FaSignInAlt />}
              >
                تسجيل الدخول
              </Button>

              <Button
                colorScheme="green"
                onClick={onSignupClick}
                size="lg"
                w="full"
                borderRadius="lg"
                fontWeight="medium"
                bgGradient="linear(to-r, green.400, green.600)"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: "lg",
                  bgGradient: "linear(to-r, green.500, green.700)"
                }}
                transition="all 0.2s"
                _active={{
                  transform: "translateY(0px)"
                }}
                leftIcon={<FaUserPlus />}
              >
                إنشاء حساب جديد
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
        
        <ModalFooter 
          borderTop="1px solid" 
          borderColor={borderColor} 
          pt={4}
          justifyContent="center"
        >
          <Button 
            variant="outline" 
            onClick={handleClose}
            size="lg"
            borderRadius="lg"
            borderColor={borderColor}
            color={textColor}
            _hover={{
              bg: "gray.50",
              borderColor: "gray.300"
            }}
          >
            إلغاء
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthRequiredModal;