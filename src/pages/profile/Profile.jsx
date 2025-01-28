import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className='profile-page'>
      <Container className='py-5' dir='rtl'>
        <div className='page-header text-center mb-5'>
          <h2 className='page-title mb-3'>الملف الشخصي</h2>
          <p className='text-muted'>معلوماتك الشخصية</p>
        </div>

        <Row className='justify-content-center'>
          <Col md={8}>
            <Card className='profile-card'>
              <Card.Body className='p-4'>
                <div className='profile-header mb-4'>
                  <div className='avatar-placeholder'>
                    {user.fname?.charAt(0)}
                    {user.lname?.charAt(0)}
                  </div>
                  <h3 className='user-name'>
                    {user.fname} {user.lname}
                  </h3>
                </div>

                <div className='info-grid'>
                  <div className='info-item'>
                    <div className='info-icon'>
                      <FaEnvelope />
                    </div>
                    <div className='info-content'>
                      <label>البريد الإلكتروني</label>
                      <p>{user.mail}</p>
                    </div>
                  </div>

                  <div className='info-item'>
                    <div className='info-icon'>
                      <FaPhone />
                    </div>
                    <div className='info-content'>
                      <label>رقم الهاتف</label>
                      <p>{user.phone}</p>
                    </div>
                  </div>

                  <div className='info-item'>
                    <div className='info-icon'>
                      <FaCity />
                    </div>
                    <div className='info-content'>
                      <label>المدينة</label>
                      <p>{user.city}</p>
                    </div>
                  </div>

                  <div className='info-item'>
                    <div className='info-icon'>
                      <FaMapMarkerAlt />
                    </div>
                    <div className='info-content'>
                      <label>العنوان</label>
                      <p>{user.address}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .profile-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .page-title {
          color: #333;
          font-size: 2rem;
          font-weight: 600;
        }

        .profile-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .profile-header {
          text-align: center;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .avatar-placeholder {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #4b6cb7, #182848);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
          font-size: 2rem;
          font-weight: 600;
        }

        .user-name {
          color: #333;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: #f1f3f5;
          transform: translateY(-2px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b6cb7;
          font-size: 1.2rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .info-content {
          flex: 1;
        }

        .info-content label {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .info-content p {
          color: #333;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .avatar-placeholder {
            width: 80px;
            height: 80px;
            font-size: 1.5rem;
          }

          .user-name {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
