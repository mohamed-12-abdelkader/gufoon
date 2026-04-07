import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Navsearch from "./Navsearch";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import ChatNotificationBadge from "../chat/ChatNotificationBadge";
import baseUrl from "../../api/baseUrl";

function NavbarComponent() {
  const [carts, setCarts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAdmin, isAuthenticated } = useAuth()
  const { isConnected } = useChat()

  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchCarts = () => {
    const storedCarts = JSON.parse(localStorage.getItem("carts")) || [];
    setCarts(storedCarts);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await baseUrl.get("/api/categories/hierarchy");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
    fetchCategories();
  }, []);

  const navLinks = (
    <Nav dir='rtl' className='me-auto mb- ' style={{ zIndex: "1000" }}>
      <div className='w-[100%] flex flex-wrap justify-between'>
        {loading ? (
          <div className="flex items-center justify-center w-full py-2">
            <span className="text-gray-500">جاري التحميل...</span>
          </div>
        ) : (
          categories.map((category) => (
            <NavDropdown 
              key={category.id} 
              title={category.name} 
              id={`navbarScrollingDropdown-${category.id}`}
              className="category-dropdown"
            >
              {category.children && category.children.length > 0 ? (
                category.children.map((child) => (
                  <NavDropdown.Item key={child.id} className="category-item">
                    <Link 
                      to={`/categories/${child.id}`}
                      className="block w-full text-right py-2 px-3 hover:bg-gray-100 transition-colors"
                    >
                      {child.name}
                    </Link>
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item className="category-item">
                  <Link 
                    to={`/categories/${category.id}`}
                    className="block w-full text-right py-2 px-3 hover:bg-gray-100 transition-colors"
                  >
                    عرض جميع المنتجات
                  </Link>
                </NavDropdown.Item>
              )}
            </NavDropdown>
          ))
        )}
        
        {/* Special offers dropdown */}
       
      </div>
      {isAdmin() && <div className="mt-2 flex">
        <Link
          to={"/admin"}
          className='font-bold text-nowrap mx-1'
          style={{ color: '#012148' }}
        >
          صفحة الأدمن
        </Link>
      </div>}
      
      {/* Chat Links */}
      {isAuthenticated && (
        <div className="mt-2 flex items-center space-x-2">
          <Link
            to={isAdmin() ? "/admin/chat" : "/chat"}
            className="flex items-center space-x-2 transition-colors"
            style={{ color: '#012148' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">
              {isAdmin() ? 'إدارة المحادثات' : 'الدردشة'}
            </span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </Link>
          
          {isAuthenticated && (
            <ChatNotificationBadge />
          )}
        </div>
      )}
    </Nav>
  );

  return (
    <div className='sticky top-0' style={{ zIndex: 1050 }}>
      <Navsearch />
      <Navbar
        dir='rtl'
        expand='lg'
        className='navbar navbar-categories'
      >
        <Container className='navbar-categories-container'>
          <Navbar.Toggle
            aria-controls='responsive-navbar-nav'
            onClick={isMobile ? handleShow : null}
            className='navbar-toggler-custom'
          />
          <Navbar.Collapse
            id='responsive-navbar-nav'
            className='navbar-collapse-custom'
          >
            {!isMobile && navLinks}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} className='offcanvas-custom' placement='end' dir='rtl'>
        <Offcanvas.Header closeButton className='offcanvas-header-custom'>
          <Offcanvas.Title className='offcanvas-title-custom'>
            التصنيفات
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='offcanvas-body-custom'>
          <div className='offcanvas-nav-wrap'>{navLinks}</div>
        </Offcanvas.Body>
      </Offcanvas>
      <style>{`
        .navbar-categories {
          background: #f8fafc !important;
          border-bottom: 1px solid rgba(1, 33, 72, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          padding: 0.5rem 0;
        }
        .navbar-categories-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .navbar-toggler-custom {
          border: 1px solid rgba(1, 33, 72, 0.2);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
        }
        .navbar-toggler-custom:focus {
          box-shadow: 0 0 0 2px rgba(1, 33, 72, 0.2);
        }
        .navbar-collapse-custom {
          justify-content: center;
        }
        .category-dropdown .nav-link,
        .navbar-categories .nav-dropdown-toggle {
          color: #012148 !important;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .category-dropdown .nav-link:hover,
        .navbar-categories .nav-link:hover {
          background: rgba(1, 33, 72, 0.06);
          color: #013060 !important;
        }
        .category-dropdown .dropdown-menu {
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          margin-top: 4px;
        }
        .category-item .dropdown-item {
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: #012148;
          font-weight: 500;
        }
        .category-item .dropdown-item:hover {
          background: rgba(1, 33, 72, 0.08);
          color: #013060;
        }
        .offcanvas-header-custom {
          border-bottom: 1px solid #eee;
          padding: 1rem 1.25rem;
        }
        .offcanvas-title-custom {
          font-weight: 700;
          font-size: 1.35rem;
          color: #012148;
          font-family: var(--font-primary);
        }
        .offcanvas-body-custom {
          padding: 1rem 1.25rem;
        }
        .offcanvas-nav-wrap {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default NavbarComponent;