import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddColore = () => {
  const token = localStorage.getItem("token");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/glasses/glassLensesColor",
        { color },
        { headers: { token: token } }
      );

      console.log(response);
      toast.success("تم إضافة اللون  بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة اللون");
    } finally {
      setColor("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة لون عدسة للنظارة </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> اللون</Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل  اللون '
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Form.Group>

        <div className='text-center'>
          <Button
            type='submit'
            variant='primary'
            disabled={loading}
            className='w-50'
          >
            {loading ? <Spinner animation='border' size='sm' /> : "إضافة اللون"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddColore;
