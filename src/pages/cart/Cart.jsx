import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner, Modal, Form } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading, clearCart } = useCart();

  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState("");
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const handleShowModal = () => setShowOrderModal(true);
  const handleCloseModal = () => setShowOrderModal(false);

  // Calculate order totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = item.productInfo.discount
      ? item.productInfo.price - (item.productInfo.price * item.productInfo.discount) / 100
      : item.productInfo.price;
    return sum + item.quantity * price;
  }, 0);
  const totalPrice = subtotal;

  // Handle updating quantity
  const handleUpdateQuantity = async (item, action) => {
    setUpdatingItem(item.id);
    const newQuantity = action === "plus" ? item.quantity + 1 : item.quantity - 1;
    await updateQuantity(item.id, newQuantity);
    setUpdatingItem(null);
  };

  // Handle removing item
  const handleRemoveItem = async (cartId) => {
    setRemovingItem(cartId);
    await removeFromCart(cartId);
    setRemovingItem(null);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      await axios.post("/orders/me", { shippingAddress: address });
      await clearCart()
      toast.success("✅ تم تقديم طلبك بنجاح!");
      handleCloseModal();
    } catch (error) {
      toast.error("حدث خطأ أثناء تقديم الطلب، حاول مرة أخرى.");
    } finally {
      setOrderLoading(false);
    }
  };


  if (loading) {
    return <p className="text-center">جاري تحميل السلة...</p>;
  }

  if (!cart.length) {
    return (
      <div className="text-center py-5">
        <h3>السلة فارغة</h3>
        <p className="text-muted">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
        <Button variant="primary" href="/products">
          تسوق الآن
        </Button>
      </div>
    );
  }

  return (
    <Container dir="rtl" className="my-5 pt-5">
      <h2 className="text-center mb-4 fw-bold">سلة المشتريات</h2>

      <Row>
        <Col lg={8}>
          <div className="cart-items">
            {cart.map((item) => {
              const originalPrice = item.productInfo.price;
              const discount = item.productInfo.discount || 0;
              const discountedPrice = originalPrice - (originalPrice * discount) / 100;

              return (
                <div key={item.id} className="cart-item bg-white p-3 rounded-3 mb-3 shadow-sm">
                  <Row className="align-items-center">
                    <Col sm={3}>
                      <img
                        src={item.productInfo.cover}
                        alt={item.productInfo.name}
                        className="img-fluid rounded-3"
                        style={{ height: "120px", objectFit: "cover" }}
                      />
                    </Col>

                    <Col sm={6}>
                      <h5 className="mb-2">{item.productInfo.name}</h5>
                      <div className="product-details text-muted small">
                        <p className="mb-1">البراند: {item.productInfo.brand?.name}</p>
                        <p className="mb-1">اللون: {item.productInfo.color?.name}</p>
                      </div>
                      <div className="quantity-controls mt-2 d-flex align-items-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item, "minus")}
                          disabled={item.quantity <= 1 || updatingItem === item.id}
                        >
                          {updatingItem === item.id ? <Spinner size="sm" /> : <FaMinus />}
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item, "plus")}
                          disabled={updatingItem === item.id}
                        >
                          {updatingItem === item.id ? <Spinner size="sm" /> : <FaPlus />}
                        </Button>
                      </div>
                    </Col>

                    <Col sm={3} className="text-end">
                      {discount > 0 ? (
                        <>
                          <h6 className="text-muted mb-1">
                            <del>{originalPrice} ر.س</del>
                          </h6>
                          <h5 className="text-danger">{discountedPrice.toFixed(2)} ر.س</h5>
                        </>
                      ) : (
                        <h5 className="text-primary">{originalPrice} ر.س</h5>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItem === item.id}
                      >
                        {removingItem === item.id ? <Spinner size="sm" /> : <FaTrash />}
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Col>

        <Col lg={4}>
          <div className="order-summary bg-white p-4 rounded-3 shadow-sm">
            <h4 className="mb-4">ملخص الطلب</h4>

            <div className="d-flex justify-content-between mb-3">
              <span>عدد المنتجات</span>
              <span>{totalItems}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>المجموع الفرعي</span>
              <span>{subtotal.toFixed(2)} ر.س</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <strong>الإجمالي</strong>
              <strong className="text-primary">{totalPrice.toFixed(2)} ر.س</strong>
            </div>

            <Button variant="primary" className="w-100 py-2" onClick={handleShowModal}>
              إتمام الطلب
            </Button>
          </div>
        </Col>
      </Row>

      <Modal show={showOrderModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>إتمام الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitOrder}>
            <Form.Group className="mb-3">
              <Form.Label>العنوان بالتفصيل</Form.Label>
              <Form.Control as="textarea" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={orderLoading}>
              {orderLoading ? <Spinner size="sm" /> : "تأكيد الطلب"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Cart;
