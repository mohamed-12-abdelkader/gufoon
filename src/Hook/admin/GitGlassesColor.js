import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesColor = () => {
  const token = localStorage.getItem("token");
  const [colors, setcolors] = useState("");
  const [loadingcolor, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/colors`, {
          headers: { token: token },
        });
        setcolors(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingcolor, colors];
};

export default GitGlassesColor;
