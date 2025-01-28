import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesSize = () => {
  const token = localStorage.getItem("token");
  const [sizes, setsizes] = useState("");
  const [loadingsizes, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/sizes`, {
          headers: { token: token },
        });
        setsizes(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingsizes, sizes];
};

export default GitGlassesSize;
