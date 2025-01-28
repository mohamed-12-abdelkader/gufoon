import React, { useState } from "react";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";
const useAddGlasses = () => {
  const token = localStorage.getItem("token");
  const [images, setImages] = useState([]);
  const [product_name, setproduct_name] = useState("");
  const [salary, setIsalary] = useState("");
  const [model_number, setmodel_number] = useState("");
  const [type_id, settype_id] = useState("");
  const [brand_id, setbrand_id] = useState("");
  const [framType_id, setframType_id] = useState("");
  const [frameShape_id, setframeShape_id] = useState("");
  const [frameColor_id, setframeColor_id] = useState("");
  const [frameMaterial_id, setframeMaterial_id] = useState("");
  const [glassSize_id, setglassSize_id] = useState("");
  const [glassLensesColor_id, setglassLensesColor_id] = useState("");
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

    const imgs = Array.from(Array(Object.keys(images).length).keys()).map(
      (item, index) => {
        return b64toFile(images[index], Math.random() + ".png");
      }
    );
    setLoading(true);

    const formData = new FormData();

    formData.append("product_name", product_name);
    formData.append("salary", salary);
    formData.append("model_number", model_number);
    formData.append("type_id", type_id);
    formData.append("brand_id", brand_id);
    formData.append("framType_id", framType_id);
    formData.append("frameShape_id", frameShape_id);
    formData.append("frameColor_id", frameColor_id);
    formData.append("frameMaterial_id", frameMaterial_id);
    formData.append("glassSize_id", glassSize_id);
    formData.append("glassLensesColor_id", glassLensesColor_id);
    imgs.map((image) => formData.append("image", image));
    // Check if price exists before appending it to formData

    const headers = {
      "Content-Type": "multipart/form-data",
      token: token,
    };

    try {
      const response = await baseUrl.post("api/glassesProduct/add", formData, {
        headers,
      });

      if (response.status === 200) {
        // Success
        setLoading(false);
        toast.success("تم اضافة النظارة بنجاح ");
      } else {
        // Error handling
        setLoading(false);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة النظارة  ");
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log(imgs);
  };

  return [
    frameMaterial_id,
    setframeMaterial_id,
    glassSize_id,
    setglassSize_id,
    glassLensesColor_id,
    setglassLensesColor_id,
    loading,
    type_id,
    settype_id,
    brand_id,
    setbrand_id,
    framType_id,
    setframType_id,
    frameShape_id,
    setframeShape_id,
    handleSubmit,
    images,
    setframeColor_id,
    product_name,
    setproduct_name,
    setImages,
    salary,
    setIsalary,
    model_number,
    setmodel_number,
  ];
};

export default useAddGlasses;
