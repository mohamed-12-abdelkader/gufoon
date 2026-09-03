import React, { useState } from "react";
import { Modal, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthModal.css";

const LoginModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
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
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
      className="auth-modal"
    >
      <Form onSubmit={handleLogin}>
        <Modal.Header closeButton>
          <Modal.Title>تسجيل الدخول</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="auth-lead">مرحباً بك مرة أخرى</p>
          <p className="auth-hint">سجل دخولك للوصول إلى حسابك</p>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold mb-2">اسم المستخدم</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-bold mb-2">كلمة المرور</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
              />
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex gap-2">
          <Button
            type="submit"
            className="flex-grow-1 py-3 fw-bold auth-btn-primary"
            disabled={pending}
          >
            {pending ? (
              <>
                <Spinner size="sm" className="me-2" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
          <Button
            type="button"
            className="flex-grow-1 py-3 fw-bold auth-btn-ghost"
            onClick={handleClose}
            disabled={pending}
          >
            إلغاء
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LoginModal;
