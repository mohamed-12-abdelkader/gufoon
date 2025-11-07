import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner, Modal, Form } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import UserType from "../../Hook/userType/UserType";
import AuthRequiredModal from "../../components/modal/AuthRequiredModal";
import LoginModal from "../../components/modal/LoginModal";
import SignupModal from "../../components/modal/SignupModal";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading, clearCart } = useCart();
  const [userData, isAdmin, user] = UserType();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Auth modals states
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleShowModal = () => {
    // Check if user is logged in
    if (!userData) {
      setShowAuthRequiredModal(true);
      return;
    }
    setShowOrderModal(true);
  };
  
  const handleCloseModal = () => setShowOrderModal(false);

  // Auth modal handlers
  const handleShowLoginModal = () => {
    setShowAuthRequiredModal(false);
    setShowLoginModal(true);
  };

  const handleShowSignupModal = () => {
    setShowAuthRequiredModal(false);
    setShowSignupModal(true);
  };

  const handleCloseAuthRequiredModal = () => setShowAuthRequiredModal(false);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleCloseSignupModal = () => setShowSignupModal(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = item.productInfo.discount
      ? item.productInfo.price - (item.productInfo.price * item.productInfo.discount) / 100
      : item.productInfo.price;
    return sum + item.quantity * price;
  }, 0);

  const discountAmount = appliedCoupon
    ? Math.min((subtotal * appliedCoupon.discountPercentage) / 100, appliedCoupon.maxDiscountAmount || Infinity)
    : 0;

  const totalPrice = subtotal - discountAmount;

  const handleUpdateQuantity = async (item, action) => {
    setUpdatingItem(item.id);
    const newQuantity = action === "plus" ? item.quantity + 1 : item.quantity - 1;
    await updateQuantity(item.id, newQuantity);
    setUpdatingItem(null);
  };

  const handleRemoveItem = async (cartId) => {
    setRemovingItem(cartId);
    await removeFromCart(cartId);
    setRemovingItem(null);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await baseUrl.post("api/coupons/validate", { code: couponCode }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppliedCoupon(data.coupon);
      toast.success("✅ تم تطبيق الكوبون بنجاح!");
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError("❌ الكوبون غير صالح أو منتهي.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      const token = localStorage.getItem('token');
      const cartItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const orderData = {
        shippingAddress: address,
        cartItems: cartItems
      };

      // Add coupon code if applied
      if (appliedCoupon?.code) {
        orderData.couponCode = appliedCoupon.code;
      }

      console.log('Order Data to be sent:', orderData);

      await baseUrl.post("/api/orders/me", orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      await clearCart();
      toast.success("✅ تم تقديم طلبك بنجاح!");
      handleCloseModal();
    } catch (error) {
      console.log("err", error)
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
      <Container dir="rtl" className="my-5 pt-5">
        <div className="text-center py-5">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#f8f9fa",
              color: "#6c757d"
            }}
          >
            <i className="fas fa-shopping-cart" style={{ fontSize: "3rem" }}></i>
          </div>
          <h3 className="mb-3">السلة فارغة</h3>
          <p className="text-muted mb-4 fs-5">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <Button 
            variant="primary" 
            href="/products"
            size="lg"
            className="px-5 py-3 fw-bold"
            style={{
              background: "linear-gradient(45deg, #0078FF, #0056CC)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 120, 255, 0.3)"
            }}
          >
            تسوق الآن
          </Button>
        </div>
      </Container>
    );
  }
console.log(cart)
  return (
    <Container dir="rtl" className="my-5 pt-5">
      <h2 className="text-center mb-4 fw-bold text-shadow" style={{ 
        fontFamily: 'var(--font-primary)', 
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#2c3e50'
      }}>
        سلة المشتريات
      </h2>

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
                      <h5 className="mb-2 fw-semibold" style={{ 
                        fontFamily: 'var(--font-primary)', 
                        fontSize: '1.25rem',
                        color: '#2c3e50'
                      }}>
                        {item.productInfo.name}
                      </h5>
                      <div className="product-details text-muted small" style={{ 
                        fontFamily: 'var(--font-primary)',
                        fontSize: '0.9rem'
                      }}>
                        <p className="mb-1 fw-medium">البراند: {item.productInfo.brand?.name}</p>
                        <p className="mb-1 fw-medium">اللون: {item.productInfo.color?.name}</p>
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
            <h4 className="mb-4 fw-bold" style={{ 
              fontFamily: 'var(--font-primary)', 
              fontSize: '1.5rem',
              color: '#2c3e50'
            }}>
              ملخص الطلب
            </h4>

            <Form className="mb-3">
              <Form.Group controlId="couponCode">
                <Form.Label className="fw-semibold" style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: '1rem',
                  color: '#495057'
                }}>
                  هل لديك كوبون؟
                </Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="أدخل الكوبون"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedCoupon}
                  />
                  <Button
                    variant="success"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || appliedCoupon}
                    className="ms-2"
                  >
                    {couponLoading ? <Spinner size="sm" /> : "تطبيق"}
                  </Button>
                </div>
                {couponError && <div className="text-danger mt-2">{couponError}</div>}
                {appliedCoupon && (
                  <div className="text-success mt-2">
                    ✅ كوبون {appliedCoupon.code} يمنحك خصم {appliedCoupon.discountPercentage}%
                  </div>
                )}
              </Form.Group>
            </Form>

            <div className="d-flex justify-content-between mb-3" style={{ fontFamily: 'var(--font-primary)' }}>
              <span className="fw-medium">عدد المنتجات</span>
              <span className="fw-semibold">{totalItems}</span>
            </div>

            <div className="d-flex justify-content-between mb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              <span className="fw-medium">المجموع الفرعي</span>
              <span className="fw-semibold">{subtotal.toFixed(2)} ر.س</span>
            </div>

            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2" style={{ fontFamily: 'var(--font-primary)' }}>
                <span className="fw-medium">الخصم</span>
                <span className="text-success fw-semibold">-{discountAmount.toFixed(2)} ر.س</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-4" style={{ fontFamily: 'var(--font-primary)' }}>
              <strong className="fw-bold fs-5">الإجمالي</strong>
              <strong className="text-primary fw-bold fs-5">{totalPrice.toFixed(2)} ر.س</strong>
            </div>

            <Button 
              variant="primary" 
              className="w-100 py-3 fw-bold" 
              onClick={handleShowModal}
              style={{
                background: "linear-gradient(45deg, #0078FF, #0056CC)",
                border: "none",
                fontSize: "1.1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0, 120, 255, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0, 120, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 120, 255, 0.3)";
              }}
            >
              {userData ? "إتمام الطلب" : "تسجيل الدخول لإتمام الطلب"}
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
              <Form.Control
                as="textarea"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={orderLoading}>
              {orderLoading ? <Spinner size="sm" /> : "تأكيد الطلب"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        show={showAuthRequiredModal}
        handleClose={handleCloseAuthRequiredModal}
        onLoginClick={handleShowLoginModal}
        onSignupClick={handleShowSignupModal}
      />

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        handleClose={handleCloseLoginModal}
      />

      {/* Signup Modal */}
      <SignupModal
        show={showSignupModal}
        handleClose={handleCloseSignupModal}
      />
    </Container>
  );
};

export default Cart;
