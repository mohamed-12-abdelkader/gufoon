import React, { useState } from "react";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";
const DeleateGlasses = () => {
  const token = localStorage.getItem("token");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteGlasses = async (id) => {
    try {
      setDeleteLoading(true);
      await baseUrl.delete(`api/glassesProduct/${id}`, {
        headers: {
          token: token,
        },
      });

      toast.success("تم حذف المنتج بنجاح ");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("فشل حذف النظارة  ");
    } finally {
      setDeleteLoading(false);
    }
  };
  return [deleteLoading, deleteGlasses];
};

export default DeleateGlasses;
