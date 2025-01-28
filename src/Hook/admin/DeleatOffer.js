import React, { useState } from "react";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";

const DeleatOffer = ({ off_id }) => {
  const token = localStorage.getItem("token");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteOffer = async (id) => {
    try {
      setDeleteLoading(true);
      await baseUrl.delete(`api/offer/${off_id}/${id}`, {
        headers: {
          token: token,
        },
      });

      toast.success("تم حذف العرض بنجاح ");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("فشل حذف العرض  ");
    } finally {
      setDeleteLoading(false);
    }
  };
  return [deleteLoading, deleteOffer];
};

export default DeleatOffer;
