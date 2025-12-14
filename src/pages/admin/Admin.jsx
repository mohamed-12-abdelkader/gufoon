import React from "react";
import { useState } from "react";
import AdminLinks from "../../components/admin/AdminLinks";
import { MdAdminPanelSettings } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Admin = () => {
  const [currentLink, setCurrentLink] = useState("");

  return (
    <>
      <Container dir='rtl' fluid style={{ marginTop: "0px", backgroundColor: "var(--bg-primary)", minHeight: "85vh" }}>
        <Row>
          <Col
            md={3}
            className='admin-sidebar'
            style={{ minHeight: "85vh" }}
          >
            <div className='d-flex flex-column align-items-center mt-4'>
              <div className='admin-header-card'>
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
          <Col md={9} className='p-4 admin-content'>
            <Outlet />
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .admin-sidebar {
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          padding: 20px;
        }

        .admin-header-card {
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--shadow);
          padding: 15px;
          border-radius: 20px;
          width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          color: var(--text-primary);
        }

        .admin-content {
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        [data-theme="dark"] .admin-sidebar {
          background: var(--bg-secondary);
          border-right-color: var(--border-color);
        }

        [data-theme="dark"] .admin-header-card {
          background: var(--card-bg);
          border-color: var(--border-color);
          color: var(--text-primary);
        }
      `}</style>
    </>
  );
};

export default Admin;
