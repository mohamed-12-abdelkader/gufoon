import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitType = () => {
  const token = localStorage.getItem("token");
  const [type, settype] = useState("");
  const [loadingtype, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/type`, {
          headers: { token: token },
        });
        settype(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingtype, type];
};

export default GitType;
