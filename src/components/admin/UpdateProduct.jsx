import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [cover, setCover] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [productRes, catRes, brandRes, colorRes] = await Promise.all([
          baseUrl.get(`api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          baseUrl.get("api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          baseUrl.get("api/brands", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          baseUrl.get("api/colors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const product = productRes.data;
        setCategories(catRes.data);
        setBrands(brandRes.data);
        setColors(colorRes.data);

        // Populate form fields
        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("discount", product.discount);
        setValue("stock", product.stock);
        setValue("categoryId", product.categoryId);
        setValue("brandId", product.brandId || "");
        setValue("colorId", product.colorId || "");

        if (product.cover) setCover({ preview: product.cover });
        if (product.productImages) {
          setProductImages(product.productImages.map((img) => ({ preview: img.url })));
        }
      } catch (err) {
        toast.error("Failed to load product data");
      }
    };

    fetchProductData();
  }, [id, setValue]);

  const onCoverDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setCover(Object.assign(file, { preview: URL.createObjectURL(file) }));
  };

  const onImagesDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setProductImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    if (cover && cover.preview.startsWith("blob:")) {
      console.log("pass cover")
      formData.append("cover", cover);
    }
    
    productImages.forEach((image) => {
      if (image.preview.startsWith("blob:")) {
        console.log("pass product images")
        formData.append("productImages", image);
      }
    });

    try {
      const token = localStorage.getItem("token");
      await baseUrl.patch(`api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تم تحديث المنتج بنجاح");
      navigate("/");
    } catch (err) {
      // console.error(err);
      toast.error("فشل في تحديث المنتج");
    } finally {
      setLoading(false);
    }
  };


  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: onCoverDrop,
  });

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: onImagesDrop,
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">تحديث المنتج</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-600">اسم المنتج</label>
          <input className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" {...register("name", { required: true })} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600">الوصف</label>
          <textarea className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" {...register("description")} />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">السعر</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              {...register("price", { required: true })}
            />
          </div>
          <div>
            <label className="block text-gray-600">الخصم (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              {...register("discount")}
            />
          </div>
        </div>


        {/* Stock */}
        <div>
          <label className="block text-gray-600">المخزون</label>
          <input type="number" className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" {...register("stock", { required: true })} />
        </div>

        {/* Category, Brand, and Color Selection */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600">الفئة</label>
            <select className="w-full p-2 border rounded-md" {...register("categoryId", { required: true })}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">الماركة</label>
            <select className="w-full p-2 border rounded-md" {...register("brandId")}>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">اللون</label>
            <select className="w-full p-2 border rounded-md" {...register("colorId")}>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>{color.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div {...getCoverRootProps()} className="border border-dashed p-4 text-center cursor-pointer hover:bg-gray-100">
          <input {...getCoverInputProps()} />
          {cover ? <img src={cover.preview} alt="Cover" className="w-32 h-32 object-cover mx-auto rounded-md" /> : <p>اسحب الصورة هنا أو اضغط لاختيارها</p>}
        </div>

        {/* Product Images Upload */}
        <div>
          <label className="block text-gray-600">صور المنتج</label>
          <div {...getImagesRootProps()} className="border border-dashed p-4 text-center cursor-pointer hover:bg-gray-100">
            <input {...getImagesInputProps()} />
            <p className="text-gray-500">اسحب الصور هنا أو اضغط لاختيارها</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {productImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.preview} alt="Product" className="w-24 h-24 object-cover rounded-md" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-md" disabled={loading}>
          {loading ? "جاري التحديث..." : "تحديث المنتج"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
