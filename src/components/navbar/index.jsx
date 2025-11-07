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
          className='font-bold text-nowrap text-blue-500 mx-1'
        >
          صفحة الادمن
        </Link>
      </div>}
      
      {/* Chat Links */}
      {isAuthenticated && (
        <div className="mt-2 flex items-center space-x-2">
          <Link
            to={isAdmin() ? "/admin/chat" : "/chat"}
            className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
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
    <div className='relative z-10' style={{ zIndex: "1000" }}>
      <Navsearch />
      <Navbar
        dir='rtl'
        expand='lg'
        className='navbar bg-body-tertiary block shadow'
      >
        <Container>
          <Navbar.Toggle
            aria-controls='responsive-navbar-nav'
            onClick={isMobile ? handleShow : null}
          />
          <Navbar.Collapse
            id='responsive-navbar-nav'
            className='flex justify-center'
          >
            {!isMobile && navLinks}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} className='offcanvas-custom'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h1>raha</h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body className='flex items-start'>
          <div className='w-[80%] mx-auto'>{navLinks}</div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default NavbarComponent;