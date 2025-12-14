import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Button,
  ButtonGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaBan,
  FaCreditCard,
  FaMoneyBillWave,
  FaUser,
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
  FaEye,
  FaCalendarAlt,
  FaDollarSign,
  FaSearch,
  FaSort,
} from "react-icons/fa";
import baseUrl from "../../api/baseUrl";

const limit = 20;

const STATUS_MAP = {
  Pending: "قيد الانتظار",
  Processing: "قيد المعالجة",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
};

const STATUS_COLORS = {
  Pending: "#FFA726",
  Processing: "#42A5F5",
  Shipped: "#66BB6A",
  Delivered: "#26A69A",
  Cancelled: "#EF5350",
};

const STATUS_ICONS = {
  Pending: FaBox,
  Processing: FaCheckCircle,
  Shipped: FaTruck,
  Delivered: FaCheckCircle,
  Cancelled: FaBan,
};

const PAYMENT_METHOD_MAP = {
  paymob: "الفيزا",
  cash_on_delivery: "عند الاستلام",
};

const PAYMENT_STATUS_MAP = {
  paid: "مدفوع",
  pending: "في الانتظار",
  failed: "فشل",
};

const PAYMENT_STATUS_COLORS = {
  paid: "#26A69A",
  pending: "#FFA726",
  failed: "#EF5350",
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
      const token = localStorage.getItem("token");
      const statusQuery = statusFilter ? `&status=${statusFilter}` : "";
      const { data } = await baseUrl.get(
        `api/orders?limit=${limit}&skip=${skip}${statusQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("فشل في تحميل الطلبات");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem("token");
      await baseUrl.put(
        `api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      console.error("Error updating order:", error);
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

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner-wrapper">
          <Spinner animation="border" variant="primary" className="loading-spinner" />
          <p className="loading-text">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">

  {/* Header */}
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl">
          <FaBox />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h1>
          <p className="text-sm text-gray-500">عرض وإدارة جميع طلبات العملاء</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl">
          <FaBox className="text-blue-500" />
          <div>
            <div className="text-lg font-bold text-blue-600">{orders.length}</div>
            <div className="text-xs text-gray-500">إجمالي الطلبات</div>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setSkip(0);
          }}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">جميع الحالات</option>
          {Object.entries(STATUS_MAP).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

    </div>
  </div>

  {/* Orders */}
  {orders.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {orders.map(order => {
        const StatusIcon = STATUS_ICONS[order.status] || FaBox;
        const payment = order.payment || {};
        const statusColor = STATUS_COLORS[order.status] || "#9E9E9E";

        return (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">

            {/* Card Header */}
            <div
              className="p-4 border-t-4"
              style={{ borderColor: statusColor }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800">#{order.id}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt />
                    {formatDate(order.orderDate)}
                  </div>
                </div>

                <span
                  className="flex items-center gap-1 text-xs text-white px-3 py-1 rounded-full"
                  style={{ backgroundColor: statusColor }}
                >
                  <StatusIcon />
                  {STATUS_MAP[order.status]}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                  <FaUser />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {order.user?.fullName || "غير متوفر"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm text-gray-500">المبلغ الإجمالي</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(order.totalAmount)} ر.س
                </span>
              </div>

              {/* Payment */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">طريقة الدفع</span>
                  <span className="font-medium">
                    {PAYMENT_METHOD_MAP[payment.paymentMethod] || "غير محدد"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">حالة الدفع</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs text-white"
                    style={{
                      backgroundColor: PAYMENT_STATUS_COLORS[payment.status] || "#9E9E9E"
                    }}
                  >
                    {PAYMENT_STATUS_MAP[payment.status] || "غير محدد"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  disabled={updatingOrderId === order.id}
                  className="flex-1 border rounded-xl px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(STATUS_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                <Link
                  to={`/order/${order.id}`}
                  className="px-4 py-2 text-sm rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition flex items-center gap-1"
                >
                  <FaEye />
                  التفاصيل
                </Link>
              </div>

            </div>
          </div>
        );
      })}

    </div>
  ) : (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
      <FaBox className="mx-auto text-4xl text-gray-300 mb-4" />
      <h3 className="font-bold text-gray-700">لا توجد طلبات</h3>
      <p className="text-sm text-gray-500 mt-1">
        {statusFilter ? "لا توجد طلبات بهذه الحالة" : "لا يوجد طلبات حالياً"}
      </p>
    </div>
  )}
</div>

  );
};

export default AllOrder;
