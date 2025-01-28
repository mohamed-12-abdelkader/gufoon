import React, { useState } from 'react'
import baseUrl from '../../api/baseUrl';
import { toast } from 'react-toastify';

const DeleateLenses = () => {
    const token = localStorage.getItem("token");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const deleteLenses = async (id) => {
      try {
        setDeleteLoading(true);
        await baseUrl.delete(`api/lensesProduct/${id}`, {
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
    return [deleteLoading, deleteLenses];
}

export default DeleateLenses
