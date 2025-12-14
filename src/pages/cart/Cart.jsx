import React, { useState, useEffect } from "react";
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
  const { cart, removeFromCart, updateQuantity, loading, clearCart, fetchCart, updateCartFromResponse } = useCart();
  const [userData, isAdmin, user] = UserType();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [pricing, setPricing] = useState(null); // Store pricing from API

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
  
  const handleCloseModal = () => {
    setShowOrderModal(false);
    // Reset form when closing
    setAddress("");
    setPhoneNumber("");
    setPaymentMethod("cash_on_delivery");
  };

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

  // Fetch cart data with pricing and coupon when component mounts
  useEffect(() => {
    const loadCartData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !userData) {
        setPricing(null);
        setAppliedCoupon(null);
        return;
      }

      try {
        const { data } = await baseUrl.get("api/carts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Update pricing and coupon from API response
        // Response format: { items: [...], pricing: {...}, coupon: {...} }
        if (data) {
          if (data.pricing) {
            setPricing(data.pricing);
          }
          if (data.coupon !== undefined) {
            setAppliedCoupon(data.coupon);
          }
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
        // Don't show error toast here as fetchCart might handle it
      }
    };

    // Only load on mount, not when cart changes (to avoid conflicts with coupon updates)
    loadCartData();
  }, [userData]); // Removed cart from dependencies

  // Calculate totals - use API pricing if available, otherwise calculate locally
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = pricing?.subtotal ?? cart.reduce((sum, item) => {
    const price = item.productInfo?.discount
      ? item.productInfo.price - (item.productInfo.price * item.productInfo.discount) / 100
      : item.productInfo?.price || 0;
    return sum + item.quantity * price;
  }, 0);

  const discountAmount = pricing?.discountAmount ?? (appliedCoupon
    ? Math.min((subtotal * appliedCoupon.discountPercentage) / 100, appliedCoupon.maxDiscountAmount || Infinity)
    : 0);

  const totalPrice = pricing?.total ?? (subtotal - discountAmount);

  const handleUpdateQuantity = async (item, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يرجى تسجيل الدخول");
      return;
    }

    setUpdatingItem(item.id);
    const newQuantity = action === "plus" ? item.quantity + 1 : item.quantity - 1;
    
    try {
      await updateQuantity(item.id, newQuantity);
      
      // Re-apply coupon to get updated pricing when quantity changes
      if (appliedCoupon) {
        try {
          const { data } = await baseUrl.post(
            "api/coupons/apply",
            { code: appliedCoupon.code },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          // Response format: { success: true, coupon: {...}, cart: { items: [...] }, pricing: {...} }
          if (data.success && data.cart) {
            updateCartFromResponse(data.cart);
          }
          setPricing(data.pricing);
          setAppliedCoupon(data.coupon);
        } catch (err) {
          // If coupon is no longer valid, remove it
          setAppliedCoupon(null);
          setPricing(null);
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("حدث خطأ أثناء تحديث الكمية");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يرجى تسجيل الدخول");
      return;
    }

    setRemovingItem(cartId);
    
    try {
      await removeFromCart(cartId);
      
      // Reset pricing when item is removed (coupon might need recalculation)
      if (appliedCoupon) {
        try {
          const { data } = await baseUrl.post(
            "api/coupons/apply",
            { code: appliedCoupon.code },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          // Response format: { success: true, coupon: {...}, cart: { items: [...] }, pricing: {...} }
          if (data.success && data.cart) {
            updateCartFromResponse(data.cart);
          }
          setPricing(data.pricing);
          setAppliedCoupon(data.coupon);
        } catch (err) {
          // If coupon is no longer valid or cart is empty, remove it
          setAppliedCoupon(null);
          setPricing(null);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("حدث خطأ أثناء إزالة المنتج");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("يرجى إدخال كود الخصم");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await baseUrl.post(
        "api/coupons/apply",
        { code: couponCode.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Response format: { success: true, coupon: {...}, cart: { items: [...] }, pricing: {...} }
      if (data.success) {
        // Update cart items from response if cart data is available
        if (data.cart && data.cart.items && Array.isArray(data.cart.items)) {
          updateCartFromResponse(data.cart);
        }
        
        // Update pricing and coupon from API response
        if (data.pricing) {
          setPricing(data.pricing);
        }
        if (data.coupon !== undefined) {
          setAppliedCoupon(data.coupon);
        }
        setCouponCode(""); // Clear input after successful application
        
        if (data.coupon) {
          toast.success(`✅ تم تطبيق الكوبون "${data.coupon.code}" بنجاح!`);
        } else {
          toast.success("✅ تم تحديث السلة بنجاح!");
        }
      } else {
        // Fallback: just update pricing and coupon
        if (data.pricing) {
          setPricing(data.pricing);
        }
        if (data.coupon !== undefined) {
          setAppliedCoupon(data.coupon);
        }
        setCouponCode("");
        if (data.coupon) {
          toast.success(`✅ تم تطبيق الكوبون "${data.coupon.code}" بنجاح!`);
        }
      }
    } catch (err) {
      console.error("Error applying coupon:", err);
      setAppliedCoupon(null);
      setPricing(null);
      
      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 400) {
          if (message?.includes("فارغة") || message?.includes("empty")) {
            setCouponError("❌ السلة فارغة. أضف منتجات أولاً.");
          } else if (message?.includes("منتهي") || message?.includes("expired")) {
            setCouponError("❌ كود الخصم منتهي الصلاحية.");
          } else {
            setCouponError("❌ " + (message || "الكوبون غير صالح."));
          }
        } else if (status === 404) {
          setCouponError("❌ كود الخصم غير موجود.");
        } else {
          setCouponError("❌ " + (message || "حدث خطأ أثناء تطبيق الكوبون."));
        }
      } else {
        setCouponError("❌ حدث خطأ أثناء تطبيق الكوبون. حاول مرة أخرى.");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await baseUrl.post(
        "api/carts/remove-coupon",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Update pricing and coupon from API response
      // Response format: { items: [...], pricing: {...}, coupon: null }
      if (data.pricing) {
        setPricing(data.pricing);
      } else {
        setPricing(null);
      }
      
      setAppliedCoupon(data.coupon || null);
      setCouponCode("");
      setCouponError(null);
      
      // Refresh cart to get updated data
      await fetchCart();
      
      toast.success("تم إزالة الكوبون بنجاح");
    } catch (err) {
      console.error("Error removing coupon:", err);
      toast.error("حدث خطأ أثناء إزالة الكوبون");
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error("يرجى إدخال عنوان الشحن");
      return;
    }

    // التحقق من رقم الهاتف للدفع بالفيزا
    if (paymentMethod === 'paymob') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const finalPhone = phoneNumber.trim() || user.phoneNumber || user.phone || '';
      
      if (!finalPhone || finalPhone.length < 10) {
        toast.error("يرجى إدخال رقم هاتف صحيح للدفع بالفيزا (10 أرقام على الأقل)");
        return;
      }
    }

    setOrderLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // 1. إنشاء الطلب
      const orderData = {
        shippingAddress: address.trim(),
        paymentMethod: paymentMethod // cash_on_delivery أو paymob
      };

      const orderResponse = await baseUrl.post("/api/orders/me", orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const order = orderResponse.data;
      console.log('Order created:', order);

      // 2. معالجة الدفع حسب الطريقة المختارة
      if (paymentMethod === 'cash_on_delivery') {
        // الدفع عند الاستلام - تم بنجاح
        await clearCart();
        toast.success("✅ تم إنشاء الطلب بنجاح! سيتم الدفع عند الاستلام.");
        handleCloseModal();
        // يمكن إعادة التوجيه إلى صفحة الطلبات
        setTimeout(() => {
          window.location.href = '/orders';
        }, 2000);
      } else if (paymentMethod === 'paymob') {
        // الدفع بالفيزا - إنشاء Payment Intention
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // استخدام رقم الهاتف من الحقل أو من بيانات المستخدم
        const finalPhone = phoneNumber.trim() || user.phoneNumber || user.phone || '';
        
        if (!finalPhone || finalPhone.length < 10) {
          toast.error("يرجى إدخال رقم هاتف صحيح");
          setOrderLoading(false);
          return;
        }
        
        const paymentData = {
          orderId: order.id,
          amount: parseFloat(order.totalAmount), // Ensure it's a number
          currency: 'SAR',
          customerName: user.fullName || user.name || 'عميل',
          customerEmail: user.email || '',
          customerPhone: finalPhone
        };

        console.log('Sending payment data:', paymentData);

        toast.info("جاري التوجيه إلى صفحة الدفع...");

        const paymentResponse = await baseUrl.post("api/paymob/create-intention", paymentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const responseData = paymentResponse.data;
        console.log('Payment intention response:', responseData);

        // checkoutUrl موجود مباشرة في response.data
        if (responseData.checkoutUrl) {
          // توجيه المستخدم إلى صفحة الدفع
          window.location.href = responseData.checkoutUrl;
        } else {
          console.error('No checkoutUrl in response:', responseData);
          throw new Error('لم يتم إنشاء رابط الدفع');
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء تقديم الطلب، حاول مرة أخرى.";
      toast.error(errorMessage);
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
                {!appliedCoupon ? (
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="أدخل الكوبون"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      disabled={couponLoading}
                      className="coupon-input"
                    />
                    <Button
                      variant="success"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="ms-2 apply-coupon-btn"
                    >
                      {couponLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          جاري التطبيق...
                        </>
                      ) : (
                        "تطبيق"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="applied-coupon-info">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded-3 border border-success">
                      <div>
                        <div className="text-success fw-bold mb-1">
                          ✅ كوبون {appliedCoupon.code} مطبق
                        </div>
                        <div className="text-muted small">
                          خصم {appliedCoupon.discountPercentage}%
                          {appliedCoupon.maxDiscountAmount && (
                            <span> (حد أقصى {appliedCoupon.maxDiscountAmount.toFixed(2)} ر.س)</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="remove-coupon-btn"
                      >
                        إزالة
                      </Button>
                    </div>
                  </div>
                )}
                {couponError && (
                  <div className="text-danger mt-2 small">
                    {couponError}
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

            {appliedCoupon && discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2" style={{ fontFamily: 'var(--font-primary)' }}>
                <span className="fw-medium text-success">
                  خصم ({appliedCoupon.code})
                </span>
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
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold mb-2">عنوان الشحن *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="أدخل عنوان الشحن الكامل (المدينة، الحي، الشارع، رقم المبنى)"
                required
                style={{ minHeight: "100px" }}
              />
              <Form.Text className="text-muted">
                يرجى إدخال عنوان الشحن الكامل لضمان وصول الطلب بشكل صحيح
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold mb-3">طريقة الدفع *</Form.Label>
              <div className="payment-methods">
                <Form.Check
                  type="radio"
                  id="cash_on_delivery"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label={
                    <div className="payment-option">
                      <div className="d-flex align-items-center">
                        <span className="payment-icon me-2">💵</span>
                        <div>
                          <strong>الدفع عند الاستلام</strong>
                          <small className="d-block text-muted">ادفع نقداً عند استلام الطلب</small>
                        </div>
                      </div>
                    </div>
                  }
                  className="payment-radio mb-3 p-3 border rounded"
                />
                <Form.Check
                  type="radio"
                  id="paymob"
                  name="paymentMethod"
                  value="paymob"
                  checked={paymentMethod === "paymob"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label={
                    <div className="payment-option">
                      <div className="d-flex align-items-center">
                        <span className="payment-icon me-2">💳</span>
                        <div>
                          <strong>الدفع بالفيزا / بطاقة ائتمان</strong>
                          <small className="d-block text-muted">دفع آمن عبر Paymob</small>
                        </div>
                      </div>
                    </div>
                  }
                  className="payment-radio mb-3 p-3 border rounded"
                />
              </div>
            </Form.Group>

            {paymentMethod === 'paymob' && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-2">رقم الهاتف *</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="05xxxxxxxx"
                  required={paymentMethod === 'paymob'}
                  pattern="[0-9]{10,15}"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
                <Form.Text className="text-muted">
                  رقم الهاتف مطلوب للدفع بالفيزا (10 أرقام على الأقل)
                </Form.Text>
              </Form.Group>
            )}

            <div className="order-summary-modal mb-3 p-3 bg-light rounded">
              <div className="d-flex justify-content-between mb-2">
                <span>المجموع الفرعي:</span>
                <strong>{subtotal.toFixed(2)} ر.س</strong>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>الخصم ({appliedCoupon.code}):</span>
                  <strong>-{discountAmount.toFixed(2)} ر.س</strong>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>الإجمالي:</strong>
                <strong className="text-primary fs-5">{totalPrice.toFixed(2)} ر.س</strong>
              </div>
            </div>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-3 fw-bold" 
              disabled={orderLoading || !address.trim() || (paymentMethod === 'paymob' && (!phoneNumber.trim() || phoneNumber.trim().length < 10))}
              style={{
                background: "linear-gradient(45deg, #0078FF, #0056CC)",
                border: "none",
                fontSize: "1.1rem",
                borderRadius: "12px"
              }}
            >
              {orderLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {paymentMethod === 'paymob' ? 'جاري التوجيه إلى صفحة الدفع...' : 'جاري إنشاء الطلب...'}
                </>
              ) : (
                paymentMethod === 'paymob' ? 'إتمام الطلب والانتقال للدفع' : 'تأكيد الطلب'
              )}
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
      
      <style jsx>{`
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .payment-radio {
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--card-bg);
          border: 2px solid var(--border-color) !important;
        }

        .payment-radio:hover {
          background: var(--bg-secondary);
          border-color: #0078FF !important;
          transform: translateX(-4px);
        }

        .payment-radio input[type="radio"]:checked ~ * {
          color: #0078FF;
        }

        .payment-radio:has(input:checked) {
          background: rgba(0, 120, 255, 0.1);
          border-color: #0078FF !important;
        }

        .payment-option {
          width: 100%;
        }

        .payment-icon {
          font-size: 1.5rem;
        }

        .order-summary-modal {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border-color);
        }

        [data-theme="dark"] .order-summary-modal {
          background: var(--bg-tertiary) !important;
        }
      `}</style>
    </Container>
  );
};

export default Cart;
