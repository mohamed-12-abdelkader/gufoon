import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  ButtonGroup,
  Modal,
  Card,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFilter, FaExclamationTriangle, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import EditCouponModal from "../modal/EditCouponModal";
import baseUrl from "../../api/baseUrl";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, expired
  const [count, setCount] = useState(0);

  const fetchCoupons = async (filterType = filter) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      
      if (filterType === "active") {
        params.active = true;
      } else if (filterType === "expired") {
        params.expired = true;
      }

      const res = await baseUrl.get("api/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      // Handle new API response structure
      const data = res.data;
      if (data && data.coupons) {
        setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
        setCount(data.count || 0);
      } else if (Array.isArray(data)) {
        // Fallback for old structure
        setCoupons(data);
        setCount(data.length);
      } else {
        setCoupons([]);
        setCount(0);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      toast.error("فشل تحميل الكوبونات");
      setCoupons([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    fetchCoupons(filter);
  }, [filter]);

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await baseUrl.delete(`api/coupons/${couponToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`تم حذف الكوبون "${couponToDelete.code}" بنجاح`);
      setDeleteModalOpen(false);
      setCouponToDelete(null);
      fetchCoupons(filter);
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("خطأ أثناء حذف الكوبون");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const isCouponExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const isCouponActive = (expiryDate) => {
    return new Date(expiryDate) >= new Date();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="coupons-page" dir="rtl">
      <Container className="py-4">
        <Card className="coupons-header-card mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <div className="header-title-section">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="icon-wrapper">
                    <FaTag />
                  </div>
                  <div>
                    <h2 className="page-title mb-1">إدارة الكوبونات</h2>
                    <p className="text-muted mb-0">
                      إجمالي الكوبونات: <Badge bg="primary" className="count-badge">{count}</Badge>
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setEditingCoupon(null);
                  setIsModalOpen(true);
                }}
                className="add-coupon-btn"
              >
                <FaPlus className="me-2" />
                كوبون جديد
              </Button>
            </div>

            {/* Filter Buttons */}
            <div className="filter-section">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaFilter className="text-muted" />
                <span className="filter-label">تصفية:</span>
              </div>
              <ButtonGroup className="filter-buttons">
                <Button
                  variant={filter === "all" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("all")}
                  className="filter-btn"
                >
                  الكل
                </Button>
                <Button
                  variant={filter === "active" ? "success" : "outline-success"}
                  onClick={() => setFilter("active")}
                  className="filter-btn"
                >
                  نشط
                </Button>
                <Button
                  variant={filter === "expired" ? "danger" : "outline-danger"}
                  onClick={() => setFilter("expired")}
                  className="filter-btn"
                >
                  منتهي
                </Button>
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>

        {loading ? (
          <Card className="loading-card">
            <Card.Body className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">جاري تحميل الكوبونات...</p>
            </Card.Body>
          </Card>
        ) : coupons.length === 0 ? (
          <Card className="empty-state-card">
            <Card.Body className="text-center py-5">
              <div className="empty-icon mb-3">
                <FaTag />
              </div>
              <h5>لا توجد كوبونات</h5>
              <p className="text-muted">ابدأ بإضافة كوبون جديد</p>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => {
                  setEditingCoupon(null);
                  setIsModalOpen(true);
                }}
              >
                <FaPlus className="me-2" />
                إضافة كوبون جديد
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="coupons-table mb-0" striped={false}>
                  <thead>
                    <tr>
                      <th>
                        <div className="th-content">
                          <FaTag className="th-icon" />
                          <span>رمز الكوبون</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>نسبة الخصم</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>الحد الأقصى</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>تاريخ الانتهاء</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>الحالة</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>عدد الاستخدامات</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>تاريخ الإنشاء</span>
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span>الإجراءات</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => {
                      const expired = isCouponExpired(coupon.expiryDate);
                      const active = isCouponActive(coupon.expiryDate);
                      const usageCount = coupon._count?.appliedCoupons || 0;
                      const daysUntilExpiry = Math.ceil(
                        (new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <tr key={coupon.id} className="coupon-row">
                          <td>
                            <div className="coupon-code-wrapper">
                              <div className="code-icon-container">
                                <FaTag className="code-icon" />
                              </div>
                              <div className="code-info">
                                <strong className="coupon-code">{coupon.code}</strong>
                                <small className="code-id">ID: {coupon.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="discount-cell">
                              <Badge bg="success" className="discount-badge">
                                <span className="discount-value">{coupon.discountPercentage}%</span>
                              </Badge>
                              <small className="discount-label">خصم</small>
                            </div>
                          </td>
                          <td>
                            <div className="max-discount-cell">
                              {coupon.maxDiscountAmount ? (
                                <>
                                  <span className="max-discount-value">
                                    {coupon.maxDiscountAmount.toFixed(2)} ر.س
                                  </span>
                                  <small className="max-discount-label">حد أقصى</small>
                                </>
                              ) : (
                                <span className="no-limit-badge">
                                  <Badge bg="secondary">بدون حد</Badge>
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <div className="date-value">{formatDate(coupon.expiryDate)}</div>
                              {!expired && (
                                <small className="date-remaining">
                                  {daysUntilExpiry > 0
                                    ? `متبقي ${daysUntilExpiry} يوم`
                                    : "ينتهي اليوم"}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="status-cell">
                              {expired ? (
                                <Badge bg="danger" className="status-badge expired">
                                  <span className="status-dot"></span>
                                  منتهي
                                </Badge>
                              ) : active ? (
                                <Badge bg="success" className="status-badge active">
                                  <span className="status-dot"></span>
                                  نشط
                                </Badge>
                              ) : (
                                <Badge bg="secondary" className="status-badge">
                                  <span className="status-dot"></span>
                                  غير معروف
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="usage-cell">
                              <Badge bg="info" className="usage-badge">
                                <span className="usage-value">{usageCount}</span>
                              </Badge>
                              <small className="usage-label">مرة</small>
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              {coupon.createdAt ? (
                                <>
                                  <div className="date-value">{formatDate(coupon.createdAt)}</div>
                                  <small className="date-created">
                                    {new Date(coupon.createdAt).toLocaleTimeString("ar-SA", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </small>
                                </>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => {
                                  setEditingCoupon(coupon);
                                  setIsModalOpen(true);
                                }}
                                title="تعديل الكوبون"
                                className="action-btn edit-btn"
                              >
                                <FaEdit className="action-icon" />
                                <span className="action-text">تعديل</span>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteClick(coupon)}
                                title="حذف الكوبون"
                                className="action-btn delete-btn"
                              >
                                <FaTrash className="action-icon" />
                                <span className="action-text">حذف</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton className="delete-modal-header">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            تأكيد الحذف
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="delete-confirmation-content">
            <div className="warning-icon mb-3">
              <FaExclamationTriangle />
            </div>
            <p className="mb-2">
              هل أنت متأكد من حذف الكوبون <strong>"{couponToDelete?.code}"</strong>؟
            </p>
            {couponToDelete && (
              <div className="coupon-details-delete">
                <div className="detail-item">
                  <span className="detail-label">نسبة الخصم:</span>
                  <Badge bg="success">{couponToDelete.discountPercentage}%</Badge>
                </div>
                {couponToDelete.maxDiscountAmount && (
                  <div className="detail-item">
                    <span className="detail-label">الحد الأقصى:</span>
                    <span>{couponToDelete.maxDiscountAmount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">تاريخ الانتهاء:</span>
                  <span>{formatDate(couponToDelete.expiryDate)}</span>
                </div>
                {couponToDelete._count?.appliedCoupons > 0 && (
                  <Alert variant="warning" className="mt-2">
                    <strong>تحذير:</strong> تم استخدام هذا الكوبون{" "}
                    {couponToDelete._count.appliedCoupons} مرة
                  </Alert>
                )}
              </div>
            )}
            <p className="text-danger mt-3 mb-0">
              <small>لا يمكن التراجع عن هذا الإجراء</small>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel} disabled={deleteLoading}>
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                جاري الحذف...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                حذف
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <EditCouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
        }}
        coupon={editingCoupon}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
          fetchCoupons(filter);
        }}
      />

      <style jsx>{`
        .coupons-page {
          background: var(--bg-primary);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .coupons-header-card {
          background: var(--card-bg);
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow);
          transition: all 0.3s ease;
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0078FF 0%, #0056b3 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .page-title {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 2rem;
          margin: 0;
        }

        .count-badge {
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }

        .add-coupon-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 120, 255, 0.3);
          transition: all 0.3s ease;
        }

        .add-coupon-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 120, 255, 0.4);
        }

        .filter-section {
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .filter-label {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          border-radius: 8px;
          padding: 0.5rem 1.25rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          transform: translateY(-2px);
        }

        .table-card {
          background: var(--card-bg);
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow);
          overflow: hidden;
        }

        .coupons-table {
          margin: 0;
          background: transparent;
        }

        .coupons-table thead {
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--border-color);
        }

        .coupons-table thead th {
          color: var(--text-primary);
          font-weight: 700;
          border: none;
          border-bottom: 2px solid var(--border-color);
          padding: 1.25rem 1rem;
          text-align: right;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--bg-secondary);
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .th-icon {
          font-size: 1rem;
          opacity: 0.7;
        }

        .coupons-table tbody {
          background: var(--card-bg);
        }

        .coupon-row {
          transition: all 0.3s ease;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .coupon-row:nth-child(even) {
          background: var(--bg-secondary);
        }

        .coupon-row:hover {
          background-color: var(--bg-tertiary) !important;
          transform: translateX(-4px);
          box-shadow: 2px 0 8px var(--shadow);
        }

        .coupons-table tbody td {
          color: var(--text-primary);
          border-color: var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 1.25rem 1rem;
          vertical-align: middle;
          background: inherit;
        }

        .coupon-code-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .code-icon-container {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #0078FF 0%, #0056b3 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 120, 255, 0.3);
        }

        .code-icon {
          color: white;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .code-icon-container:hover .code-icon {
          transform: scale(1.1);
        }

        .code-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .coupon-code {
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
          font-size: 1.15rem;
          letter-spacing: 2px;
          font-weight: 700;
          margin: 0;
        }

        .code-id {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .discount-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .discount-badge {
          font-size: 1.1rem;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(40, 167, 69, 0.3);
        }

        .discount-value {
          font-size: 1.2rem;
        }

        .discount-label {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .max-discount-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .max-discount-value {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.05rem;
        }

        .max-discount-label {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .no-limit-badge {
          display: flex;
          align-items: center;
        }

        .date-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .date-value {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .date-remaining {
          color: #ff9800;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .date-created {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .status-cell {
          display: flex;
          align-items: center;
        }

        .status-badge {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .status-badge.active .status-dot {
          background: white;
        }

        .status-badge.expired .status-dot {
          background: white;
          animation: none;
        }

        .usage-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .usage-badge {
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 700;
        }

        .usage-value {
          font-size: 1.1rem;
        }

        .usage-label {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .action-btn {
          min-width: 90px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border-width: 2px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .action-icon {
          font-size: 0.9rem;
        }

        .action-text {
          font-size: 0.85rem;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
        }

        .action-btn:hover .action-icon {
          transform: scale(1.1);
        }

        .edit-btn:hover {
          background-color: #ffc107;
          border-color: #ffc107;
          color: white;
        }

        .delete-btn:hover {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        .loading-card,
        .empty-state-card {
          background: var(--card-bg);
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow);
        }

        .empty-icon {
          font-size: 4rem;
          color: var(--text-muted);
          opacity: 0.5;
        }

        /* Delete Modal Styles */
        .delete-modal-header {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          border-bottom: none;
        }

        .delete-modal-header .btn-close {
          filter: brightness(0) invert(1);
        }

        .delete-confirmation-content {
          text-align: center;
        }

        .warning-icon {
          font-size: 3rem;
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .coupon-details-delete {
          background: var(--bg-secondary);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: right;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Dark Mode Support */
        [data-theme="dark"] .coupons-header-card,
        [data-theme="dark"] .table-card,
        [data-theme="dark"] .loading-card,
        [data-theme="dark"] .empty-state-card {
          background: var(--card-bg);
          border-color: var(--border-color);
        }

        [data-theme="dark"] .coupons-table thead {
          background: var(--bg-tertiary);
          border-bottom-color: var(--border-color);
        }

        [data-theme="dark"] .coupons-table thead th {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-bottom-color: var(--border-color);
        }

        [data-theme="dark"] .coupons-table tbody {
          background: var(--card-bg);
        }

        [data-theme="dark"] .coupon-row {
          background: var(--card-bg);
          border-bottom-color: var(--border-color);
        }

        [data-theme="dark"] .coupon-row:nth-child(even) {
          background: var(--bg-secondary);
        }

        [data-theme="dark"] .coupon-row:hover {
          background-color: var(--bg-tertiary) !important;
        }

        [data-theme="dark"] .coupons-table tbody td {
          color: var(--text-primary);
          border-color: var(--border-color);
          background: inherit;
        }

        [data-theme="dark"] .coupon-details-delete {
          background: var(--bg-tertiary);
        }

        /* Light Mode Specific */
        [data-theme="light"] .coupons-table thead {
          background: #f8f9fa;
        }

        [data-theme="light"] .coupons-table thead th {
          background: #f8f9fa;
          color: #2c3e50;
        }

        [data-theme="light"] .coupon-row {
          background: #ffffff;
        }

        [data-theme="light"] .coupon-row:nth-child(even) {
          background: #f8f9fa;
        }

        [data-theme="light"] .coupon-row:hover {
          background-color: #e9ecef !important;
        }

        /* Enhanced Visual Feedback */
        .coupon-row {
          position: relative;
        }

        .coupon-row::before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: transparent;
          transition: background 0.3s ease;
        }

        .coupon-row:hover::before {
          background: linear-gradient(180deg, #0078FF 0%, #0056b3 100%);
        }

        .coupon-row:has(.status-badge.expired)::before {
          background: #dc3545;
        }

        .coupon-row:has(.status-badge.active)::before {
          background: #28a745;
        }

        /* Card-like appearance for each cell */
        .coupons-table tbody td {
          position: relative;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .coupons-page {
            padding: 1rem 0;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .coupons-table {
            font-size: 0.85rem;
          }

          .coupons-table thead th,
          .coupons-table tbody td {
            padding: 0.75rem 0.5rem;
          }

          .filter-buttons {
            flex-direction: column;
            width: 100%;
          }

          .filter-buttons .btn-group {
            width: 100%;
          }

          .filter-btn {
            flex: 1;
          }

          .action-buttons {
            flex-direction: column;
            gap: 0.25rem;
          }

          .action-btn {
            width: 100%;
            min-width: auto;
          }

          .action-text {
            display: none;
          }

          .code-icon-container {
            width: 35px;
            height: 35px;
          }

          .th-content {
            flex-direction: column;
            gap: 0.25rem;
          }
        }

        @media (max-width: 576px) {
          .coupon-code {
            font-size: 0.9rem;
            letter-spacing: 1px;
          }

          .icon-wrapper {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Coupons;
