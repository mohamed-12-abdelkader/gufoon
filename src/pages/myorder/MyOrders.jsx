import React from "react";
import useGitMyOrders from "../../Hook/user/useGitMyOrders";
import { Card, Badge, Spinner, Container, Button } from "react-bootstrap";
import { FaBox, FaCheck, FaTruck, FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const MyOrders = () => {
  const [orders, ordersLoading] = useGitMyOrders();

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await baseUrl.put(
        `api/order/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم إلغاء الطلب بنجاح");
      // إعادة تحميل الطلبات
      window.location.reload();
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء الطلب");
    }
  };

  if (ordersLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-content'>
          <Spinner animation='border' variant='primary' size='lg' />
          <p className='mt-3'>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  const getOrderStatus = (status) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Processing":
        return 2;
      case "Shipping":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  const canCancelOrder = (status) => {
    return status === "Pending" || status === "Processing";
  };

  return (
    <div className='orders-page'>
      <Container className='py-5' dir='rtl'>
        <div className='page-header text-center mb-5'>
          <h2 className='page-title mb-3'>طلباتي</h2>
          <p className='text-muted'>يمكنك متابعة حالة طلباتك هنا</p>
        </div>

        {orders?.orders?.length > 0 ? (
          <div className='orders-container'>
            {orders.orders.map((order) => (
              <Card key={order.order_id} className='order-card mb-4'>
                <Card.Header className='order-header p-4'>
                  <div className='d-flex justify-content-between align-items-center mb-4'>
                    <div className='d-flex align-items-center gap-3'>
                      <h3 className='order-number mb-0'>
                        طلب #{order.order_id}
                      </h3>
                      {canCancelOrder(order.status) && (
                        <Button
                          variant='danger'
                          size='sm'
                          className='cancel-button'
                          onClick={() => handleCancelOrder(order.order_id)}
                        >
                          <FaTimes className='me-1' />
                          إلغاء الطلب
                        </Button>
                      )}
                    </div>
                    <div className='order-price'>
                      <span className='total-label ml-2'>الإجمالي:</span>
                      <span className='total-amount'>
                        {order.total_price} ج.م
                      </span>
                    </div>
                  </div>

                  <div className='tracking-container'>
                    <div className='tracking-steps'>
                      <div
                        className={`step ${
                          getOrderStatus(order.status) >= 1 ? "active" : ""
                        }`}
                      >
                        <div className='step-icon'>
                          <FaBox />
                        </div>
                        <div className='step-label'>تم الطلب</div>
                      </div>
                      <div
                        className={`step ${
                          getOrderStatus(order.status) >= 2 ? "active" : ""
                        }`}
                      >
                        <div className='step-icon'>
                          <FaSpinner />
                        </div>
                        <div className='step-label'>جاري التنفيذ</div>
                      </div>
                      <div
                        className={`step ${
                          getOrderStatus(order.status) >= 3 ? "active" : ""
                        }`}
                      >
                        <div className='step-icon'>
                          <FaTruck />
                        </div>
                        <div className='step-label'>جاري التوصيل</div>
                      </div>
                      <div
                        className={`step ${
                          getOrderStatus(order.status) >= 4 ? "active" : ""
                        }`}
                      >
                        <div className='step-icon'>
                          <FaCheck />
                        </div>
                        <div className='step-label'>تم التوصيل</div>
                      </div>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className='p-4'>
                  <h4 className='mb-4'>تفاصيل الطلب</h4>
                  {order.items.map((item) => (
                    <div
                      key={item.product_id}
                      className='product-item mb-3 p-3'
                    >
                      <div className='row align-items-center'>
                        <div className='col-md-8'>
                          <h5 className='product-name mb-2'>
                            {item.product_name}
                          </h5>
                          <div className='product-specs'>
                            <span className='spec-item'>
                              الموديل: {item.model_number}
                            </span>
                            <span className='spec-item'>
                              البراند: {item.brand_name}
                            </span>
                            <span className='spec-item'>
                              النوع: {item.type}
                            </span>
                            <span className='spec-item'>
                              اللون: {item.frame_color}
                            </span>
                          </div>
                        </div>
                        <div className='col-md-4 text-md-end'>
                          <div className='product-price'>
                            <div className='quantity mb-2'>
                              الكمية: {item.quantity}
                            </div>
                            <div className='price'>
                              <span className='amount'>{item.price} ج.م</span>
                              {item.discount_percent > 0 && (
                                <Badge bg='danger' className='ms-2'>
                                  خصم {item.discount_percent}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className='text-center py-5'>
            <h4 className='mb-3'>لا توجد طلبات حالياً</h4>
            <p className='text-muted'>يمكنك البدء في التسوق الآن</p>
          </div>
        )}
      </Container>

      <style jsx>{`
        .orders-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .page-title {
          color: #333;
          font-size: 2rem;
          font-weight: 600;
        }

        .order-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          background-color: #fff;
          border-bottom: 1px solid #eee;
        }

        .order-number {
          color: #333;
          font-size: 1.5rem;
        }

        .total-label {
          color: #666;
          margin-left: 8px;
        }

        .total-amount {
          color: #28a745;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .tracking-container {
          margin-top: 2rem;
        }

        .tracking-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin: 0 auto;
        }

        .tracking-steps::before {
          content: "";
          position: absolute;
          top: 25px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e9ecef;
          z-index: 1;
        }

        .step {
          position: relative;
          z-index: 2;
          flex: 1;
          text-align: center;
          color: #adb5bd;
          transition: all 0.3s ease;
        }

        .step.active {
          color: #28a745;
        }

        .step-icon {
          width: 50px;
          height: 50px;
          background: #fff;
          border: 2px solid #e9ecef;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .step.active .step-icon {
          background: #28a745;
          border-color: #28a745;
          color: #fff;
        }

        .step-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .product-item {
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .product-item:hover {
          background: #f1f3f5;
        }

        .product-name {
          color: #333;
          font-weight: 600;
        }

        .product-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .spec-item {
          background: #fff;
          padding: 4px 12px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .product-price {
          text-align: right;
        }

        .quantity {
          color: #666;
        }

        .amount {
          font-weight: 600;
          color: #28a745;
          font-size: 1.1rem;
        }

        .cancel-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
        }

        @media (max-width: 768px) {
          .tracking-steps {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .tracking-steps::before {
            top: 0;
            bottom: 0;
            left: 25px;
            width: 2px;
            height: auto;
          }

          .step {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .step-icon {
            margin: 0;
          }

          .product-price {
            text-align: left;
            margin-top: 1rem;
          }

          .d-flex.align-items-center.gap-3 {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem !important;
          }

          .cancel-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
