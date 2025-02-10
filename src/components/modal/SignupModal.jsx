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
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const SignupModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success("تم إنشاء الحساب بنجاح!");
      handleClose(); // Close the modal
    } catch (error) {
      toast.error(
        error.response?.data?.details || "خطأ في تسجيل الدخول، حاول مجددًا"
      );
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
            <FormControl>
              <FormLabel>الاسم الكامل</FormLabel>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="الاسم الكامل"
                icon={<Icon as={FaUser} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="البريد الإلكتروني"
                icon={<Icon as={FaEnvelope} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>كلمة المرور</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="كلمة المرور"
                icon={<Icon as={FaLock} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>رقم الهاتف</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="رقم الهاتف"
                icon={<Icon as={FaPhone} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>المدينة</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="المدينة"
                icon={<Icon as={FaCity} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>العنوان بالتفصيل</FormLabel>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="العنوان بالتفصيل"
                rows={2}
                icon={<Icon as={FaMapMarkerAlt} />}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText="إنشاء الحساب"
              width="full"
              mt={4}
            >
              إنشاء الحساب
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;

