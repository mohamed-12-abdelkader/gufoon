import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import {
  validateFileSize,
  validateFileFormat,
  validateImageCount,
  compressImage,
  processImages,
  createCleanFile,
  getFileSizeString,
  MAX_PRODUCT_IMAGES,
  MAX_IMAGE_SIZE,
  MAX_COVER_SIZE,
} from "../../utils/imageProcessor";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [catRes, brandRes, colorRes] = await Promise.all([
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
        setCategories(catRes.data);
        setBrands(brandRes.data);
        setColors(colorRes.data);
      } catch {
        toast.error("فشل في تحميل البيانات الأولية");
      }
    };
    fetchData();
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      productImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [coverPreview, productImagePreviews]);

  const handleCoverDrop = async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            toast.error(`صورة الغلاف كبيرة جداً. الحد الأقصى: ${getFileSizeString(MAX_COVER_SIZE)}`);
          } else if (error.code === 'file-invalid-type') {
            toast.error('صيغة الصورة غير مدعومة');
          } else {
            toast.error(`خطأ في صورة الغلاف: ${error.message}`);
          }
        });
      });
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    try {
      // Validate before processing
      validateFileFormat(file);
      validateFileSize(file, MAX_COVER_SIZE);

      setProcessing(true);
      
      // Compress image
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.9, // Higher quality for cover
      });

      // Create preview (separate from file data)
      const preview = URL.revokeObjectURL(coverPreview);
      const newPreview = URL.createObjectURL(compressedFile);

      // Store clean file and preview separately
      setCover(compressedFile);
      setCoverPreview(newPreview);

      toast.success(`تم تحميل صورة الغلاف (${getFileSizeString(compressedFile.size)})`);
    } catch (error) {
      toast.error(error.message || "فشل في معالجة صورة الغلاف");
      console.error("Cover image processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleImagesDrop = async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            toast.error(`الصورة كبيرة جداً. الحد الأقصى: ${getFileSizeString(MAX_IMAGE_SIZE)}`);
          } else if (error.code === 'file-invalid-type') {
            toast.error('صيغة الصورة غير مدعومة');
          } else {
            toast.error(`خطأ في الصورة: ${error.message}`);
          }
        });
      });
    }

    if (acceptedFiles.length === 0) return;

    try {
      // Validate count
      validateImageCount(productImages.length, acceptedFiles.length, MAX_PRODUCT_IMAGES);

      setProcessing(true);

      // Process all images
      const { files: processedFiles, errors } = await processImages(acceptedFiles, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
      });

      if (errors.length > 0) {
        errors.forEach(({ file, error }) => {
          toast.warning(`فشل معالجة ${file}: ${error}`);
        });
      }

      if (processedFiles.length > 0) {
        // Create previews
        const newPreviews = processedFiles.map((file) => URL.createObjectURL(file));
        
        // Clean up old previews
        productImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

        // Store clean files and previews separately
        setProductImages([...productImages, ...processedFiles]);
        setProductImagePreviews([...productImagePreviews, ...newPreviews]);

        const totalSize = processedFiles.reduce((sum, file) => sum + file.size, 0);
        toast.success(`تم إضافة ${processedFiles.length} صورة (${getFileSizeString(totalSize)})`);
      }
    } catch (error) {
      toast.error(error.message || "فشل في معالجة الصور");
      console.error("Product images processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const removeImage = (index) => {
    // Revoke preview URL
    URL.revokeObjectURL(productImagePreviews[index]);
    
    // Remove from arrays
    setProductImages(productImages.filter((_, i) => i !== index));
    setProductImagePreviews(productImagePreviews.filter((_, i) => i !== index));
  };

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCover(null);
    setCoverPreview(null);
  };

  const onSubmit = async (data) => {
    // Validate required images
    if (!cover) {
      toast.error("يرجى إضافة صورة الغلاف");
      return;
    }

    // Validate product images count
    if (productImages.length === 0) {
      toast.error("يرجى إضافة صورة واحدة على الأقل للمنتج");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create FormData with clean file objects (no preview metadata)
      const formData = new FormData();

      // Add product data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Add cover image (clean file, no preview)
      const cleanCover = createCleanFile(cover);
      formData.append("cover", cleanCover);

      // Add product images (clean files, no previews)
      productImages.forEach((image) => {
        const cleanImage = createCleanFile(image);
        formData.append("productImages", cleanImage);
      });

      // Log FormData size for debugging (approximate)
      let totalSize = cleanCover.size;
      productImages.forEach((img) => {
        totalSize += img.size;
      });
      console.log(`Total upload size: ${getFileSizeString(totalSize)}`);

      // Upload with progress tracking
      const token = localStorage.getItem("token");
      await baseUrl.post("api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("تمت إضافة المنتج بنجاح");
      
      // Reset form
      reset();
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      productImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setCover(null);
      setCoverPreview(null);
      setProductImages([]);
      setProductImagePreviews([]);
      setUploadProgress(0);
    } catch (err) {
      console.error("Upload error:", err);
      
      if (err.response) {
        if (err.response.status === 413) {
          toast.error("حجم الملفات كبير جداً. يرجى تقليل حجم الصور أو عددها");
        } else if (err.response.status === 400) {
          toast.error(err.response.data?.message || "بيانات غير صحيحة");
        } else if (err.response.status === 401) {
          toast.error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى");
        } else {
          toast.error(err.response.data?.message || "فشل في إضافة المنتج");
        }
      } else if (err.request) {
        toast.error("فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت");
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic', '.heif'],
    },
    multiple: false,
    maxSize: MAX_COVER_SIZE,
    onDrop: handleCoverDrop,
    disabled: processing || loading,
  });

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic', '.heif'],
    },
    multiple: true,
    maxSize: MAX_IMAGE_SIZE,
    maxFiles: MAX_PRODUCT_IMAGES,
    onDrop: handleImagesDrop,
    disabled: processing || loading,
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-5 text-gray-700 dark:text-gray-100">إضافة منتج جديد</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">اسم المنتج</label>
          <input
            className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring focus:ring-blue-300"
            {...register("name", { required: "اسم المنتج مطلوب" })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">الوصف</label>
          <textarea
            className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring focus:ring-blue-300"
            rows="4"
            {...register("description")}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">السعر</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring focus:ring-blue-300"
              {...register("price", { required: "السعر مطلوب", min: 0 })}
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">الخصم (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring focus:ring-blue-300"
              {...register("discount", { min: 0, max: 100 })}
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">المخزون</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring focus:ring-blue-300"
            {...register("stock", { required: "المخزون مطلوب", min: 0 })}
          />
        </div>

        {/* Category, Brand, and Color Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">الفئة</label>
            <select
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
              {...register("categoryId", { required: "الفئة مطلوبة" })}
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">الماركة (اختياري)</label>
            <select
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
              {...register("brandId")}
            >
              <option value="">اختر الماركة</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1">اللون (اختياري)</label>
            <select
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
              {...register("colorId")}
            >
              <option value="">اختر اللون</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            صورة الغلاف <span className="text-red-500">*</span>
            {cover && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({getFileSizeString(cover.size)})
              </span>
            )}
          </label>
          <div
            {...getCoverRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              processing || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            } ${cover ? "border-green-300 dark:border-green-700" : "border-gray-300 dark:border-gray-600"}`}
          >
            <input {...getCoverInputProps()} />
            {coverPreview ? (
              <div className="space-y-2">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover mx-auto rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCover();
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  {processing ? "جاري المعالجة..." : "اسحب الصورة هنا أو اضغط لاختيارها"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  الحد الأقصى: {getFileSizeString(MAX_COVER_SIZE)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Images Upload */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            صور المنتج <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({productImages.length}/{MAX_PRODUCT_IMAGES})
            </span>
          </label>
          <div
            {...getImagesRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              processing || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            } border-gray-300 dark:border-gray-600`}
          >
            <input {...getImagesInputProps()} />
            <p className="text-gray-500 dark:text-gray-400">
              {processing ? "جاري المعالجة..." : "اسحب الصور هنا أو اضغط لاختيارها"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              الحد الأقصى: {getFileSizeString(MAX_IMAGE_SIZE)} لكل صورة
            </p>
          </div>
          {productImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {productImages.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                    <img
                      src={productImagePreviews[index]}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                    title="إزالة الصورة"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {getFileSizeString(file.size)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
              جاري الرفع: {uploadProgress}%
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || processing || !cover || productImages.length === 0}
        >
          {loading ? `جاري الإضافة... ${uploadProgress > 0 ? `${uploadProgress}%` : ""}` : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
