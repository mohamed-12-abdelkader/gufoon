import { useState } from "react";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";

const useUserSignup = () => {
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // افتراضياً نوع المستخدم عادي

  const mailChange = (e) => {
    setMail(e.target.value);
  };

  const passChange = (e) => {
    setPass(e.target.value);
  };
  const fnameChange = (e) => {
    setfName(e.target.value);
  };
  const lNameChange = (e) => {
    setlName(e.target.value);
  };
  const phoneChange = (e) => {
    setPhone(e.target.value);
  };
  const addressChange = (e) => {
    setAddress(e.target.value);
  };
  const cityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول إلى الخادم
      const response = await baseUrl.post(`api/user/signup`, {
        mail,
        pass,
        fName,
        lName,
        phone,
        address,
        city,
      });

      // التحقق من الاستجابة
      if (response.status === 200) {
        // تسجيل الدخول ناجح
        const data = response.data;

        // حفظ الرمز المميز وبيانات المستخدم في localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.Date || data.data));

        // عرض رسالة نجاح
        toast.success("تم انشاء الحساب بنجاح");

        // إعادة التوجيه بعد تسجيل الدخول الناجح
        console.log(data);
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
      setPass("");
    }
  };

  return [
    handleSignup,
    passChange,
    mail,
    mailChange,
    fName,
    fnameChange,
    lName,
    lNameChange,
    phone,
    phoneChange,
    address,
    addressChange,
    city,
    cityChange,
    pass,
    userType,
    setUserType,
    loading,
  ];
};

export default useUserSignup;
