import { useState } from "react";

import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import axios from "axios";

const LoginAdmin = () => {
  const [user_name, setuser_name] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // افتراضياً نوع المستخدم عادي

  const mailChange = (e) => {
    setuser_name(e.target.value);
  };

  const passChange = (e) => {
    setPass(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول إلى الخادم
      const response = await baseUrl.post(`api/admin/login`, {
        user_name,
        pass,
      });

      // التحقق من الاستجابة
      if (response.status === 200) {
        // تسجيل الدخول ناجح
        const data = response.data;

        // حفظ الرمز المميز وبيانات المستخدم في localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.Data || data.data));

        // عرض رسالة نجاح
        toast.success("تم تسجيل الدخول بنجاح");

        // إعادة التوجيه بعد تسجيل الدخول الناجح
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
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
      setuser_name("");
      setPass("");
    }
  };

  return [
    handleLogin,
    passChange,
    mailChange,
    user_name,
    pass,
    userType,
    setUserType,
    loading,
  ];
};

export default LoginAdmin;
