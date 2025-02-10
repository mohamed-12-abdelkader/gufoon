import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddMaterial = () => {
  const token = localStorage.getItem("token");
  const [matrial, setmatrial] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/glasses/matrials",
        { matrial },
        { headers: { token: token } }
      );

      toast.success("تم إضافة  المتريال  بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ اثناء  إضافة المتريال  ");
    } finally {
      setmatrial("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة المتريال </h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> المتريال </Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل   المتريال'
            value={matrial}
            onChange={(e) => setmatrial(e.target.value)}
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
              "إضافة  المتريال"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddMaterial;
