import { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitProducts = ({ id, page }) => {
  const [products, setProducts] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const response = await baseUrl.get(`api/product/${id}?pageN=${page}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [id, page]);

  return [products, productsLoading];
};

export default GitProducts;
