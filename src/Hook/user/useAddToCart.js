import React, { useState } from "react";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const useAddToCart = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const handleaddToCart = async (product_id, type_id) => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/basket/add",
        { product_id, type_id },
        {
          headers: { token: token },
        }
      );

      toast.success("تم إضافة المنتج للسلة");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };
  return { handleaddToCart, loading };
};

export default useAddToCart;
