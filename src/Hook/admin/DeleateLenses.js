import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeleateLenses = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteLenses = async id => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/products/${id}`);

      toast.success('تم حذف المنتج بنجاح ');

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error('فشل حذف النظارة  ');
    } finally {
      setDeleteLoading(false);
    }
  };
  return [deleteLoading, deleteLenses];
};

export default DeleateLenses;
