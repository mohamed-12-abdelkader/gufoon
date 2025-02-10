import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddLensesType = () => {
  const token = localStorage.getItem("token");
  const [lensesType, setlensesType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/lenses/lensesType",
        { lensesType },
        { headers: { token: token } }
      );

      toast.success("تم إضافة النوع  بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة النوع");
    } finally {
      setlensesType("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة نوع العدسة </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> اللون</Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل  النوع '
            value={lensesType}
            onChange={(e) => setlensesType(e.target.value)}
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
              "إضافة النوع "
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddLensesType;
