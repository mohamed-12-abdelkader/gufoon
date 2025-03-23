import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeleateGlasses = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteGlasses = async id => {
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
  return [deleteLoading, deleteGlasses];
};

export default DeleateGlasses;
