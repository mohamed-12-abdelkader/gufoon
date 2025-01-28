import React, { useState } from "react";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddOffer = ({ id }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [brand_id, setbrand_id] = useState("");
  const [percent, setpercent] = useState("");

  const handleBrandChange = (e) => {
    setbrand_id(e.target.value);
  };
  const handlePercentChange = (e) => {
    setpercent(e.target.value);
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!brand_id || !percent) {
      toast.warn("يجب ادخال جميع البيانات ");
    }

    try {
      setLoading(true);

      // Pass the token in the headers
      const response = await baseUrl.post(
        `api/offer/add/${id}`,
        { brand_id, percent },
        {
          headers: {
            token: token,
            // Add any additional headers if needed
          },
        }
      );

      localStorage.setItem("code", JSON.stringify(response.data));
      toast.success("تم  انشاءالخصم   بنجاح");
    } catch (error) {
      toast.error("فشل  انشاء الخصم ");
    } finally {
      setLoading(false);
    }
  };
  return [
    handleBrandChange,
    handlePercentChange,
    loading,
    brand_id,
    percent,
    handleCreateOffer,
  ];
};

export default AddOffer;
