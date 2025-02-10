import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitOrderConfirm = () => {
  const token = localStorage.getItem("token");
  const [orders, setorders] = useState("");
  const [loadingOrder, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/order/ord/orderconfirm`, {
          headers: { token: token },
        });
        setorders(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingOrder, orders];
};

export default GitOrderConfirm;
