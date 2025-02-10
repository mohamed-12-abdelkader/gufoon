import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitOrderDetails = ({ id }) => {
  const token = localStorage.getItem("token");
  const [order, setorder] = useState("");
  const [loadingorder, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/orders-manage/${id}`, {
          headers: { token: token },
        });
        setorder(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingorder, order];
};

export default GitOrderDetails;
