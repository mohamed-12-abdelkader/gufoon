import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GetLensess = () => {
  const [lenses, setlenses] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const response = await baseUrl.get(`api/lensesProduct`);
        setlenses(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  return [lenses, productsLoading];
};

export default GetLensess;
