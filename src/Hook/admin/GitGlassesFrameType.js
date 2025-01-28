import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesFrameType = () => {
  const token = localStorage.getItem("token");
  const [framType, setframType] = useState("");
  const [loadingframType, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/framType`, {
          headers: { token: token },
        });
        setframType(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingframType, framType];
};

export default GitGlassesFrameType;
