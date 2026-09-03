import React, { useState } from "react";
import { Modal, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import PaymentMethodPicker from "../checkout/PaymentMethodPicker";
import { saveGuestPendingPayment } from "../../utils/guestPayment";
import "./BuyNowModal.css";

const BuyNowModal = ({ show, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paymob");
  const [isLoading, setIsLoading] = useState(false);
  const isGuest = !localStorage.getItem("token");

  const unitPrice = product?.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product?.price || 0;

  const imageSrc =
    product?.cover ||
    product?.productImages?.[0]?.url ||
    product?.ProductImages?.[0]?.url ||
    "https://via.placeholder.com/160x160?text=Guffon";

  const resetForm = () => {
    setQuantity(1);
    setShippingAddress("");
    setFullName("");
    setPhoneNumber("");
    setCity("");
    setPaymentMethod("paymob");
  };

  const closeModal = () => {
    if (isLoading) return;
    handleClose();
  };

  const changeQty = (delta) => {
    const max = product?.stock || 1;
    setQuantity((current) => Math.min(max, Math.max(1, current + delta)));
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();

    const guest = !localStorage.getItem("token");
    if (guest) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        toast.error("يرجى إدخال الاسم الكامل");
        return;
      }
      if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
        toast.error("يرجى إدخال رقم هاتف صحيح");
        return;
      }
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      toast.error("يرجى إدخال عنوان الشحن الكامل");
      return;
    }

    if (quantity < 1 || quantity > (product?.stock || 0)) {
      toast.error(`الكمية المتاحة ${product?.stock || 0} قطعة فقط`);
      return;
    }

    const token = localStorage.getItem("token");
    const cartItems = [{ productId: product.id, quantity }];
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const customerPhone =
      phoneNumber.trim() || user.phoneNumber || user.phone || "";

    if (paymentMethod === "paymob" && (!customerPhone || customerPhone.length < 8)) {
      toast.error("يرجى إدخال رقم هاتف لإتمام الدفع الإلكتروني");
      return;
    }

    setIsLoading(true);
    toast.info("جاري معالجة الطلب...");

    try {
      if (token) {
        const { data: order } = await baseUrl.post(
          "api/orders/me",
          {
            shippingAddress: shippingAddress.trim(),
            city: city.trim() || undefined,
            paymentMethod,
            cartItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (paymentMethod === "paymob") {
          toast.info("جاري التوجيه إلى صفحة الدفع...");
          const paymentResponse = await baseUrl.post(
            "api/paymob/create-intention",
            {
              orderId: order.id,
              amount: parseFloat(order.totalAmount),
              currency: "SAR",
              customerName: user.fullName || user.name || fullName.trim() || "عميل",
              customerEmail: user.email || "",
              customerPhone,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (paymentResponse.data?.checkoutUrl) {
            resetForm();
            handleClose();
            window.location.href = paymentResponse.data.checkoutUrl;
            return;
          }
          throw new Error("لم يتم إنشاء رابط الدفع");
        }

        toast.success("تم إرسال الطلب بنجاح. الدفع عند الاستلام.");
        resetForm();
        handleClose();
        return;
      }

      const { data } = await baseUrl.post("api/orders/guest", {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        shippingAddress: shippingAddress.trim(),
        city: city.trim() || undefined,
        paymentMethod,
        cartItems,
      });

      if (paymentMethod === "paymob") {
        saveGuestPendingPayment(data?.id, phoneNumber.trim());
        resetForm();
        handleClose();
        if (data?.checkoutUrl) {
          toast.info("جاري التوجيه إلى صفحة الدفع...");
          window.location.href = data.checkoutUrl;
          return;
        }
        toast.error(
          data?.paymentError ||
            "تم تسجيل الطلب لكن تعذر إنشاء رابط الدفع. يمكنك إعادة المحاولة الآن."
        );
        window.location.href = `/payment/callback?order_id=${data?.id || ""}&success=false`;
        return;
      }

      toast.success(
        "تم تسجيل طلبك بنجاح. سنتواصل معك لتأكيد الطلب والدفع عند الاستلام."
      );
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "خطأ في إرسال الطلب، حاول مجدداً");
    } finally {
      setIsLoading(false);
    }
  };

  const total = (unitPrice * quantity).toFixed(2);

  return (
    <Modal show={show} onHide={closeModal} size="lg" centered dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title>شراء الآن</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleBuyNow}>
          <div className="order-summary-modal mb-4 p-3 rounded d-flex gap-3 align-items-center">
            <img
              src={imageSrc}
              alt={product?.name || "منتج"}
              className="buy-now-product-img"
            />
            <div className="flex-grow-1">
              <div className="fw-bold mb-1">{product?.name}</div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <strong>{unitPrice.toFixed(2)} ر.س</strong>
                {product?.discount > 0 && (
                  <small className="text-muted text-decoration-line-through">
                    {product.price} ر.س
                  </small>
                )}
                <small className="text-muted">متوفر: {product?.stock || 0}</small>
              </div>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold mb-2">الكمية</Form.Label>
            <InputGroup style={{ maxWidth: 180 }}>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => changeQty(-1)}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </Button>
              <Form.Control
                className="text-center"
                value={quantity}
                readOnly
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => changeQty(1)}
                disabled={quantity >= (product?.stock || 1)}
              >
                <FaPlus />
              </Button>
            </InputGroup>
          </Form.Group>

          {isGuest && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold mb-2">الاسم الكامل *</Form.Label>
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="اسم المستلم"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold mb-2">المدينة</Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="الرياض"
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold mb-2">عنوان الشحن *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="أدخل عنوان الشحن الكامل (المدينة، الحي، الشارع، رقم المبنى)"
              required
              style={{ minHeight: "100px" }}
            />
            <Form.Text className="text-muted">
              يرجى إدخال عنوان الشحن الكامل لضمان وصول الطلب بشكل صحيح
            </Form.Text>
          </Form.Group>

          <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold mb-2">رقم الهاتف *</Form.Label>
            <Form.Control
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="05xxxxxxxx"
              required={isGuest || paymentMethod === "paymob"}
              pattern={isGuest ? "[0-9]{8,15}" : "[0-9]{10,15}"}
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <Form.Text className="text-muted">
              {isGuest
                ? "مطلوب للتواصل وتأكيد الطلب أو إتمام الدفع الإلكتروني"
                : "مطلوب لإتمام الدفع الإلكتروني (10 أرقام على الأقل)، أو يُستخدم رقمك المحفوظ في الحساب"}
            </Form.Text>
          </Form.Group>

          <div className="order-summary-modal mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between mb-2">
              <span>المجموع الفرعي:</span>
              <strong>{total} ر.س</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>الإجمالي:</strong>
              <strong className="text-primary fs-5">{total} ر.س</strong>
            </div>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-3 fw-bold"
            disabled={isLoading || !shippingAddress.trim()}
            style={{
              background: "linear-gradient(45deg, #0078FF, #0056CC)",
              border: "none",
              fontSize: "1.1rem",
              borderRadius: "12px",
            }}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                {paymentMethod === "paymob"
                  ? "جاري التوجيه إلى صفحة الدفع..."
                  : "جاري تأكيد الطلب..."}
              </>
            ) : paymentMethod === "paymob" ? (
              "إتمام الطلب والانتقال للدفع"
            ) : (
              "تأكيد الطلب (الدفع عند الاستلام)"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BuyNowModal;
