import { useState, useEffect, useRef } from "react";
import { Button, Dropdown, Form, Offcanvas, Spinner } from "react-bootstrap";
import { FaBell, FaCartPlus, FaSearch } from "react-icons/fa6";
import { FaUserCircle, FaSignOutAlt, FaShoppingBag, FaUserEdit, FaTools, FaFileInvoiceDollar, FaCog, FaHeart, FaHistory, FaSun, FaMoon, FaSearchLocation } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/Notifications";
import { useTheme } from "../../contexts/ThemeContext";
import { IoIosNotifications } from "react-icons/io";
import UserType from "../../Hook/userType/UserType";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import logo from "../../images/logo-removebg-preview.png"
const Navsearch = () => {
  const [show, setShow] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [userData, isAdmin, user] = UserType();
  const navigate = useNavigate();

  const { cart } = useCart();
  const { unreadCount } = useNotifications();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function - immediate search on typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 1) {
      // Search immediately with minimal debounce (100ms) to avoid too many requests
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 100); // Reduced to 100ms for faster response
    } else {
      setSearchResults([]);
      setSearchCount(0);
      setShowSearchMenu(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 1) {
      setSearchResults([]);
      setSearchCount(0);
      setShowSearchMenu(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await baseUrl.get('/api/products/search', {
        params: {
          q: searchQuery.trim(),
          limit: 10,
          skip: 0
        }
      });

      const data = response.data;
      
      // Handle the new API response structure
      if (data && data.results) {
        setSearchResults(Array.isArray(data.results) ? data.results : []);
        setSearchCount(data.count || data.pagination?.total || 0);
        setShowSearchMenu(true);
      } else {
        // Fallback for old API structure
        setSearchResults(Array.isArray(data) ? data : []);
        setSearchCount(data.length || 0);
        setShowSearchMenu(true);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
      setSearchCount(0);
      // Don't show error to user, just clear results
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    setShowSearchMenu(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const handleClose = () => setShow(false);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // وظيفة تسجيل الخروج
  const handleLogout = () => {
    try {
      // حذف البيانات من localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // استدعاء logout من AuthContext
      logout();
      
      // إظهار رسالة نجاح
      toast.success("تم تسجيل الخروج بنجاح");
      
      // إعادة توجيه للصفحة الرئيسية
      navigate("/");
      
      // إعادة تحميل الصفحة للتأكد من تحديث الحالة
      window.location.reload();
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
      toast.error("حدث خطأ في تسجيل الخروج");
    }
  };

  return (
    <div dir="ltr" className="navsearch navsearch-bar" style={{ zIndex: "1000", backgroundColor: "#012148" }}>
      <div className="navsearch-inner">
        <Link to="/" className="navsearch-logo">
          <img src={logo} alt="جوفون" className="navsearch-logo-img" />
        </Link>

        {/* Search Bar */}
        <div className="navsearch-search-wrap" ref={searchRef}>
          <Form className="navsearch-form">
            <div className="navsearch-input-group">
              <Form.Control
                dir="rtl"
                type="search"
                placeholder="ابحث عن منتجك المفضل..."
                className="navsearch-input"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  if (value.trim().length >= 1) {
                    setShowSearchMenu(true);
                  } else {
                    setShowSearchMenu(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 1 && searchResults.length > 0) {
                    setShowSearchMenu(true);
                  }
                }}
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {searchLoading && (
                <div className="navsearch-spinner">
                  <Spinner size="sm" animation="border" />
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchMenu && searchQuery.trim().length >= 1 && (
              <div className="search-results-dropdown">
                {searchLoading ? (
                  <div className="search-loading-state">
                    <Spinner size="sm" className="me-2" />
                    <span>جاري البحث...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="search-results-header">
                      <span>نتائج البحث ({searchCount})</span>
                      {searchCount > 10 && (
                        <Link 
                          to={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                          className="view-all-link"
                          onClick={() => {
                            setShowSearchMenu(false);
                            setSearchQuery("");
                          }}
                        >
                          عرض الكل
                        </Link>
                      )}
                    </div>
                    <div className="search-results-list">
                      {searchResults.map((product) => {
                        // Get product image
                        const productImage = product.cover || 
                          (product.ProductImages && product.ProductImages.length > 0 
                            ? product.ProductImages[0].url 
                            : null) ||
                          'https://via.placeholder.com/80x80?text=No+Image';
                        
                        // Calculate discounted price
                        const discountedPrice = product.discount && product.discount > 0
                          ? (product.price * (1 - product.discount / 100)).toFixed(2)
                          : null;

                        return (
                          <div
                            key={product.id}
                            className="search-result-item"
                            onClick={() => handleProductClick(product.id)}
                          >
                            <div className="result-image">
                              <img
                                src={productImage}
                                alt={product.name || 'منتج'}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                              />
                              {product.discount && product.discount > 0 && (
                                <div className="discount-badge-small">
                                  -{product.discount}%
                                </div>
                              )}
                            </div>
                            <div className="result-info">
                              <div className="result-name">{product.name || 'منتج بدون اسم'}</div>
                              {product.brand && product.brand.name && (
                                <div className="result-brand">{product.brand.name}</div>
                              )}
                              {product.category && product.category.name && (
                                <div className="result-category">{product.category.name}</div>
                              )}
                              <div className="result-price">
                                {discountedPrice ? (
                                  <>
                                    <span className="discounted-price">
                                      {discountedPrice} ر.س
                                    </span>
                                    <span className="original-price">
                                      {product.price.toFixed(2)} ر.س
                                    </span>
                                  </>
                                ) : (
                                  <span className="current-price">
                                    {product.price ? product.price.toFixed(2) : '0.00'} ر.س
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="search-no-results">
                    <FaSearchLocation className="mb-2" />
                    <span>لا توجد نتائج للبحث "{searchQuery}"</span>
                  </div>
                )}
              </div>
            )}
          </Form>
        </div>

        <div className="navsearch-actions">
          <Button
            variant="link"
            onClick={toggleTheme}
            className="navsearch-icon-btn"
            title={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
          >
            {theme === 'light' ? (
              <FaMoon className="navsearch-icon" />
            ) : (
              <FaSun className="navsearch-icon" />
            )}
          </Button>

          {!isAdmin && (
            <Link to="/cart" className="navsearch-cart-link">
              <FaCartPlus className="navsearch-icon navsearch-cart-icon" />
              {totalCartItems > 0 && (
                <span className="navsearch-cart-badge">{totalCartItems}</span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link to='/admin/notifications' title="الإشعارات" className="navsearch-cart-link">
              <IoIosNotifications className="navsearch-icon" style={{ fontSize: '1.5rem' }} />
              {!!unreadCount && <span className="navsearch-cart-badge navsearch-badge-danger">{unreadCount}</span>}
            </Link>
          )}

          <Dropdown>
            <Dropdown.Toggle 
              variant="none" 
              id="dropdown-user" 
              className="navsearch-user-toggle"
            >
              <div className="position-relative">
                <FaUserCircle className="navsearch-icon navsearch-user-icon" />
                {userData && (
                  <div className="position-absolute top-0 start-100 translate-middle">
                    <span className="badge bg-success rounded-pill" style={{ fontSize: "0.6rem" }}>
                      ●
                    </span>
                  </div>
                )}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu 
              align="end" 
              dir="rtl" 
              className="shadow-lg border-0 rounded-3 p-3"
              style={{
                minWidth: "250px",
                backgroundColor: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
              }}
            >
              {userData ? (
                <>
                  {/* User Info Header */}
                 

                  {/* Admin Section */}
                  {isAdmin && (
                    <>
                      <Dropdown.Item 
                        as={Link} 
                        to="/admin"
                        className="d-flex align-items-center py-2 px-3 rounded-2 mb-1 hover-item"
                        style={{ transition: "all 0.2s ease" }}
                      >
                        <FaTools className="text-primary me-3" size={16} />
                        <span className="fw-medium">لوحة الإدارة</span>
                      </Dropdown.Item>
                      <Dropdown.Divider className="my-2" />
                    </>
                  )}

                  {/* User Menu Items */}
                  <Dropdown.Item 
                    as={Link} 
                    to="/orders"
                    className="d-flex align-items-center py-2 px-3 rounded-2 mb-1 hover-item"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <FaShoppingBag className="text-success me-3" size={16} />
                    <span className="fw-medium">طلباتي</span>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    as={Link} 
                    to="/profile"
                    className="d-flex align-items-center py-2 px-3 rounded-2 mb-1 hover-item"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <FaUserEdit className="text-info me-3" size={16} />
                    <span className="fw-medium">الملف الشخصي</span>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    as={Link} 
                    to="/chat"
                    className="d-flex align-items-center py-2 px-3 rounded-2 mb-1 hover-item"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <FaHeart className="text-warning me-3" size={16} />
                    <span className="fw-medium">الدردشة</span>
                  </Dropdown.Item>

                  <Dropdown.Divider className="my-3" />

                  {/* Logout */}
                  <Dropdown.Item 
                    onClick={handleLogout}
                    className="d-flex align-items-center py-2 px-3 rounded-2 hover-item text-danger"
                    style={{ 
                      transition: "all 0.2s ease",
                      backgroundColor: "rgba(220, 53, 69, 0.05)"
                    }}
                  >
                    <FaSignOutAlt className="me-3" size={16} />
                    <span className="fw-medium">تسجيل الخروج</span>
                  </Dropdown.Item>
                </>
              ) : (
                <div className="p-2">
                  <div className="text-center mb-3">
                    <h6 className="text-muted mb-0">مرحباً بك</h6>
                    <small className="text-muted">سجل دخولك للاستمتاع بتجربة أفضل</small>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className="rounded-pill py-2 fw-medium navsearch-login-btn"
                      onClick={() => setShowLoginModal(true)}
                      style={{
                        backgroundColor: "#012148",
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      className="rounded-pill py-2 fw-medium"
                      onClick={() => setShowSignupModal(true)}
                      style={{
                        transition: "all 0.3s ease"
                      }}
                    >
                      إنشاء حساب جديد
                    </Button>
                  </div>
                </div>
              )}
            </Dropdown.Menu>
          </Dropdown>


        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>سلة التسوق</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>

      {/* Modals */}
      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
      <SignupModal show={showSignupModal} handleClose={() => setShowSignupModal(false)} />

      {/* Custom Styles */}
      <style>{`
        .navsearch-bar {
          min-height: 70px;
          display: flex;
          align-items: center;
          width: 100%;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }
        .navsearch-inner {
          width: 92%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .navsearch-logo {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .navsearch-logo-img {
          height: 48px;
          width: auto;
          max-width: 180px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }
        .navsearch-logo:hover .navsearch-logo-img {
          transform: scale(1.03);
        }
        .navsearch-search-wrap {
          flex: 1;
          max-width: 520px;
          position: relative;
        }
        .navsearch-form {
          width: 100%;
          position: relative;
        }
        .navsearch-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .navsearch-input {
          width: 100%;
          height: 44px;
          padding: 0 1rem 0 2.5rem;
          border: none;
          border-radius: 22px;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.95);
          transition: box-shadow 0.2s ease, background 0.2s ease;
        }
        .navsearch-input::placeholder {
          color: #6b7280;
        }
        .navsearch-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
          background: #fff;
        }
        .navsearch-spinner {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #012148;
        }
        .navsearch-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .navsearch-icon-btn,
        .navsearch-cart-link,
        .navsearch-user-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          color: #fff;
          transition: background 0.2s ease, transform 0.2s ease;
          border: none;
          padding: 0;
          text-decoration: none;
        }
        .navsearch-icon-btn:hover,
        .navsearch-cart-link:hover,
        .navsearch-user-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: scale(1.05);
        }
        .navsearch-icon {
          font-size: 1.35rem;
          color: #fff;
        }
        .navsearch-cart-icon {
          font-size: 1.5rem;
        }
        .navsearch-user-icon {
          font-size: 1.6rem;
        }
        .navsearch-cart-badge {
          position: absolute;
          top: -2px;
          left: -2px;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          background: #fff;
          color: #012148;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navsearch-badge-danger {
          background: #dc3545;
          color: #fff;
        }
        .navsearch-cart-link,
        .navsearch-user-toggle {
          position: relative;
        }
        .navsearch-user-toggle::after {
          display: none;
        }
        .navsearch-login-btn:hover {
          background-color: #013060 !important;
          color: #fff;
        }

        /* Search results dropdown */
        .search-results-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          max-height: 380px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 1100;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .search-results-header {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: #012148;
        }
        .view-all-link {
          color: #012148;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
        }
        .view-all-link:hover {
          text-decoration: underline;
          color: #013060;
        }
        .search-results-list {
          overflow-y: auto;
          max-height: 320px;
        }
        .search-result-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.15s ease;
          border-bottom: 1px solid #f5f5f5;
        }
        .search-result-item:hover {
          background: #f8f9fa;
        }
        .search-result-item .result-image {
          position: relative;
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f0f0;
        }
        .search-result-item .result-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .search-result-item .result-info {
          flex: 1;
          min-width: 0;
        }
        .search-result-item .result-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-result-item .result-brand,
        .search-result-item .result-category {
          font-size: 0.8rem;
          color: #6b7280;
        }
        .search-result-item .result-price {
          font-size: 0.9rem;
          font-weight: 700;
          color: #012148;
          margin-top: 4px;
        }
        .search-result-item .original-price {
          text-decoration: line-through;
          color: #9ca3af;
          margin-right: 6px;
        }
        .search-loading-state {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
        }
        .search-no-results {
          padding: 32px 24px;
          text-align: center;
          color: #6b7280;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .discount-badge-small {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #dc3545;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .hover-item:hover {
          background-color: #f0f4f8 !important;
          transform: translateX(-2px);
        }
        .hover-item.text-danger:hover {
          background-color: rgba(220, 53, 69, 0.1) !important;
          color: #dc3545 !important;
        }
        .dropdown-menu {
          animation: slideDown 0.25s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item { border-radius: 8px !important; margin-bottom: 2px; }
        .dropdown-item:focus {
          background-color: #e8eef4 !important;
          color: #012148 !important;
        }
        .badge { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .navsearch-inner { width: 95%; gap: 0.75rem; }
          .navsearch-logo-img { height: 40px; max-width: 140px; }
          .navsearch-search-wrap { max-width: none; }
          .navsearch-input { height: 40px; font-size: 0.9rem; }
          .navsearch-icon-btn,
          .navsearch-cart-link,
          .navsearch-user-toggle { width: 38px; height: 38px; }
          .navsearch-icon { font-size: 1.2rem; }
          .search-results-dropdown { max-height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default Navsearch;
