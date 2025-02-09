import { useState } from "react";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const EditeProduct = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [product_name, setproduct_name] = useState("");
  const [model_number, setmodel_number] = useState("");
  const [salary, setsalary] = useState("");

  const handleEditGlasses = async (id) => {
    try {
      setLoading(true);

      const response = await baseUrl.put(
        `api/glassesProduct/${id}`,
        { product_name, model_number, salary },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.status === 200) {
        // Update the product in the state directly

        toast.success("تم تعديل المنتج بنجاح");
      } else {
        toast.error("فشل تعديل المنتج");
      }
    } catch (error) {
      toast.error("فشل تعديل المنتج");
    } finally {
      setLoading(false);
    }
  };

  return [
    loading,
    product_name,
    model_number,
    salary,
    setproduct_name,
    setmodel_number,
    setsalary,
    handleEditGlasses,
  ];
};

export default EditeProduct;
