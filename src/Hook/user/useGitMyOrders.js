import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const useGitMyOrders = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState("");
  const [ordersLoading, setordersLoading] = useState("");
  useEffect(() => {
    const featchData = async () => {
      try {
        setordersLoading(true);
        const response = await baseUrl.get(`api/order`, {
          headers: {
            token: token,
          },
        });
        setOrders(response.data);
      } catch (error) {
      } finally {
        setordersLoading(false);
      }
    };
    featchData();
  }, [token]);
  return [orders, ordersLoading];
};

export default useGitMyOrders;
