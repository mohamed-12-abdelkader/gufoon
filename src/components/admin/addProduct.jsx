import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [cover, setCover] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes, colorRes] = await Promise.all([
          axios.get("/categories"),
          axios.get("/brands"),
          axios.get("/colors"),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
        setColors(colorRes.data);
      } catch {
        toast.error("فشل في تحميل البيانات الأولية");
      }
    };
    fetchData();
  }, []);

  const onCoverDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setCover(Object.assign(file, { preview: URL.createObjectURL(file) }));
  };

  const onImagesDrop = (acceptedFiles) => {
    setProductImages([
      ...productImages,
      ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    if (cover) formData.append("cover", cover);
    productImages.forEach((image) => formData.append("productImages", image));

    try {
      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("تمت إضافة المنتج بنجاح");
      reset();
      setCover(null);
      setProductImages([]);
    } catch (err) {
      console.log(err.response.data.stack)
      toast.error("فشل في إضافة المنتج");
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
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">إضافة منتج جديد</h2>

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
            <input type="number" className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" {...register("price", { required: true })} />
          </div>
          <div>
            <label className="block text-gray-600">الخصم (%)</label>
            <input type="number" className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" {...register("discount")} />
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
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">الماركة (اختياري)</label>
            <select className="w-full p-2 border rounded-md" {...register("brandId")}>
              <option value="">اختر الماركة</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">اللون (اختياري)</label>
            <select className="w-full p-2 border rounded-md" {...register("colorId")}>
              <option value="">اختر اللون</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>{color.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-gray-600">صورة الغلاف</label>
          <div {...getCoverRootProps()} className="border border-dashed p-4 text-center cursor-pointer hover:bg-gray-100">
            <input {...getCoverInputProps()} />
            {cover ? (
              <img src={cover.preview} alt="Cover" className="w-32 h-32 object-cover mx-auto rounded-md" />
            ) : (
              <p className="text-gray-500">اسحب الصورة هنا أو اضغط لاختيارها</p>
            )}
          </div>
        </div>

        {/* Product Images Upload */}
        <div>
          <label className="block text-gray-600">صور المنتج</label>
          <div {...getImagesRootProps()} className="border border-dashed p-4 text-center cursor-pointer hover:bg-gray-100">
            <input {...getImagesInputProps()} />
            <p className="text-gray-500">اسحب الصور هنا أو اضغط لاختيارها</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {productImages.map((file, index) => (
              <div key={index} className="relative w-20 h-20">
                <img src={file.preview} alt="" className="w-full h-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-md" disabled={loading}>
          {loading ? "جاري الإضافة..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
