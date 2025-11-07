import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddCategory = () => {
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await baseUrl.get("api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch {
      toast.error("فشل في تحميل الفئات");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Cover Upload
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setCover(Object.assign(file, { preview: URL.createObjectURL(file) }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop,
  });

  // Submit Form
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    if (cover) formData.append("cover", cover);

    try {
      const token = localStorage.getItem("token");
      await baseUrl.post("api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تمت إضافة الفئة بنجاح");
      reset();
      setCover(null);
      fetchCategories(); // 🔄 Fetch updated categories
    } catch {
      toast.error("فشل في إضافة الفئة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">إضافة فئة جديدة</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-600">اسم الفئة</label>
          <input className="w-full p-2 border rounded-md" {...register("name", { required: true })} />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-gray-600">المعرف (Slug)</label>
          <input className="w-full p-2 border rounded-md" {...register("slug", { required: true })} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600">الوصف</label>
          <textarea className="w-full p-2 border rounded-md" {...register("description")} />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-gray-600">الفئة الأصلية</label>
          <select className="w-full p-2 border rounded-md" {...register("parentId")}>
            <option value="">لا شيء</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-600">صورة الغلاف</label>
          <div {...getRootProps()} className="border border-dashed p-4 text-center cursor-pointer hover:bg-gray-100">
            <input {...getInputProps()} />
            {cover ? (
              <img src={cover.preview} alt="Cover" className="w-32 h-32 object-cover mx-auto rounded-md" />
            ) : (
              <p className="text-gray-500">اسحب الصورة هنا أو اضغط لاختيارها</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold"
          disabled={loading}
        >
          {loading ? "جاري الإضافة..." : "إضافة الفئة"}
        </button>
      </form>

      {/* Display Existing Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">الفئات المتاحة</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="p-2 bg-gray-100 rounded-md">
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCategory;
