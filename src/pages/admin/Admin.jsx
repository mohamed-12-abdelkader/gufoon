import React from "react";
import { useState } from "react";
import AdminLinks from "../../components/admin/AdminLinks";
import { MdAdminPanelSettings } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Admin = () => {
  const [currentLink, setCurrentLink] = useState("");

  return (
    <Container dir='rtl' fluid style={{ marginTop: "0px" }}>
      <Row>
        <Col
          md={3}
          className='bg-light border-end'
          style={{ minHeight: "85vh" }}
        >
          <div className='d-flex flex-column align-items-center mt-4'>
            <div
              className='border shadow-sm p-3 d-flex align-items-center justify-content-center'
              style={{ borderRadius: "20px", width: "200px" }}
            >
              <h5 className='mb-0 font-weight-bold'>صفحة الادمن</h5>
              <MdAdminPanelSettings className='text-primary ms-2 fs-4' />
            </div>
          </div>
          <div className='mt-'>
            <AdminLinks
              currentLink={currentLink}
              setCurrentLink={setCurrentLink}
            />
          </div>
        </Col>
        <Col md={9} className='p-4'>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
