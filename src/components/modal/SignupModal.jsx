import React from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";
import userSingup from "../../Hook/user/userSingup";

const SignupModal = ({ show, handleClose }) => {
  const [
    handleSingup,
    passChange,
    mail,
    mailChange,
    fName,
    fnameChange,
    lName,
    lNamechange,
    phone,
    phonechange,
    address,
    addressChange,
    city,
    cityChange,
    pass,
    userType,
    setUserType,
    loading,
  ] = userSingup();

  return (
    <Modal show={show} onHide={handleClose} size='lg' centered>
      <Modal.Header closeButton className='border-0 pb-0'>
        <Modal.Title className='w-100 text-center fw-bold'>
          <h4 className='mb-0'>إنشاء حساب جديد</h4>
          <p className='text-muted fs-6 mt-2'>
            انضم إلينا واستمتع بتجربة تسوق فريدة
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='px-4 pt-0'>
        <Form className='signup-form'>
          <Row className='g-3'>
            <Col md={6}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaUser />
                </div>
                <Form.Control
                  value={fName}
                  onChange={fnameChange}
                  placeholder='الاسم الأول'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaUser />
                </div>
                <Form.Control
                  value={lName}
                  onChange={lNamechange}
                  placeholder='الاسم الأخير'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaEnvelope />
                </div>
                <Form.Control
                  value={mail}
                  onChange={mailChange}
                  type='email'
                  placeholder='البريد الإلكتروني'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaLock />
                </div>
                <Form.Control
                  value={pass}
                  onChange={passChange}
                  type='password'
                  placeholder='كلمة المرور'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaPhone />
                </div>
                <Form.Control
                  value={phone}
                  onChange={phonechange}
                  placeholder='رقم الهاتف'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaCity />
                </div>
                <Form.Control
                  value={city}
                  onChange={cityChange}
                  placeholder='المدينة'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className='input-group-custom'>
                <div className='input-icon'>
                  <FaMapMarkerAlt />
                </div>
                <Form.Control
                  value={address}
                  onChange={addressChange}
                  as='textarea'
                  rows={2}
                  placeholder='العنوان بالتفصيل'
                  className='form-control-custom'
                />
              </Form.Group>
            </Col>
          </Row>

          <div className='text-center mt-4'>
            <Button
              variant='primary'
              type='submit'
              onClick={handleSingup}
              className='signup-btn'
              disabled={loading}
            >
              {loading ? (
                <Spinner animation='border' size='sm' />
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <style jsx>{`
        .modal-content {
          border-radius: 15px;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .input-group-custom {
          position: relative;
          margin-bottom: 0;
        }

        .input-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 10;
        }

        .form-control-custom {
          height: 48px;
          padding-right: 45px;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
        }

        textarea.form-control-custom {
          height: auto;
          padding-top: 12px;
        }

        .signup-btn {
          padding: 12px 40px;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(13, 110, 253, 0.2);
        }

        .signup-form {
          padding: 20px 0;
        }

        .text-muted {
          font-size: 0.9rem;
        }
      `}</style>
    </Modal>
  );
};

export default SignupModal;
