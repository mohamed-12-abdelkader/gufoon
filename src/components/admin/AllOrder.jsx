import React, { useState } from "react";
import GitAllOrder from "../../Hook/admin/GitAllOrder";
import { Link } from "react-router-dom";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";
import { Button, Modal, Spinner } from "react-bootstrap";

const AllOrder = () => {
  const [loadingOrder, orders] = GitAllOrder();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const confirmOrder = async (id) => {
    try {
      setLoading(true);
      await baseUrl.put(
        `api/order/confirm/${id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      toast.success("تم تاكيد الطلب");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("فشل تاكيد الطلب");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleShowModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedOrderId) {
      confirmOrder(selectedOrderId);
    }
  };

  if (loadingOrder) {
    return <h3>جار تحميل الطلبات ......</h3>;
  }
  return (
    <div className='mt-[40px]'>
      <div className='text-center my-3'>
        <h4 className='font-bold'>كل الطلبات </h4>
      </div>
      {orders && orders.orders.length > 0 ? (
        orders.orders.map((order) => (
          <div
            key={order.order_id}
            className='w-[90%] m-auto border shadow my-2 p-3 flex justify-between'
          >
            <Link to={`/order/${order.order_id}`} className='flex-grow'>
              <div>
                <h6>
                  اسم العميل :{" "}
                  {order.full_name ? order.full_name : "mohamed ahmed"}
                </h6>
                <h6>تاريخ الاوردر : {order.created_at}</h6>
              </div>
            </Link>
            <button
              onClick={() => handleShowModal(order.id)}
              className='bg-blue-500 text-white px-4 py-2 rounded'
              disabled={loading}
            >
              {loading ? "جار التاكيد..." : "تاكيد الاوردر"}
            </button>
          </div>
        ))
      ) : (
        <h4>لا يوجد طلبات الان ...</h4>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>هل أنت متأكد من أنك تريد تأكيد هذا الطلب؟</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant='primary' onClick={handleConfirm}>
            {loading ? <Spinner /> : "تاكيد الاوردر"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllOrder;
