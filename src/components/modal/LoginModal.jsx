import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Box,
  Text,
  Divider,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth()

  const navigate = useNavigate();
  
  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleLogin = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      await login({ username, password });
      toast.success("تم تسجيل الدخول بنجاح");
      handleClose();
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.details || "خطأ في تسجيل الدخول، حاول مجددًا"
      );
    } finally {
      setPending(false);
    }
  };

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
        <form onSubmit={handleLogin}>
          <ModalHeader 
            textAlign="center" 
            fontSize="2xl" 
            fontWeight="bold" 
            color="blue.500"
            borderBottom="1px solid"
            borderColor={borderColor}
            pb={4}
          >
            تسجيل الدخول
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={8}>
            <VStack spacing={6}>
              {/* Welcome Text */}
              <Box textAlign="center">
                <Text fontSize="lg" color={textColor} mb={2}>
                  مرحباً بك مرة أخرى
                </Text>
                <Text fontSize="sm" color={textColor}>
                  سجل دخولك للوصول إلى حسابك
                </Text>
              </Box>

              <Divider />

              {/* Username Input */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="medium" color={textColor} mb={2}>
                  اسم المستخدم
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    size="lg"
                    borderRadius="lg"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce"
                    }}
                    _hover={{
                      borderColor: "blue.300"
                    }}
                  />
                </InputGroup>
              </Box>

              {/* Password Input */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="medium" color={textColor} mb={2}>
                  كلمة المرور
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    size="lg"
                    borderRadius="lg"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce"
                    }}
                    _hover={{
                      borderColor: "blue.300"
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    position="absolute"
                    right="0"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                  >
                    <Icon as={showPassword ? FaEyeSlash : FaEye} color="gray.400" />
                  </Button>
                </InputGroup>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter 
            borderTop="1px solid" 
            borderColor={borderColor} 
            pt={4}
            justifyContent="center"
          >
            <HStack spacing={4} w="full">
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={pending}
                loadingText="جاري تسجيل الدخول..."
                size="lg"
                flex={1}
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
              >
                تسجيل الدخول
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClose}
                size="lg"
                flex={1}
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
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
