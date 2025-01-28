import { useState, useEffect, useRef } from "react";
import {
  Button,
  Dropdown,
  Form,
  NavDropdown,
  Navbar,
  Offcanvas,
  Badge,
  Spinner,
} from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaCartShopping, FaBell, FaCartPlus } from "react-icons/fa6";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUserCog,
  FaShoppingBag,
  FaUserEdit,
  FaTools,
} from "react-icons/fa";
import img from "../../images/36dab390-04c0-4604-8931-dbdcfacce53e-260x260.png";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import useGitCart from "../../Hook/user/useGitCart";

const Navsearch = () => {
  const [show, setShow] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const [carts, cartsLoading] = useGitCart();
  {
    cartsLoading ? console.log("loading") : console.log(carts);
  }
  // التحقق من وجود المستخدم
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const searchRef = useRef(null);

  const categories = [
    {
      title: "نظارات شمسية",
      items: [
        { name: "نظارات شمسية رجالى", path: "/men_sunglasses" },
        { name: "نظارات شمسية نسائى", path: "/women_sunglasses" },
      ],
    },
    {
      title: "نظارات طبية",
      items: [
        { name: "نظارات طبية رجالى", path: "/men_prescription_glasses" },
        { name: "نظارات طبية نسائى", path: "/women_prescription_glasses" },
        { name: "نظارات طبية اطفالى", path: "/children_prescription_glasses" },
      ],
    },
    {
      title: "عدسات لاصقة",
      items: [
        { name: "عدسات طبية", path: "/medical_lenses" },
        { name: "عدسات ملونة power", path: "/colored_lenses" },
      ],
    },
    {
      title: "الخصومات",
      items: [
        { name: "خصومات النظارات", path: "/glasses_offer" },
        { name: "خصومات العدسات", path: "/lenses_offer" },
      ],
    },
  ];

  // تصفية الفئات حسب البحث
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!token);
    setIsAdmin(user?.role === "admin");
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <div
      dir='ltr'
      className='bg-[#3c4851] h-[70px] flex items-center navsearch w-[100%]'
      style={{ zIndex: "1000" }}
    >
      <div className='m-auto w-[90%] flex justify-between items-center'>
        <div className='mr-3'>
          <Link to='/'>
            <h3 className='text-white'>gufoon</h3>
          </Link>
        </div>
        <div className='flex w-[60%] relative' ref={searchRef}>
          <Form className='w-100'>
            <Form.Control
              dir='rtl'
              type='search'
              placeholder='ابحث عن منتجك المفضل ؟'
              className='flex-grow me-2'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchMenu(true);
              }}
              onClick={() => setShowSearchMenu(true)}
            />
          </Form>

          {showSearchMenu && (
            <div className='search-menu'>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <div dir='rtl' key={index} className='category-section'>
                    <h6 className='category-title'>{category.title}</h6>
                    {category.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        className='search-item'
                        onClick={() => setShowSearchMenu(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <div className='no-results'>لا توجد نتائج مطابقة للبحث</div>
              )}
            </div>
          )}
        </div>
        <div className='flex items-center'>
          <Dropdown>
            <Dropdown.Toggle
              variant='none'
              id='dropdown-notifications'
              className='position-relative d-flex align-items-center'
              style={{
                "&::after": {
                  display: "none",
                },
              }}
            >
              <FaUserCircle className='text-white text-2xl mx-2' />
            </Dropdown.Toggle>

            <Dropdown.Menu
              align='end'
              dir='rtl'
              className='p-2'
              style={{ zIndex: 1050 }}
            >
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Dropdown.Item as={Link} to='/admin/management'>
                      <div className='d-flex align-items-center gap-2'>
                        <FaTools className='text-primary' />
                        <span>صفحة الادمن</span>
                      </div>
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item as={Link} to='/orders'>
                    <div className='d-flex align-items-center gap-2'>
                      <FaShoppingBag className='text-success' />
                      <span>طلباتي</span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to='/profile'>
                    <div className='d-flex align-items-center gap-2'>
                      <FaUserEdit className='text-info' />
                      <span>الملف الشخصي</span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={handleLogout}>
                    <div className='d-flex align-items-center gap-2'>
                      <FaSignOutAlt className='text-danger' />
                      <span className='text-danger'>تسجيل الخروج</span>
                    </div>
                  </Dropdown.Item>
                </>
              ) : (
                <div className='d-flex flex-column'>
                  <Button
                    variant='outline-primary'
                    className='mb-2'
                    onClick={() => setShowLoginModal(true)}
                  >
                    تسجيل الدخول
                  </Button>
                  <Button
                    variant='outline-secondary'
                    onClick={() => setShowSignupModal(true)}
                  >
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {isLoggedIn && (
            <Dropdown show={showNotifications} onToggle={toggleNotifications}>
              <Dropdown.Toggle
                variant='none'
                id='dropdown-notifications'
                className='position-relative d-flex align-items-center'
                style={{
                  "&::after": {
                    display: "none",
                  },
                }}
              >
                <FaBell
                  className='text-white text-xl'
                  style={{ cursor: "pointer" }}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu
                dir='rtl'
                align='end'
                className='p-2'
                style={{ zIndex: 1050 }}
              >
                <Dropdown.ItemText>إشعارات</Dropdown.ItemText>
                <Dropdown.Divider />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className='position-relative'>
          {!isAdmin && (
            <Link to='/cart'>
              <div style={{ position: "relative" }}>
                <FaCartPlus className='text-3xl mt-2 mx-2 text-white' />
                {!cartsLoading && carts?.data?.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "50%",
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: "red",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                    }}
                    className='font-bold'
                  >
                    {carts.data.length}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>سلة التسوق</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>

      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
      <SignupModal
        show={showSignupModal}
        handleClose={() => setShowSignupModal(false)}
      />

      <style jsx>{`
        .dropdown-toggle::after {
          display: none !important;
        }
        .dropdown-item {
          padding: 8px 16px;
          transition: all 0.2s ease;
          dir: rtl;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(-5px);
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .search-menu {
          position: absolute;
          top: 100%;
          right: 0;
          left: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-top: 8px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 9999;
        }

        .category-section {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .category-section:last-child {
          border-bottom: none;
        }

        .category-title {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .search-item {
          display: block;
          padding: 8px 12px;
          color: #333;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .search-item:hover {
          background-color: #f8f9fa;
          color: #0d6efd;
          transform: translateX(-5px);
        }

        .no-results {
          padding: 20px;
          text-align: center;
          color: #666;
        }

        /* تخصيص شريط التمرير */
        .search-menu::-webkit-scrollbar {
          width: 8px;
        }

        .search-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .search-menu::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .search-menu::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Navsearch;
