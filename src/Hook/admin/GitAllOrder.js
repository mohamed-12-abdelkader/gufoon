import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitAllOrder = () => {
  const token = localStorage.getItem("token");
  const [orders, setorders] = useState("");
  const [loadingOrder, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/orders-manage?limit=10`, {
          headers: { token: token },
        });
        setorders(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingOrder, orders];
};

export default GitAllOrder;
