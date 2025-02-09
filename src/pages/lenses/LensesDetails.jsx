import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GetLensessDetails from "../../Hook/lensess/GitLensesDetails";
import ProductDetails from "../../components/productDetails/ProductDetails";
import baseUrl from "../../api/baseUrl";

const LensesDetails = () => {
  const { id } = useParams();
  const [lenses, setLenses] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const response = await baseUrl.get(`api/lensesProduct/${id}`);
        setLenses(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (productsLoading) {
    return <h1>جارِ التحميل...</h1>;
  }

  if (!lenses) {
    return <h1>لم يتم العثور على المنتج.</h1>;
  }
  return (
    <div>
      <ProductDetails products={lenses[0]} />
    </div>
  );
};

export default LensesDetails;
