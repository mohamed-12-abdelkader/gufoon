import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
  HStack,
  Icon,
  Box,
  Text,
  Divider,
  useColorModeValue,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const SignupModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  
  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم مطلوب";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "الاسم يجب أن يكون أكثر من حرفين";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "بريد إلكتروني غير صالح";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (!formData.phoneNumber.match(/^\d+$/) || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    toast.info("جارٍ إنشاء الحساب، يرجى الانتظار...");

    try {
      await register(formData);
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "خطأ في التسجيل، حاول مجددًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={show} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent 
        bg={bgColor} 
        borderRadius="xl" 
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        dir="rtl"
        maxH="90vh"
        overflowY="auto"
      >
        <form onSubmit={handleSignup}>
          <ModalHeader 
            textAlign="center" 
            fontSize="2xl" 
            fontWeight="bold" 
            color="blue.500"
            borderBottom="1px solid"
            borderColor={borderColor}
            pb={4}
          >
            إنشاء حساب جديد
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={6}>
              {/* Welcome Text */}
              <Box textAlign="center">
                <Text fontSize="lg" color={textColor} mb={2}>
                  انضم إلينا اليوم
                </Text>
                <Text fontSize="sm" color={textColor}>
                  أنشئ حسابك للاستمتاع بتجربة تسوق مميزة
                </Text>
              </Box>

              <Divider />

              {/* Form Fields */}
              <VStack spacing={5} w="full">
                {/* Full Name */}
                <FormControl isInvalid={!!errors.fullName} w="full">
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    الاسم الكامل
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
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
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                </FormControl>

                {/* Email */}
                <FormControl isInvalid={!!errors.email} w="full">
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    البريد الإلكتروني
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaEnvelope} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني"
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
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                {/* Password */}
                <FormControl isInvalid={!!errors.password} w="full">
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    كلمة المرور
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                    <InputRightElement>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon as={showPassword ? FaEyeSlash : FaEye} color="gray.400" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* Phone Number */}
                <FormControl isInvalid={!!errors.phoneNumber} w="full">
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    رقم الهاتف
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="أدخل رقم هاتفك"
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
                  <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                </FormControl>
              </VStack>
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
                isLoading={loading}
                loadingText="جاري إنشاء الحساب..."
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
                إنشاء الحساب
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

export default SignupModal;
