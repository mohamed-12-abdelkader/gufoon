import { useEffect, useState, useCallback } from "react";
import baseUrl from "../../api/baseUrl";

// إنشاء متغير عام لتتبع حالة التحديث
let shouldRefresh = false;

const useGitCart = () => {
  const token = localStorage.getItem("token");
  const [carts, setcarts] = useState("");
  const [cartsLoading, setGlassesLoading] = useState(true);

  const fetchCartData = async () => {
    if (!token) {
      setcarts("");
      setGlassesLoading(false);
      return;
    }

    try {
      setGlassesLoading(true);
      const response = await baseUrl.get(`/api/basket/`, {
        headers: { token: token },
      });
      setcarts(response.data);
      shouldRefresh = false;
    } catch (error) {
      setcarts("");
    } finally {
      setGlassesLoading(false);
    }
  };

  // دالة لتحديث السلة يدوياً
  const refreshCart = useCallback(() => {
    shouldRefresh = true;
    fetchCartData();
  }, []);

  // التحقق من التغييرات وتحديث السلة عند الحاجة
  useEffect(() => {
    fetchCartData();

    const checkForUpdates = () => {
      if (shouldRefresh) {
        fetchCartData();
      }
    };

    const interval = setInterval(checkForUpdates, 1000);
    return () => clearInterval(interval);
  }, [token]);

  return [carts, cartsLoading, refreshCart];
};

// دالة عامة لطلب تحديث السلة من أي مكان في التطبيق
export const requestCartRefresh = () => {
  shouldRefresh = true;
};

export default useGitCart;
