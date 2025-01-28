import React, { useState } from "react";
import baseUrl from "../../../api/baseUrl";
import { toast } from "react-toastify";

const useAddLenses = () => {
  const token = localStorage.getItem("token");
  const [image, setImages] = useState([]);
  const [product_name, setproduct_name] = useState("");
  const [salary, setIsalary] = useState("");
  const [model_number, setmodel_number] = useState("");
  const [type_id, settype_id] = useState("");
  const [brand_id, setbrand_id] = useState("");
  const [lensesColor_id, setlensesColor_id] = useState("");
  const [lensesReplacement_id, setlensesReplacement_id] = useState("");
  const [lensesType_id, setlensesType_id] = useState("");

  const [loading, setLoading] = useState("");

  const b64toFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const blob = new Blob([u8arr], { type: mime });
    return new File([blob], filename, { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgs = Array.from(Array(Object.keys(image).length).keys()).map(
      (item, index) => {
        return b64toFile(image[index], Math.random() + ".png");
      }
    );
    setLoading(true);

    const formData = new FormData();

    formData.append("product_name", product_name);
    formData.append("salary", salary);
    formData.append("model_number", model_number);
    formData.append("type_id", 1);
    formData.append("brand_id", 1);
    formData.append("lensesColor_id", 1);
    formData.append("lensesReplacement_id", 1);
    formData.append("lensesType_id", 1);

    imgs.map((image) => formData.append("image", image));
    // Check if price exists before appending it to formData

    const headers = {
      "Content-Type": "multipart/form-data",
      token: token,
    };

    try {
      const response = await baseUrl.post("api/lensesProduct/add", formData, {
        headers,
      });

      if (response.status === 200) {
        // Success
        setLoading(false);
        toast.success("تم اضافة العدسة بنجاح ");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Error handling
        setLoading(false);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة العدسة  ");
      console.log(error);
    } finally {
      setLoading(false);
      setImages("");
      setproduct_name("");
      setIsalary("");
      setmodel_number("");
      settype_id("");
      setbrand_id("");
      setlensesColor_id("");
      setlensesReplacement_id("");
      setlensesType_id("");
    }
    console.log(imgs);
  };

  return {
    lensesColor_id,
    setlensesColor_id,
    lensesReplacement_id,
    setlensesReplacement_id,
    lensesType_id,
    setlensesType_id,
    loading,
    type_id,
    settype_id,
    brand_id,
    setbrand_id,
    image,
    setImages,
    product_name,
    setproduct_name,
    salary,
    setIsalary,
    model_number,
    setmodel_number,
    handleSubmit,
  };
};

export default useAddLenses;
