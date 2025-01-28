// src/Hook/addToCart/AddToCart.js

import { toast } from "react-toastify";

export const addToCart = async (product) => {
  return new Promise((resolve) => {
    let carts = JSON.parse(localStorage.getItem("carts")) || [];
    const existingProductIndex = carts.findIndex(
      (cartProduct) => cartProduct.product_id === product.product_id
    );

    if (existingProductIndex !== -1) {
      carts[existingProductIndex].quantity += 1;
    } else {
      product.quantity = 1;
      carts.push(product);
    }

    localStorage.setItem("carts", JSON.stringify(carts));
    toast.success("تم اضافة المنتج للسلة");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
};
