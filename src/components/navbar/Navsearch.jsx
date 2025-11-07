import { useState, useEffect, useRef } from "react";
import { Button, Dropdown, Form, Offcanvas } from "react-bootstrap";
import { FaBell, FaCartPlus } from "react-icons/fa6";
import { FaUserCircle, FaSignOutAlt, FaShoppingBag, FaUserEdit, FaTools, FaFileInvoiceDollar, FaCog, FaHeart, FaHistory } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/Notifications";
import { IoIosNotifications } from "react-icons/io";
import UserType from "../../Hook/userType/UserType";
import { toast } from "react-toastify";
import logo from "../../images/logo-removebg-preview.png"
const Navsearch = () => {
  const [show, setShow] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const searchRef = useRef(null);
  const [userData, isAdmin, user] = UserType();
  const navigate = useNavigate();

  const { cart } = useCart();
  const { unreadCount } = useNotifications();
  const { logout } = useAuth();

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
    <div dir="ltr" className="bg-[#0078FF] h-[70px] flex items-center navsearch w-[100%]" style={{ zIndex: "1000" }}>
      <div className="m-auto w-[90%] flex justify-between items-center">
        <div className="">
          <Link to="/">
          <img src={logo} className="h-[50px] w-[200px]"/>
          </Link>
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex w-[60%] relative" ref={searchRef}>
          <Form className="w-100">
            <Form.Control
              dir="rtl"
              type="search"
              placeholder="ابحث عن منتجك المفضل ؟"
              className="flex-grow me-2"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchMenu(true);
              }}
              onClick={() => setShowSearchMenu(true)}
              style={{ 
                fontFamily: 'var(--font-primary)',
                fontSize: '1rem',
                fontWeight: '400'
              }}
            />
          </Form>
        </div>

        <div className="flex items-center">
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <FaCartPlus className="text-3xl mt-2 mx-2 text-white" />
              {totalCartItems > 0 && (
                <span className="absolute bg-blue-700 text-white font-bold text-lg flex justify-center items-center w-6 h-6 rounded-full top-0 -left-4">{totalCartItems}</span>
              )}
            </Link>
          )}

          {/* Show Bill Only for Admins */}
          {isAdmin && (
            <Link to='/admin/notifications' title="Notifications">
              <div className="flex items-center">
                <IoIosNotifications className="text-blue-500  text-2xl mx-2" />
                {!!unreadCount && <span className="absolute text-white bg-red-500 w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
              </div>
            </Link>
          )}

          <Dropdown>
            <Dropdown.Toggle 
              variant="none" 
              id="dropdown-user" 
              className="d-flex align-items-center bg-transparent border-0 p-2 rounded-circle hover-bg"
              style={{
                transition: "all 0.3s ease",
                borderRadius: "50%"
              }}
            >
              <div className="position-relative">
                <FaUserCircle className="text-white text-2xl" />
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
                      className="rounded-pill py-2 fw-medium"
                      onClick={() => setShowLoginModal(true)}
                      style={{
                        background: "linear-gradient(45deg, #0078FF, #0056CC)",
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
      <style jsx>{`
        .hover-bg:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .hover-item:hover {
          background-color: #f8f9fa !important;
          transform: translateX(-2px);
        }
        
        .hover-item.text-danger:hover {
          background-color: rgba(220, 53, 69, 0.1) !important;
          color: #dc3545 !important;
        }
        
        .dropdown-menu {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-item {
          border-radius: 8px !important;
          margin-bottom: 2px;
        }
        
        .dropdown-item:focus {
          background-color: #e3f2fd !important;
          color: #1976d2 !important;
        }
        
        .dropdown-toggle::after {
          display: none;
        }
        
        .badge {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Navsearch;
