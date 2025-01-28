import { useState } from "react";
import baseUrl from "../../api/baseUrl";
import { toast } from "react-toastify";

const useUpdateCartQuantity = () => {
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [updatingAction, setUpdatingAction] = useState(null);
  const token = localStorage.getItem("token");

  const updateQuantity = async (itemId, newQuantity, action) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItemId(itemId);
      setUpdatingAction(action);

      const response = await baseUrl.put(
        `/api/basket/${itemId}`,
        { quentity: newQuantity },
        {
          headers: { token: token },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث الكمية بنجاح");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحديث الكمية");
    } finally {
      setUpdatingItemId(null);
      setUpdatingAction(null);
    }
  };

  return { updateQuantity, updatingItemId, updatingAction };
};

export default useUpdateCartQuantity;
