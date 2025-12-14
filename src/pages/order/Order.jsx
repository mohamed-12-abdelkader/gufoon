import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await baseUrl.get(`api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(data);
      } catch (error) {
        toast.error("تعذر تحميل الطلب. تأكد من أنك مسجل الدخول أو أن الطلب موجود.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      Processing: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
      Completed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700",
      Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
      Pending: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      Shipped: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
    };
    return statusColors[status] || "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      paid: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      failed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    };
    return statusColors[status] || "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-400">جارِ التحميل...</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">الطلب غير موجود</h1>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">تفاصيل الطلب</h1>
              <p className="text-gray-600 dark:text-gray-400">رقم الطلب: #{order.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-lg font-semibold border-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                معلومات الطلب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📅 تاريخ الطلب</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(order.orderDate)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💰 إجمالي المبلغ</p>
                  <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">{order.totalAmount?.toFixed(2) || 0} ر.س</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📍 عنوان الشحن</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.shippingAddress || "غير متوفر"}</p>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                معلومات العميل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">الاسم الكامل</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.user?.fullName || "غير متوفر"}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📧 البريد الإلكتروني</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.user?.email || "غير متوفر"}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📞 رقم الهاتف</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.user?.phoneNumber || "غير متوفر"}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">🏙️ المدينة</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.user?.city || "غير متوفر"}</p>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                المنتجات المطلوبة
              </h2>
              <div className="space-y-4">
                {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-xl transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.product?.cover || "/images/placeholder.png"}
                            alt={item.product?.name}
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.src = "/images/placeholder.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{item.product?.name || "منتج غير معروف"}</h3>
                          {item.product?.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.product.description}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">🔢 الكمية</p>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">{item.quantity}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">💰 سعر الوحدة</p>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">{item.price?.toFixed(2) || 0} ر.س</p>
                            </div>
                            {item.product?.discount && (
                              <div className="bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">🎁 الخصم</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">{item.product.discount}%</p>
                              </div>
                            )}
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">📦 الإجمالي</p>
                              <p className="font-bold text-blue-700 dark:text-blue-300">{(item.price * item.quantity)?.toFixed(2) || 0} ر.س</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">❌ لا توجد منتجات في هذا الطلب</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Info */}
          <div className="space-y-6">
            {/* Payment Info Card */}
            {order.payment && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💳</span>
                  معلومات الدفع
                </h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">حالة الدفع</p>
                    <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${getPaymentStatusColor(order.payment.status)}`}>
                      {order.payment.status === "paid" ? "✅ مدفوع" : order.payment.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💳 طريقة الدفع</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{order.payment.paymentMethod || "غير متوفر"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💰 المبلغ المدفوع</p>
                    <p className="font-bold text-xl text-gray-800 dark:text-gray-200">{order.payment.amount?.toFixed(2) || 0} {order.payment.currency || "ر.س"}</p>
                  </div>
                  {order.payment.transactionId && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">🔢 رقم المعاملة</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 font-mono text-sm">{order.payment.transactionId}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-3 rounded-lg text-center ${order.payment.isPaid ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                      <p className="text-xs mb-1">مدفوع</p>
                      <p className="font-bold">{order.payment.isPaid ? "✅" : "❌"}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${order.payment.isCashOnDelivery ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                      <p className="text-xs mb-1">الدفع عند الاستلام</p>
                      <p className="font-bold">{order.payment.isCashOnDelivery ? "✅" : "❌"}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${order.payment.isCardPayment ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                      <p className="text-xs mb-1">دفع بالبطاقة</p>
                      <p className="font-bold">{order.payment.isCardPayment ? "✅" : "❌"}</p>
                    </div>
                  </div>
                  {order.payment.createdAt && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">📅 تاريخ الدفع</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatDate(order.payment.createdAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Payments History */}
            {order.allPayments && order.allPayments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  سجل المدفوعات
                </h2>
                <div className="space-y-3">
                  {order.allPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{payment.amount?.toFixed(2) || 0} {payment.currency || "ر.س"}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">طريقة الدفع: {payment.paymentMethod}</p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">معاملة: {payment.transactionId}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{formatDate(payment.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
