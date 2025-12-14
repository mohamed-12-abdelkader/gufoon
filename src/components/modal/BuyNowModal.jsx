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
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
  Box,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "../../api/baseUrl";

const BuyNowModal = ({ show, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const validateForm = () => {
    let newErrors = {};

    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = "العنوان مطلوب";
    } else if (shippingAddress.trim().length < 10) {
      newErrors.shippingAddress = "العنوان يجب أن يكون أكثر من 10 أحرف";
    }

    if (quantity < 1) {
      newErrors.quantity = "الكمية يجب أن تكون أكبر من 0";
    } else if (quantity > product?.stock) {
      newErrors.quantity = `الكمية المتاحة ${product?.stock} قطعة فقط`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyNow = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    toast.info("جاري معالجة الطلب...");

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        shippingAddress: shippingAddress.trim(),
        cartItems: [
          {
            productId: product.id,
            quantity: quantity
          }
        ]
      };

      const response = await baseUrl.post('api/orders/me', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("تم إرسال الطلب بنجاح!");
      handleClose();
      
      // Reset form
      setQuantity(1);
      setShippingAddress("");
      setErrors({});
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || "خطأ في إرسال الطلب، حاول مجدداً");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const price = product.discount > 0 
      ? product.price - (product.price * product.discount / 100)
      : product.price;
    return (price * quantity).toFixed(2);
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
      >
        <ModalHeader 
          textAlign="center" 
          fontSize="2xl" 
          fontWeight="bold" 
          color="blue.500"
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
        >
          <HStack justify="center" spacing={3}>
            <Icon as={FaCreditCard} />
            <Text>شراء الآن</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          <VStack spacing={6}>
            {/* Product Summary */}
            <Box w="full" p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {product?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  متوفر: {product?.stock} قطعة
                </Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text fontSize="sm" color={textColor}>
                  السعر: {product?.discount > 0 
                    ? `${(product.price - (product.price * product.discount / 100)).toFixed(2)}ر.س `
                    : `${product?.price}ر.س` 
                  }
                </Text>
                {product?.discount > 0 && (
                  <Text fontSize="sm" color="red.500" textDecoration="line-through">
                    {product?.price}ر.س 
                  </Text>
                )}
              </HStack>
            </Box>

            <Divider />

            {/* Quantity Selection */}
            <FormControl isInvalid={!!errors.quantity} w="full">
              <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                الكمية
              </FormLabel>
              <NumberInput
                value={quantity}
                onChange={(valueString, valueNumber) => setQuantity(valueNumber)}
                min={1}
                max={product?.stock || 1}
                size="lg"
              >
                <NumberInputField 
                  borderRadius="lg"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182ce"
                  }}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            {/* Shipping Address */}
            <FormControl isInvalid={!!errors.shippingAddress} w="full">
              <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                عنوان الشحن
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaMapMarkerAlt} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="أدخل عنوان الشحن الكامل"
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
              <FormErrorMessage>{errors.shippingAddress}</FormErrorMessage>
            </FormControl>

            {/* Total Calculation */}
            <Box w="full" p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  الإجمالي:
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {calculateTotal()}  ر.س
                </Text>
              </HStack>
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
              colorScheme="green"
              onClick={handleBuyNow}
              isLoading={isLoading}
              loadingText="جاري المعالجة..."
              size="lg"
              flex={1}
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
            >
              تأكيد الطلب
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
      </ModalContent>
    </Modal>
  );
};

export default BuyNowModal;






