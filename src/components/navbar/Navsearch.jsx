import { useState, useEffect, useRef } from "react";
import { Button, Dropdown, Form, Offcanvas } from "react-bootstrap";
import { FaBell, FaCartPlus } from "react-icons/fa6";
import { FaUserCircle, FaSignOutAlt, FaShoppingBag, FaUserEdit, FaTools, FaFileInvoiceDollar } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/Notifications";
import { IoIosNotifications } from "react-icons/io";

const Navsearch = () => {
  const [show, setShow] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const searchRef = useRef(null);

  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { unreadCount } = useNotifications();

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

  return (
    <div dir="ltr" className="bg-[#3c4851] h-[70px] flex items-center navsearch w-[100%]" style={{ zIndex: "1000" }}>
      <div className="m-auto w-[90%] flex justify-between items-center">
        <div className="mr-3">
          <Link to="/">
            <h3 className="text-white">gufoon</h3>
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
            />
          </Form>
        </div>

        <div className="flex items-center">
          {!isAdmin() && (
            <Link to="/cart" className="relative">
              <FaCartPlus className="text-3xl mt-2 mx-2 text-white" />
              {totalCartItems > 0 && (
                <span className="absolute bg-blue-700 text-white font-bold text-lg flex justify-center items-center w-6 h-6 rounded-full top-0 -left-4">{totalCartItems}</span>
              )}
            </Link>
          )}

          {/* Show Bill Only for Admins */}
          {isAdmin() && (
            <Link to='/admin/notifications' title="Notifications">
              <div className="flex items-center">
                <IoIosNotifications className="text-blue-500  text-2xl mx-2" />
                {!!unreadCount && <span className="absolute text-white bg-red-500 w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
              </div>
            </Link>
          )}

          <Dropdown>
            <Dropdown.Toggle variant="none" id="dropdown-user" className="d-flex align-items-center">
              <FaUserCircle className="text-white text-2xl mx-2" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" dir="rtl" className="p-2">
              {isAuthenticated ? (
                <>
                  {isAdmin() && (
                    <Dropdown.Item as={Link} className="flex" to="/admin/management">
                      <FaTools className="text-primary" />
                      <span>صفحة الادمن</span>
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item as={Link} to="/orders">
                    <FaShoppingBag className="text-success" />
                    <span>طلباتي</span>
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUserEdit className="text-info" />
                    <span>الملف الشخصي</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>
                    <FaSignOutAlt className="text-danger" />
                    <span className="text-danger">تسجيل الخروج</span>
                  </Dropdown.Item>
                </>
              ) : (
                <div className="d-flex flex-column">
                  <Button variant="outline-primary" className="mb-2" onClick={() => setShowLoginModal(true)}>
                    تسجيل الدخول
                  </Button>
                  <Button variant="outline-secondary" onClick={() => setShowSignupModal(true)}>
                    إنشاء حساب
                  </Button>
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
    </div>
  );
};

export default Navsearch;
