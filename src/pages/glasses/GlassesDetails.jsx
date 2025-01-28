import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import GitProductDetails from "../../Hook/gitProduct/GitProductDetails";
import ProductDetails from "../../components/productDetails/ProductDetails";
const GlassesDetails = () => {
  const { id } = useParams();
  const { type_id } = useParams();
  const [products, productsLoading] = GitProductDetails({
    id: id,
    type_id: type_id,
  });

  if (productsLoading) {
    return (
      <div>
        <h1>جااااار التحميل</h1>
      </div>
    );
  }
  if (!products || !products.result || products.result.length === 0) {
    return (
      <div>
        <h1>لم يتم العثور على منتجات</h1>
      </div>
    );
  }
  console.log("products", products);
  return (
    <>
      <ProductDetails products={products.result[0]} />
    </>
  );
};

export default GlassesDetails;
