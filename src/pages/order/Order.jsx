import React from "react";
import { useParams } from "react-router-dom";
import GitOrderDetails from "../../Hook/admin/GitOrderDetails";
import { Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const Order = () => {
  const { id } = useParams();
  const [loadingorder, order] = GitOrderDetails({ id: id });

  if (loadingorder) {
    return <h1 className='text-center text-blue-600 my-5'>جارِ التحميل...</h1>;
  }

  return (
    <div dir='rtl' className='mt-[150px] min-h-[80vh] w-[90%] m-auto'>
      <div className='border shadow-lg p-5 rounded-md bg-white my-[50px]'>
        <h4 className='text-center font-bold text-lg mb-4 text-gray-800'>
          تفاصيل الطلب
        </h4>

        {/* معلومات العميل */}
        <div className='border-b pb-4 mb-4'>
          <h6>👤 اسم العميل: أحمد محمد</h6>
          <h6>📞 رقم الهاتف: 0123456789</h6>
          <h6>🏙️ المدينة: القاهرة</h6>
          <h6>📍 العنوان: شارع الثورة، مصر الجديدة</h6>
          <h6>📅 تاريخ الطلب: 2025-01-01</h6>
        </div>

        {/* المنتجات المطلوبة */}
        <h5 className='text-center text-xl font-bold my-4 text-gray-700'>
          🛍️ المنتجات المطلوبة
        </h5>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
          {order.orderDetails.length > 0 ? (
            order.orderDetails.map((ord, index) => (
              <Card
                key={index}
                className='shadow-md rounded-md overflow-hidden'
              >
                <Card.Img
                  variant='top'
                  src={ord.image || "/images/placeholder.png"} // استخدم صورة المنتج الفعلية إن وُجدت
                  className='h-[200px] object-cover'
                />
                <Card.Body className='p-3'>
                  <h6 className='font-bold text-gray-800'>
                    {ord.product_name}
                  </h6>
                  <p className='text-sm text-gray-600'>👓 النوع: {ord.type}</p>
                  <p className='text-sm text-gray-600'>
                    🏷️ الماركة: {ord.brand_name}
                  </p>
                  <p className='text-sm text-gray-600'>
                    🎨 لون الإطار: {ord.frame_color}
                  </p>
                  <p className='text-sm text-gray-600'>
                    🛑 المادة: {ord.frame_material}
                  </p>
                  <p className='text-sm text-gray-600'>🔍 حجم: {ord.size}</p>
                  <p className='text-sm text-gray-600'>
                    🎭 لون العدسات: {ord.lenses_color}
                  </p>
                  <div className='flex justify-between items-center mt-3'>
                    <div className='text-right'>
                      <span className='font-bold text-blue-600'>
                        {ord.price} ر.س
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <h6 className='text-center col-span-3 text-gray-600'>
              ❌ لا توجد منتجات
            </h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
