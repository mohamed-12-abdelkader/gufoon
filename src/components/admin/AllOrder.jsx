import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

const limit = 20;

const STATUS_MAP = {
  Pending: "قيد الانتظار",
  Processing: "قيد المعالجة",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
};

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [skip, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusQuery = statusFilter ? `&status=${statusFilter}` : "";
      const { data } = await axios.get(`/orders?limit=${limit}&skip=${skip}${statusQuery}`);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (id) => {
    setConfirming(true);
    try {
      await axios.put(`/orders/${id}`, { status: "Delivered" });
      toast.success("تم تأكيد الطلب بنجاح");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: "Delivered" } : order
        )
      );
    } catch (error) {
      toast.error("فشل تأكيد الطلب");
    } finally {
      setConfirming(false);
      setShowModal(false);
    }
  };

  const handleShowModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedOrderId) confirmOrder(selectedOrderId);
  };

  const handleNextPage = () => {
    if (skip + limit < totalPages * limit) setSkip(skip + limit);
  };

  const handlePrevPage = () => {
    if (skip > 0) setSkip(skip - limit);
  };

  if (loading) return <h3>جارٍ تحميل الطلبات ...</h3>;

  return (
    <div className="mt-4">
      <div className="text-center my-3">
        <h4 className="font-bold">كل الطلبات</h4>
      </div>

      {/* ✅ Order Status Filter */}
      <div className="my-3" dir='rtl'>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">جميع الحالات</option>
          {Object.entries(STATUS_MAP).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <div
              key={order.id}
              className="w-[90%] m-auto border shadow my-2 p-3 flex justify-between"
            >
              <Link to={`/order/${order.id}`} className="flex-grow">
                <div>
                  <h6>اسم العميل: {order.user?.fullName || "غير متوفر"}</h6>
                  <h6>تاريخ الطلب: {new Date(order.orderDate).toLocaleDateString()}</h6>
                  <h6 className="text-sm text-gray-500">
                    📦 الحالة: {STATUS_MAP[order.status] || "غير معروف"}
                  </h6>
                </div>
              </Link>
              <button
                onClick={() => handleShowModal(order.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={confirming || order.status === "Delivered"}
              >
                {confirming && selectedOrderId === order.id
                  ? "جارٍ التأكيد ..."
                  : order.status === "Delivered"
                    ? "تم التأكيد"
                    : "تأكيد الطلب"}
              </button>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-gray-300 px-4 py-2 mx-2 rounded disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={skip === 0}
            >
              السابق
            </button>
            <span>
              صفحة {Math.floor(skip / limit) + 1} من {totalPages}
            </span>
            <button
              className="bg-gray-300 px-4 py-2 mx-2 rounded disabled:opacity-50"
              onClick={handleNextPage}
              disabled={skip + limit >= totalPages * limit}
            >
              التالي
            </button>
          </div>
        </>
      ) : (
        <h4>لا يوجد طلبات حالياً ...</h4>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>هل أنت متأكد من أنك تريد تأكيد هذا الطلب؟</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={confirming}>
            {confirming ? <Spinner size="sm" /> : "تأكيد الطلب"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllOrder;
