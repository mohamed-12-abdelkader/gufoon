import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "../../api/baseUrl";

const AddBrand = () => {
  const [brand_name, setBrand] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand_name.trim()) {
      toast.error("الرجاء إدخال اسم البراند");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await baseUrl.post(
        "api/brands",
        { name: brand_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم إضافة البراند بنجاح");
      setBrand("");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة البراند");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">إضافة براند جديد</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>اسم البراند</Form.Label>
          <Form.Control
            type="text"
            placeholder="أدخل اسم البراند"
            value={brand_name}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>

        <div className="text-center">
          <Button type="submit" variant="primary" disabled={loading} className="w-50">
            {loading ? <Spinner animation="border" size="sm" /> : "إضافة البراند"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddBrand;
