import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddLensesTyme = () => {
  const token = localStorage.getItem("token");
  const [replacement, setreplacement] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/lenses/lensesReplacement",
        { replacement },
        { headers: { token: token } }
      );

      toast.success("تم إضافة المدة  بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة المدة");
    } finally {
      setreplacement("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة مدة العدسة </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> المدة</Form.Label>
          <Form.Control
            className='h-[50px] '
            type='number'
            placeholder='أدخل  المدة '
            value={replacement}
            onChange={(e) => setreplacement(e.target.value)}
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
              "إضافة المدة "
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddLensesTyme;
