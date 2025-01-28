import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddSize = () => {
  const token = localStorage.getItem("token");
  const [size, setsize] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/glasses/sizes",
        { size },
        { headers: { token: token } }
      );

      console.log(response);
      toast.success("تم إضافة الحجم  بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة الحجم ");
    } finally {
      setsize("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة حجم للنظارة </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 ' type='number'>
          <Form.Label> الحجم</Form.Label>
          <Form.Control
            type='number'
            className='h-[50px] '
            placeholder='أدخل  الحجم  '
            value={size}
            onChange={(e) => setsize(e.target.value)}
          />
        </Form.Group>

        <div className='text-center'>
          <Button
            type='submit'
            variant='primary'
            disabled={loading}
            className='w-50'
          >
            {loading ? (
              <Spinner animation='border' size='sm' />
            ) : (
              "إضافة الحجم "
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddSize;
