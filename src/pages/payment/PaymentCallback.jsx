import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert, Badge, Form } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import {
  saveGuestPendingPayment,
  readGuestPendingPayment,
  clearGuestPendingPayment,
} from "../../utils/guestPayment";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);
  const [retryPhone, setRetryPhone] = useState(
    () => readGuestPendingPayment()?.phoneNumber || ""
  );

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Paymob قد يرسل معلومات في URL parameters
        const success = searchParams.get("success");
        const orderIdParam = searchParams.get("order_id");

        if (orderIdParam) {
          setOrderId(orderIdParam);
        }

        // التحقق من حالة الطلب من API
        if (orderIdParam) {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await baseUrl.get(`api/orders/me/${orderIdParam}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const order = response.data;
              setOrderDetails(order);

              // التحقق من حالة الدفع
              if (order.paymentStatus === "paid" || order.status === "Processing") {
                setStatus("success");
                clearGuestPendingPayment();
                toast.success("تم الدفع بنجاح!");
              } else if (order.paymentStatus === "failed") {
                setStatus("failed");
                toast.error("فشل الدفع");
              } else {
                // إذا كانت الحالة pending، نتحقق من success parameter
                if (success === "true" || success === "1") {
                  setStatus("success");
                  clearGuestPendingPayment();
                  toast.success("تم الدفع بنجاح!");
                } else {
                  setStatus("failed");
                  toast.error("فشل الدفع");
                }
              }
            } catch (error) {
              console.error("Error fetching order:", error);
              // Fallback to URL parameters
              if (success === "true" || success === "1") {
                setStatus("success");
                clearGuestPendingPayment();
              } else {
                setStatus("failed");
              }
            }
          } else {
            // No token, check URL parameters only
            if (success === "true" || success === "1") {
              setStatus("success");
              clearGuestPendingPayment();
            } else {
              setStatus("failed");
            }
          }
        } else {
          // No order ID, check URL parameters
          if (success === "true" || success === "1") {
            setStatus("success");
            clearGuestPendingPayment();
          } else {
            setStatus("failed");
          }
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const pendingGuestPayment = readGuestPendingPayment();
  const retryOrderId = Number(orderId || pendingGuestPayment?.orderId || 0);
  const canRetryGuestPay = !localStorage.getItem("token") && retryOrderId > 0;

  const handleRetryGuestPayment = async () => {
    const phone = retryPhone.trim() || pendingGuestPayment?.phoneNumber || "";
    if (!retryOrderId || !phone) {
      toast.error("أدخل رقم الجوال المستخدم عند إنشاء الطلب");
      return;
    }

    setRetryLoading(true);
    try {
      const { data } = await baseUrl.post("api/paymob/guest-intention", {
        orderId: retryOrderId,
        phoneNumber: phone,
      });
      if (data?.checkoutUrl) {
        saveGuestPendingPayment(retryOrderId, phone);
        toast.info("جاري التوجيه إلى صفحة الدفع...");
        window.location.href = data.checkoutUrl;
        return;
      }
      toast.error(data?.message || "تعذر إنشاء رابط الدفع");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "تعذر إعادة إنشاء رابط الدفع"
      );
    } finally {
      setRetryLoading(false);
    }
  };

  if (loading) {
    return (
      <Container dir="rtl" className="my-5 pt-5">
        <Card className="text-center p-5">
          <Card.Body>
            <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
            <h4>جاري التحقق من حالة الدفع...</h4>
            <p className="text-muted">يرجى الانتظار</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (status === "success") {
    return (
      <Container dir="rtl" className="my-5 pt-5">
        <Card className="text-center p-5 border-success">
          <Card.Body>
            <div className="mb-4">
              <FaCheckCircle size={80} className="text-success mb-3" />
            </div>
            <h2 className="text-success mb-3">✅ تم الدفع بنجاح!</h2>
            <p className="lead mb-4">
              شكراً لك. تم استلام طلبك وسيتم معالجته قريباً.
            </p>

            {orderDetails && (
              <div className="order-info bg-light p-4 rounded mb-4 text-start">
                <h5 className="mb-3">معلومات الطلب:</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium">رقم الطلب:</span>
                  <strong>#{orderDetails.id}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium">المبلغ الإجمالي:</span>
                  <strong className="text-primary">{orderDetails.totalAmount?.toFixed(2)} ر.س</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium">حالة الطلب:</span>
                  <Badge bg="success">{orderDetails.status}</Badge>
                </div>
                {orderDetails.orderDate && (
                  <div className="d-flex justify-content-between">
                    <span className="fw-medium">تاريخ الطلب:</span>
                    <span>
                      {new Date(orderDetails.orderDate).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {orderId && !orderDetails && (
              <Alert variant="info" className="mb-4">
                <strong>رقم الطلب:</strong> #{orderId}
              </Alert>
            )}

            <div className="d-flex gap-3 justify-content-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/orders")}
                className="px-5"
              >
                عرض الطلبات
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => navigate("/")}
                className="px-5"
              >
                العودة للرئيسية
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container dir="rtl" className="my-5 pt-5">
      <Card className="text-center p-5 border-danger">
        <Card.Body>
          <div className="mb-4">
            <FaTimesCircle size={80} className="text-danger mb-3" />
          </div>
          <h2 className="text-danger mb-3">❌ فشل الدفع</h2>
          <p className="lead mb-4">
            حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى أو اختيار طريقة دفع أخرى.
          </p>

          {canRetryGuestPay && (
            <div className="mx-auto mb-4 text-start" style={{ maxWidth: 420 }}>
              <Alert variant="warning" className="mb-3">
                يمكنك إعادة إنشاء رابط الدفع بدون حساب بنفس رقم الجوال.
              </Alert>
              {retryOrderId > 0 && (
                <p className="mb-2">
                  رقم الطلب: <strong>#{retryOrderId}</strong>
                </p>
              )}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">رقم الجوال</Form.Label>
                <Form.Control
                  type="tel"
                  value={retryPhone}
                  onChange={(e) => setRetryPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  style={{ direction: "ltr", textAlign: "left" }}
                />
              </Form.Group>
              <Button
                variant="success"
                size="lg"
                className="w-100"
                disabled={retryLoading}
                onClick={handleRetryGuestPayment}
              >
                {retryLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    جاري إنشاء رابط الدفع...
                  </>
                ) : (
                  "إعادة إنشاء رابط الدفع"
                )}
              </Button>
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="danger"
              size="lg"
              onClick={() => navigate("/cart")}
              className="px-5"
            >
              العودة إلى السلة
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate("/")}
              className="px-5"
            >
              العودة للرئيسية
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentCallback;

