import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitProductDetails = ({ id, type_id }) => {
  const [products, setProducts] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const response = await baseUrl.get(`api/product/${type_id}/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [id && type_id]);

  return [products, productsLoading];
};

export default GitProductDetails;
