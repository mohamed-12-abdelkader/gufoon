import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import LoginAdmin from "../../Hook/admin/useLogin";
import { Input } from "@chakra-ui/react";

const LoginModal = ({ show, handleClose }) => {
  const [
    handleLogin,
    passChange,
    mailChange,
    user_name,
    pass,
    userType,
    setUserType,
    loading,
  ] = LoginAdmin();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>تسجيل الدخول</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "300px" }}>
        <div dir="rtl" className=" p-2 form md:p-5">
          <h6> اسم المستخدم </h6>
          <Input
            value={user_name}
            onChange={mailChange}
            dir="rtl"
            placeholder="اسم المستخدم "
            size="lg"
            className="my-3 bg-white h-5 "
          />
          <h6> كلمة السر </h6>
          <Input
            value={pass}
            onChange={passChange}
            dir="rtl"
            placeholder="كلمة السر"
            size="lg"
            className="my-3 bg-white "
          />
        </div>
        <div className="text-center mb-5">
          <Button colorScheme="blue" onClick={handleLogin}>
            {loading ? <Spinner /> : "  تسجيل الدخول"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
