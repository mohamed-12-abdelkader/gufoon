import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddShap = () => {
  const token = localStorage.getItem("token");
  const [shap, setshap] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/glasses/shaps",
        { shap },
        { headers: { token: token } }
      );

      console.log(response);
      toast.success("تم إضافة الشكل   بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة الشكل");
    } finally {
      setshap("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة الشكل للنظارة </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> الشكل</Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل  الشكل '
            value={shap}
            onChange={(e) => setshap(e.target.value)}
          />
        </Form.Group>

        <div className='text-center'>
          <Button
            type='submit'
            variant='primary'
            disabled={loading}
            className='w-50'
          >
            {loading ? <Spinner animation='border' size='sm' /> : "إضافة الشكل"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddShap;
