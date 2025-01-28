import React, { useState } from "react";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
const SendOrder = () => {
  const token = localStorage.getItem("token");

  const [address, setaddress] = useState("");

  const [loading, setLoading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول إلى الخادم
      const response = await baseUrl.post(
        `/api/order/create`,
        {
          address: address,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      // التحقق من الاستجابة
      if (response.status === 200) {
        // عرض رسالة نجاح
        toast.success("تم  ارسال الطلب بنجاح");
      } else {
        // عرض رسالة خطأ إذا كانت الاستجابة غير صحيحة
        toast.error("بيانات المستخدم غير صحيحة");
      }
    } catch (error) {
      // عرض رسالة خطأ عند وجود مشكلة في الشبكة أو غيرها
      console.error(error);
      toast.error("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      // إعادة ضبط حالة التحميل وإدخالات النموذج
      setLoading(false);
    }
  };
  return [setaddress, address, handleSubmit, loading];
};

export default SendOrder;
