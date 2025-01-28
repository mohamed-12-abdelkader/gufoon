import React, { useState } from "react";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const useDeleateProductFromCart = () => {
  const token = localStorage.getItem("token");

  const [deleatloading, setLoading] = useState(false);

  const handleDeleateFromToCart = async (product_id) => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    try {
      setLoading(true);

      const response = await baseUrl.delete(
        `api/basket/${product_id}`,

        {
          headers: { token: token },
        }
      );

      console.log(response);
      toast.success("تم حذف  المنتج من  السلة");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setLoading(false);
    }
  };
  return { handleDeleateFromToCart, deleatloading };
};

export default useDeleateProductFromCart;
