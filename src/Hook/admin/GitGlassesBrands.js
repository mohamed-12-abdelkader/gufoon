import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesBrands = () => {
  const token = localStorage.getItem("token");
  const [brands, setBrands] = useState("");
  const [loadingbrand, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/brands`, {
          headers: { token: token },
        });
        setBrands(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingbrand, brands];
};

export default GitGlassesBrands;
