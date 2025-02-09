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
  Spinner,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const { login } = useAuth()

  const navigate = useNavigate();

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
    <>
      <Modal isOpen={show} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleLogin}>
            <ModalHeader>تسجيل الدخول</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div dir="rtl">
                <h6>اسم المستخدم</h6>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="اسم المستخدم"
                  size="lg"
                  mb={4}
                />
                <h6>كلمة السر</h6>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة السر"
                  size="lg"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit" isDisabled={pending}>
                {pending ? <Spinner size="sm" /> : "تسجيل الدخول"}
              </Button>
              <Button variant="ghost" ml={3} onClick={handleClose}>
                إلغاء
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
