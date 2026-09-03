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
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import baseUrl from "../../api/baseUrl";

const limit = 20;

const STATUS_MAP = {
  Pending: "قيد الانتظار",
  AwaitingWhatsAppConfirm: "بانتظار واتساب",
  Processing: "قيد المعالجة",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
};

const STATUS_COLORS = {
  Pending: "#FFA726",
  AwaitingWhatsAppConfirm: "#25D366",
  Processing: "#42A5F5",
  Shipped: "#66BB6A",
  Delivered: "#26A69A",
  Cancelled: "#EF5350",
};

const STATUS_ICONS = {
  Pending: FaClock,
  AwaitingWhatsAppConfirm: FaWhatsapp,
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
      <div className="admin-orders" dir="rtl">
        <div className="admin-orders-state">
          <Spinner animation="border" className="admin-orders-spinner" />
          <p>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  const customerName = (order) =>
    order.user?.fullName || order.guestName || "ضيف";
  const customerContact = (order) =>
    order.user?.email || order.user?.phoneNumber || order.guestPhone || "";

  return (
    <div dir="rtl" className="admin-orders">
      <div className="admin-orders-head">
        <div className="admin-orders-title-row">
          <div className="admin-orders-icon">
            <FaBox />
          </div>
          <div>
            <h1>إدارة الطلبات</h1>
            <p>عرض وإدارة جميع طلبات العملاء والضيوف</p>
          </div>
        </div>

        <div className="admin-orders-tools">
          <div className="admin-orders-count">
            <FaBox />
            <div>
              <strong>{orders.length}</strong>
              <span>في هذه الصفحة</span>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">جميع الحالات</option>
            {Object.entries(STATUS_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="admin-orders-grid">
          {orders.map((order) => {
            const StatusIcon = STATUS_ICONS[order.status] || FaBox;
            const payment = order.payment || {};
            const statusColor = STATUS_COLORS[order.status] || "#9E9E9E";
            const isGuest = !order.userId && (order.guestName || order.guestPhone);

            return (
              <article key={order.id} className="admin-order-card">
                <header style={{ borderColor: statusColor }}>
                  <div>
                    <div className="admin-order-id">#{order.id}</div>
                    <div className="admin-order-date">
                      <FaCalendarAlt />
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                  <span className="admin-order-status" style={{ backgroundColor: statusColor }}>
                    <StatusIcon />
                    {STATUS_MAP[order.status]}
                  </span>
                </header>

                <div className="admin-order-body">
                  <div className="admin-order-user">
                    <div className="admin-order-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <div className="admin-order-name">
                        {customerName(order)}
                        {isGuest && <em>ضيف</em>}
                      </div>
                      <div className="admin-order-contact">{customerContact(order) || "بدون بيانات تواصل"}</div>
                    </div>
                  </div>

                  <div className="admin-order-amount">
                    <span>المبلغ الإجمالي</span>
                    <strong>{formatCurrency(order.totalAmount)} ر.س</strong>
                  </div>

                  <div className="admin-order-meta">
                    <div>
                      <span>طريقة الدفع</span>
                      <b>{PAYMENT_METHOD_MAP[payment.paymentMethod] || "غير محدد"}</b>
                    </div>
                    <div>
                      <span>حالة الدفع</span>
                      <b style={{ color: PAYMENT_STATUS_COLORS[payment.status] || "#d4af77" }}>
                        {PAYMENT_STATUS_MAP[payment.status] || "غير محدد"}
                      </b>
                    </div>
                  </div>

                  <div className="admin-order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrderId === order.id}
                    >
                      {Object.entries(STATUS_MAP).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <Link to={`/order/${order.id}`}>
                      <FaEye />
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-orders-empty">
          <FaBox />
          <h3>لا توجد طلبات</h3>
          <p>{statusFilter ? "لا توجد طلبات بهذه الحالة" : "لا يوجد طلبات حالياً"}</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-orders-pager">
          <button type="button" onClick={handlePrevPage} disabled={skip === 0}>
            <FaChevronRight /> السابق
          </button>
          <span>صفحة {Math.floor(skip / limit) + 1} من {totalPages}</span>
          <button type="button" onClick={handleNextPage} disabled={skip + limit >= totalPages * limit}>
            التالي <FaChevronLeft />
          </button>
        </div>
      )}

      <style>{`
        .admin-orders {
          color: var(--text-primary);
        }
        .admin-orders-state,
        .admin-orders-empty {
          min-height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          text-align: center;
        }
        .admin-orders-spinner {
          color: var(--accent) !important;
        }
        .admin-orders-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 1.1rem 1.2rem;
          margin-bottom: 1.1rem;
        }
        .admin-orders-title-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .admin-orders-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #006C35;
          color: #f4ead8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .admin-orders-head h1 {
          margin: 0 !important;
          font-size: 1.35rem !important;
          color: var(--text-primary) !important;
        }
        .admin-orders-head p {
          margin: 0 !important;
          color: var(--text-secondary) !important;
          font-size: 0.85rem;
        }
        .admin-orders-tools {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .admin-orders-count {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: rgba(0, 108, 53, 0.16);
          color: var(--accent);
          padding: 0.45rem 0.8rem;
          border-radius: 12px;
        }
        .admin-orders-count strong {
          display: block;
          color: var(--gold, #d4af77) !important;
          font-size: 1.05rem;
        }
        .admin-orders-count span {
          color: var(--text-secondary) !important;
          font-size: 0.72rem;
        }
        .admin-orders-tools select,
        .admin-order-actions select {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.45rem 0.75rem;
        }
        .admin-orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .admin-order-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          overflow: hidden;
        }
        .admin-order-card header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1rem;
          border-top: 4px solid #006C35;
        }
        .admin-order-id {
          font-weight: 800;
          color: var(--text-primary) !important;
        }
        .admin-order-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary) !important;
          font-size: 0.75rem;
        }
        .admin-order-status {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #fff !important;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
        }
        .admin-order-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .admin-order-user {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .admin-order-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 108, 53, 0.18);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-order-name {
          font-weight: 700;
          color: var(--text-primary) !important;
        }
        .admin-order-name em {
          margin-inline-start: 0.4rem;
          font-style: normal;
          font-size: 0.7rem;
          color: var(--gold, #d4af77) !important;
          border: 1px solid rgba(212, 175, 119, 0.4);
          padding: 0.05rem 0.4rem;
          border-radius: 999px;
        }
        .admin-order-contact {
          font-size: 0.78rem;
          color: var(--text-secondary) !important;
        }
        .admin-order-amount {
          display: flex;
          justify-content: space-between;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 0.7rem 0.85rem;
        }
        .admin-order-amount span {
          color: var(--text-secondary) !important;
        }
        .admin-order-amount strong {
          color: var(--gold, #d4af77) !important;
        }
        .admin-order-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.85rem;
        }
        .admin-order-meta div {
          display: flex;
          justify-content: space-between;
        }
        .admin-order-meta span {
          color: var(--text-secondary) !important;
        }
        .admin-order-meta b {
          color: var(--text-primary) !important;
        }
        .admin-order-actions {
          display: flex;
          gap: 0.5rem;
        }
        .admin-order-actions select {
          flex: 1;
        }
        .admin-order-actions a {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #006C35;
          color: #f4ead8 !important;
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .admin-orders-empty {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 2.5rem 1rem;
        }
        .admin-orders-empty svg {
          font-size: 2rem;
          color: var(--accent);
        }
        .admin-orders-pager {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1.2rem;
        }
        .admin-orders-pager button {
          background: #006C35;
          color: #f4ead8;
          border: none;
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .admin-orders-pager button:disabled {
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
};

export default AllOrder;
