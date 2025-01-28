import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import SendOrder from "../../Hook/order/SendOrder";
import useGitCart from "../../Hook/user/useGitCart";
import useDeleateProductFromCart from "../../Hook/user/useDeleateProductFromCart";
import useUpdateCartQuantity from "../../Hook/user/useUpdateCartQuantity";

const Cart = () => {
  const [carts, cartsLoading, refreshCart] = useGitCart();
  const { handleDeleateFromToCart, deleatloading } =
    useDeleateProductFromCart();
  const { updateQuantity, updatingItemId, updatingAction } =
    useUpdateCartQuantity();
  const [setaddress, address, handleSubmit, loading] = SendOrder();
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cashOnDelivery, setCashOnDelivery] = useState(true);

  const handleDelete = async (itemId) => {
    setDeletingItemId(itemId);
    await handleDeleateFromToCart(itemId);
    setDeletingItemId(null);
    refreshCart();
  };

  const handleQuantityChange = async (item, increment) => {
    const newQuantity = increment ? item.quentity + 1 : item.quentity - 1;
    if (newQuantity > 0) {
      await updateQuantity(item.id, newQuantity, increment ? "plus" : "minus");
      refreshCart();
    }
  };

  const handleShowModal = () => setShowOrderModal(true);
  const handleCloseModal = () => setShowOrderModal(false);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
    handleCloseModal();
  };

  if (cartsLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner animation='border' variant='primary' />
      </div>
    );
  }

  if (!carts || !carts.data) {
    return (
      <div className='text-center py-5'>
        <h3>السلة فارغة</h3>
        <p className='text-muted'>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
        <Button variant='primary' href='/products'>
          تسوق الآن
        </Button>
      </div>
    );
  }

  return (
    <Container dir='rtl' className='my-5 pt-5'>
      <h2 className='text-center mb-4 fw-bold'>سلة المشتريات</h2>

      {carts?.data?.length > 0 ? (
        <Row>
          {/* عرض المنتجات */}
          <Col lg={8}>
            <div className='cart-items'>
              {carts.data.map((item) => (
                <div
                  key={item.id}
                  className='cart-item bg-white p-3 rounded-3 mb-3 shadow-sm'
                >
                  <Row className='align-items-center'>
                    {/* صورة المنتج */}
                    <Col sm={3}>
                      <img
                        src={item.productInfo.images[0].image}
                        alt={item.productInfo.product_name}
                        className='img-fluid rounded-3'
                        style={{ height: "120px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* تفاصيل المنتج */}
                    <Col sm={6}>
                      <h5 className='mb-2'>{item.productInfo.product_name}</h5>
                      <div className='product-details text-muted small'>
                        <p className='mb-1'>
                          البراند: {item.productInfo.brand_name}
                        </p>
                        <p className='mb-1'>المقاس: {item.productInfo.size}</p>
                        <p className='mb-1'>
                          اللون: {item.productInfo.frame_color}
                        </p>
                      </div>
                      <div className='quantity-controls mt-2 d-flex align-items-center gap-2'>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => handleQuantityChange(item, false)}
                          disabled={
                            (updatingItemId === item.id &&
                              updatingAction === "minus") ||
                            item.quentity <= 1
                          }
                        >
                          {updatingItemId === item.id &&
                          updatingAction === "minus" ? (
                            <Spinner size='sm' />
                          ) : (
                            <FaMinus />
                          )}
                        </Button>
                        <span className='mx-2'>{item.quentity}</span>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => handleQuantityChange(item, true)}
                          disabled={
                            updatingItemId === item.id &&
                            updatingAction === "plus"
                          }
                        >
                          {updatingItemId === item.id &&
                          updatingAction === "plus" ? (
                            <Spinner size='sm' />
                          ) : (
                            <FaPlus />
                          )}
                        </Button>
                      </div>
                    </Col>

                    {/* السعر وزر الحذف */}
                    <Col sm={3} className='text-end'>
                      <div className='price-section'>
                        <h5 className='text-primary mb-2'>
                          {item.TotalSalry} ر.س
                        </h5>
                        {item.productInfo.percent > 0 && (
                          <span className='badge bg-danger mb-2'>
                            خصم {item.productInfo.percent}%
                          </span>
                        )}
                      </div>
                      <Button
                        variant='outline-danger'
                        size='sm'
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingItemId === item.id}
                      >
                        {deletingItemId === item.id ? (
                          <Spinner size='sm' />
                        ) : (
                          <FaTrash />
                        )}
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>

          {/* ملخص الطلب */}
          <Col lg={4}>
            <div className='order-summary bg-white p-4 rounded-3 shadow-sm'>
              <h4 className='mb-4'>ملخص الطلب</h4>

              <div className='d-flex justify-content-between mb-3'>
                <span>عدد المنتجات</span>
                <span>{carts.data.length}</span>
              </div>

              <div className='d-flex justify-content-between mb-3'>
                <span>المجموع الفرعي</span>
                <span>{carts.total} ر.س</span>
              </div>

              <hr />

              <div className='d-flex justify-content-between mb-4'>
                <strong>الإجمالي</strong>
                <strong className='text-primary'>{carts.total} ر.س</strong>
              </div>

              <Button
                variant='primary'
                className='w-100 py-2'
                onClick={handleShowModal}
              >
                إتمام الطلب
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <div className='text-center py-5'>
          <h3>السلة فارغة</h3>
          <p className='text-muted'>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <Button variant='primary' href='/products'>
            تسوق الآن
          </Button>
        </div>
      )}

      {/* Order Modal */}
      <Modal show={showOrderModal} onHide={handleCloseModal} size='xl' centered>
        <Modal.Header closeButton>
          <Modal.Title>إتمام الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* معلومات العميل */}
            <Col lg={7}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label>العنوان بالتفصيل</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Check
                    type='checkbox'
                    label='الدفع عند الاستلام'
                    checked={cashOnDelivery}
                    onChange={(e) => setCashOnDelivery(e.target.checked)}
                    required
                  />
                </Form.Group>

                <Button
                  variant='primary'
                  type='submit'
                  className='w-100'
                  disabled={loading}
                >
                  {loading ? <Spinner size='sm' /> : "تأكيد الطلب"}
                </Button>
              </Form>
            </Col>

            {/* ملخص الطلب */}
            <Col lg={5} className='bg-light p-4 rounded-3'>
              <h5 className='mb-4'>ملخص الطلب</h5>

              <div className='order-items mb-4'>
                {carts?.data?.map((item) => (
                  <div
                    key={item.id}
                    className='d-flex justify-content-between align-items-center mb-2'
                  >
                    <div className='d-flex align-items-center'>
                      <img
                        src={item.productInfo.images[0].image}
                        alt={item.productInfo.product_name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className='rounded me-2'
                      />
                      <div>
                        <p className='mb-0 fw-bold'>
                          {item.productInfo.product_name}
                        </p>
                        <small className='text-muted'>
                          الكمية: {item.quentity}
                        </small>
                      </div>
                    </div>
                    <span className='text-primary fw-bold'>
                      {item.TotalSalry} ر.س
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              <div className='summary-details'>
                <div className='d-flex justify-content-between mb-2'>
                  <span>المجموع الفرعي</span>
                  <span>{carts.total} ر.س</span>
                </div>
                <div className='d-flex justify-content-between mb-2'>
                  <span>الشحن</span>
                  <span className='text-success'>مجاناً</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between'>
                  <strong>الإجمالي</strong>
                  <strong className='text-primary'>{carts.total} ر.س</strong>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .cart-item {
          transition: all 0.3s ease;
        }
        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        .quantity-controls button {
          width: 30px;
          height: 30px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .order-summary {
          position: sticky;
          top: 100px;
        }
      `}</style>
    </Container>
  );
};

export default Cart;
