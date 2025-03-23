import React, { useEffect, useState } from "react";
import { Card, Badge, Spinner, Container, Button } from "react-bootstrap";
import { FaBox, FaCheck, FaTruck, FaSpinner, FaTimes, FaBan } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const orderStatusSteps = {
  Pending: 1,
  Processing: 2,
  Shipping: 3,
  Delivered: 4,
  Cancelled: 0,
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/orders/me");
        setOrders(data);
      } catch (error) {
        toast.error("فشل تحميل الطلبات!");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;

    setCanceling(orderId); // Set loading for this order

    try {
      await axios.patch(`/orders/me/${orderId}/cancel`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.success("تم إلغاء الطلب بنجاح");
    } catch (error) {
      toast.error("فشل إلغاء الطلب!");
      console.error("Error canceling order:", error);
    } finally {
      setCanceling(null); // Remove loading state
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">جاري تحميل الطلبات...</p>
      </div>
    );

  return (
    <Container className="py-5 text-center" dir="rtl">
      <h2 className="mb-3">طلباتي</h2>
      <p className="text-muted">يمكنك متابعة حالة طلباتك هنا</p>

      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <Card.Header className="p-4 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">طلب #{order.id}</h3>
              <div>
                {order.status === "Cancelled" ? (
                  <Badge bg="danger">
                    <FaBan className="me-1" /> تم إلغاء الطلب
                  </Badge>
                ) : (
                  <>
                    <span className="fw-bold">الإجمالي:</span> {order.totalAmount} ج.م
                    {["Pending", "Processing"].includes(order.status) && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-3"
                        disabled={canceling === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        {canceling === order.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <>
                            <FaTimes className="me-1" /> إلغاء الطلب
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card.Header>

            {/* Order Tracking */}
            <Card.Body>
              <div className="d-flex justify-content-around my-3">
                {["تم الطلب", "جاري التنفيذ", "جاري التوصيل", "تم التوصيل"].map(
                  (label, index) => (
                    <div
                      key={index}
                      className={`step ${orderStatusSteps[order.status] >= index + 1 ? "active" : ""
                        } ${order.status === "Cancelled" ? "canceled" : ""}`}
                    >
                      <div className="step-icon">
                        {[<FaBox />, <FaSpinner />, <FaTruck />, <FaCheck />][index]}
                      </div>
                      <div className="step-label">{label}</div>
                    </div>
                  )
                )}
              </div>

              {/* Order Items */}
              <h4 className="mb-3">تفاصيل الطلب</h4>
              {order.orderDetails.map((item) => (
                <div key={item.id} className="d-flex justify-content-between p-3 border-bottom">
                  <div>
                    <h5 className="mb-1">{item.product.name}</h5>
                    <small className="text-muted">
                      البراند: {item.product.brand?.name} | اللون: {item.product.color?.name}
                    </small>
                  </div>
                  <div className="text-end">
                    <div>الكمية: {item.quantity}</div>
                    <div className="fw-bold">{item.product.price} ج.م</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-muted py-5">لا توجد طلبات حالياً، يمكنك البدء في التسوق الآن!</p>
      )}
    </Container>
  );
};

export default MyOrders;
