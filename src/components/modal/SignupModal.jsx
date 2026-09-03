import React, { useState } from "react";
import { Modal, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthModal.css";

const SignupModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم مطلوب";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "الاسم يجب أن يكون أكثر من حرفين";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (!formData.phoneNumber.match(/^\d+$/) || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    toast.info("جارٍ إنشاء الحساب، يرجى الانتظار...");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      };
      await register(payload);

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        toast.success("✅ تم إنشاء الحساب بنجاح! تم حفظ التوكين.");
      } else {
        toast.warning("تم إنشاء الحساب لكن لم يتم حفظ التوكين");
      }

      handleClose();
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "خطأ في التسجيل، حاول مجددًا";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      <Form onSubmit={handleSignup}>
        <Modal.Header closeButton>
          <Modal.Title>إنشاء حساب جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="auth-lead">انضم إلينا اليوم</p>
          <p className="auth-hint">أنشئ حسابك للاستمتاع بتجربة تسوق مميزة</p>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold mb-2">الاسم الكامل</Form.Label>
            <Form.Control
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              isInvalid={!!errors.fullName}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold mb-2">رقم الهاتف</Form.Label>
            <Form.Control
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="مثال: 0501234567"
              isInvalid={!!errors.phoneNumber}
              required
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="fw-bold mb-2">كلمة المرور</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                جاري إنشاء الحساب...
              </>
            ) : (
              "إنشاء الحساب"
            )}
          </Button>
          <Button
            type="button"
            className="flex-grow-1 py-3 fw-bold auth-btn-ghost"
            onClick={handleClose}
            disabled={loading}
          >
            إلغاء
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SignupModal;
