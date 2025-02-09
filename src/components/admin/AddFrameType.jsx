import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddFrameType = () => {
  const token = localStorage.getItem("token");
  const [type, settype] = useState("");
  const [loading, setLoading] = useState(false);

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await baseUrl.post(
        "api/glasses/framType",
        { type },
        { headers: { token: token } }
      );

      toast.success("تم إضافة نوع الاطار بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ اثناء  إضافة نوع الاطار ");
    } finally {
      settype("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة نوع الاطار</h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label> نوع الاطار </Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل  نوع الاطار'
            value={type}
            onChange={(e) => settype(e.target.value)}
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
              "إضافة نوع الاطار"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddFrameType;
