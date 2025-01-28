import { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitOffer = ({ id, page, sortOrder, priceRange }) => {
  const [offerProducts, setProducts] = useState(null);
  const [offerProductsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        let url = `api/offerproduct/${id}?pageN=${page}&sortOrder=${sortOrder}`;

        if (priceRange) {
          url += `&priceMin=${priceRange.min}&priceMax=${priceRange.max}`;
        }

        const response = await baseUrl.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [id, page, sortOrder, priceRange]);

  return [offerProducts, offerProductsLoading];
};

export default GitOffer;
