import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesProduct = () => {
  const [glasses, setGlasses] = useState("");
  const [glassesLoading, setGlassesLoading] = useState("");
  useEffect(() => {
    const featchData = async () => {
      try {
        setGlassesLoading(true);
        const response = await baseUrl.get(`api/glassesproduct`);
        setGlasses(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setGlassesLoading(false);
      }
    };
    featchData();
  }, []);
  return [glasses, glassesLoading];
};

export default GitGlassesProduct;
