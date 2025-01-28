import React, { useState } from "react";
import GitOrderConfirm from "../../Hook/admin/GitOrderConfirm";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import { Button, Modal } from "react-bootstrap";

const OrderConfirm = () => {
  const [loadingOrder, orders] = GitOrderConfirm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const token = localStorage.getItem("token");

  const deliveryOrder = async (id) => {
    try {
      setLoading(true);
      await baseUrl.put(
        `api/order/delivery/${id}`,
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
      console.log(error);
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
      deliveryOrder(selectedOrderId);
    }
  };

  if (loadingOrder) {
    return <h4>loading......</h4>;
  }

  return (
    <div>
      {orders ? (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="w-[90%] m-auto my-3 border shadow p-3 md:flex justify-between"
            >
              <div>
                <h6 className="my-2">اسم العميل : {order.full_name}</h6>
                <h6 className="my-2">تاريخ الطلب : {order.day}</h6>
              </div>
              <div>
                <button
                  onClick={() => handleShowModal(order.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  تم تسليم الاوردر
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h4>لا يوجد طلبات مؤكدة.....</h4>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد التسليم</Modal.Title>
        </Modal.Header>
        <Modal.Body>هل أنت متأكد من أنك تريد تأكيد تسليم هذا الطلب؟</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            نعم، تم التسليم
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderConfirm;
