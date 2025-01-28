import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import UserType from "../../Hook/userType/UserType";
import LoginModal from "../modal/LoginModal";
import SignupModal from "../modal/SignupModal";
import Navsearch from "./Navsearch";

function NavScrollExample() {
  const [carts, setCarts] = useState([]);
  const [userData, isAdmin, user] = UserType();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
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

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const navLinks = (
    <Nav dir='rtl' className='me-auto mb- ' style={{ zIndex: "1000" }}>
      <div className='w-[100%] flex flex-wrap justify-between'>
        <NavDropdown title='نظارات شمسية' id='navbarScrollingDropdown'>
          <NavDropdown.Item>
            <Link to={"/men_sunglasses"}>نظارات شمسية رجالى </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to={"/women_sunglasses"}>نظارات شمسية نسائى </Link>
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title='نظارات طبية' id='navbarScrollingDropdown'>
          <NavDropdown.Item>
            <Link to={"/men_prescription_glasses"}>نظارات طبية رجالى </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to={"/women_prescription_glasses"}>نظارات طبية نسائى </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to={"/children_prescription_glasses"}>
              نظارات طبية اطفالى{" "}
            </Link>
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title=' عدسات لاصقة ' id='navbarScrollingDropdown'>
          <NavDropdown.Item> عدسات طبية </NavDropdown.Item>
          <NavDropdown.Item> عدسات ملونة power </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title='  الخصومات  ' id='navbarScrollingDropdown'>
          <NavDropdown.Item>
            <Link to={"/glasses_offer"}>خصومات النظارات </Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to={"/lenses_offer"}>خصومات العدسات</Link>
          </NavDropdown.Item>
        </NavDropdown>
      </div>
      <Form className='d-flex'>
        {isAdmin ? (
          <div className='mt-2 flex'>
            <Link
              to={"/admin/add_discount"}
              className='font-bold text-blue-500 mx-1'
            >
              صفحة الادمن
            </Link>
          </div>
        ) : (
          !userData && <></>
        )}
      </Form>
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

export default NavScrollExample;
