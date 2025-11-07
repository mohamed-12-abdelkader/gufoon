import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
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

  if (loading) {
    return <h1 className="text-center text-blue-600 my-5">جارِ التحميل...</h1>;
  }

  if (!order) {
    return <h1 className="text-center text-red-600 my-5">❌ الطلب غير موجود</h1>;
  }

  return (
    <div dir="rtl" className="mt-[150px] min-h-[80vh] w-[90%] m-auto">
      <div className="border shadow-lg p-5 rounded-md bg-white my-[50px]">
        <h4 className="text-center font-bold text-lg mb-4 text-gray-800">
          تفاصيل الطلب
        </h4>

        <div className="border-b pb-4 mb-4">
          <h6>👤 اسم العميل: {order.user?.fullName || "غير متوفر"}</h6>
          <h6>📞 رقم الهاتف: {order.user?.phoneNumber || "غير متوفر"}</h6>
          <h6>🏙️ المدينة: {order.user?.city || "غير متوفر"}</h6>
          <h6>📍 العنوان: {order.shippingAddress}</h6>
          <h6>📅 تاريخ الطلب: {new Date(order.orderDate).toLocaleDateString()}</h6>
          <h5 className="text-lg font-bold text-blue-600">
            💰 إجمالي الطلب: {order.totalAmount.toFixed(2)} ر.س
          </h5>
        </div>

        <h5 className="text-center text-xl font-bold my-4 text-gray-700">
          🛍️ المنتجات المطلوبة
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {order.orderDetails.length > 0 ? (
            order.orderDetails.map((ord, index) => (
              <Card key={index} className="shadow-md rounded-md overflow-hidden">
                <Card.Img
                  variant="top"
                  src={ord.product?.cover || "/images/placeholder.png"}
                  className="h-[200px] object-cover"
                />
                <Card.Body className="p-3">
                  <h6 className="font-bold text-gray-800">{ord.product?.name}</h6>
                  <p className="text-sm text-gray-600">🏷️ الماركة: {ord.product?.brand?.name || "غير متوفر"}</p>
                  <p className="text-sm text-gray-600">🎨 اللون: {ord.product?.color?.name || "غير متوفر"}</p>
                  <p className="text-sm text-gray-600">
                    🔢 الكمية: {ord.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    💰 سعر الوحدة: {ord.price.toFixed(2)} ر.س
                  </p>
                  <p className="text-sm text-gray-700 font-bold">
                    📦 إجمالي السعر: {(ord.price * ord.quantity).toFixed(2)} ر.س
                  </p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <h6 className="text-center col-span-3 text-gray-600">
              ❌ لا توجد منتجات
            </h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
