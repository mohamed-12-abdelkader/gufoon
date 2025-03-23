import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const SignupModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "الاسم مطلوب";
    if (!formData.email.includes("@")) newErrors.email = "بريد إلكتروني غير صالح";
    if (!formData.phoneNumber.match(/^\d+$/)) newErrors.phoneNumber = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
    if (!formData.city.trim()) newErrors.city = "المدينة مطلوبة";
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (formData.password.length < 8) newErrors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";

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
    <Modal isOpen={show} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader textAlign="center">إنشاء حساب جديد</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} as="form" onSubmit={handleSignup}>
            <FormControl isInvalid={!!errors.fullName}>
              <FormLabel>الاسم الكامل</FormLabel>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="الاسم الكامل" icon={<Icon as={FaUser} />} />
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" icon={<Icon as={FaEnvelope} />} />
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>كلمة المرور</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="كلمة المرور" icon={<Icon as={FaLock} />} />
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}> {/* ✅ Updated field */}
              <FormLabel>رقم الهاتف</FormLabel>
              <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="رقم الهاتف" icon={<Icon as={FaPhone} />} />
            </FormControl>

            <FormControl isInvalid={!!errors.city}>
              <FormLabel>المدينة</FormLabel>
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="المدينة" icon={<Icon as={FaCity} />} />
            </FormControl>

            <FormControl isInvalid={!!errors.address}>
              <FormLabel>العنوان بالتفصيل</FormLabel>
              <Textarea name="address" value={formData.address} onChange={handleChange} placeholder="العنوان بالتفصيل" rows={2} icon={<Icon as={FaMapMarkerAlt} />} />
            </FormControl>

            <Button colorScheme="blue" type="submit" isLoading={loading} loadingText="إنشاء الحساب" width="full" mt={4}>
              إنشاء الحساب
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
