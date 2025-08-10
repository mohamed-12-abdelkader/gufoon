import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
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
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [skip, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusQuery = statusFilter ? `&status=${statusFilter}` : "";
      const { data } = await axios.get(
        `/orders?limit=${limit}&skip=${skip}${statusQuery}`
      );
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      toast.error("فشل تحديث حالة الطلب");
    } finally {
      setUpdatingOrderId(null);
    }
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

      <div className="my-3" dir="rtl">
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
              className="w-[90%] m-auto border shadow my-2 p-3 flex justify-between items-center"
            >
              <Link to={`/order/${order.id}`} className="flex-grow">
                <div>
                  <h6>اسم العميل: {order.user?.fullName || "غير متوفر"}</h6>
                  <h6>
                    تاريخ الطلب:{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </h6>
                  <h6 className="text-sm text-gray-500">
                    📦 الحالة: {STATUS_MAP[order.status] || "غير معروف"}
                  </h6>
                </div>
              </Link>

              <div className="ml-3 flex items-center">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  disabled={updatingOrderId === order.id}
                  className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium"
                >
                  {Object.entries(STATUS_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {updatingOrderId === order.id && (
                  <Spinner size="sm" className="ml-2" />
                )}
              </div>
            </div>
          ))}

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
    </div>
  );
};

export default AllOrder;
