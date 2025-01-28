import React, { useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const AddBrand = () => {
  const token = localStorage.getItem("token");
  const [brand_name, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandType, setBrandType] = useState("");

  const handleaddGlassesBrand = async (e) => {
    e.preventDefault();
    if (!brand_name || !brandType) {
      toast.warn("يجب إدخال جميع البيانات");
      return;
    }

    try {
      setLoading(true);
      let apiEndpoint =
        brandType === "glasses" ? "api/glasses/brands" : "api/lenses/brands";

      const response = await baseUrl.post(
        apiEndpoint,
        { brand_name },
        { headers: { token: token } }
      );

      console.log(response);
      toast.success("تم إضافة البراند بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة البراند");
    } finally {
      setBrand("");
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h3 className='text-center mb-4'>إضافة براند جديد</h3>
      <Form onSubmit={handleaddGlassesBrand}>
        <Form.Group className='mb-3 '>
          <Form.Label>اسم البراند</Form.Label>
          <Form.Control
            className='h-[50px] '
            type='text'
            placeholder='أدخل اسم البراند'
            value={brand_name}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>

        <div className='p-3 mb-4'>
          <h5 className='mb-3'>نوع البراند:</h5>
          <Row>
            <Col>
              <Form.Check
                type='radio'
                id='glassesBrand'
                name='brandType'
                label='براند للنظارات'
                onChange={() => setBrandType("glasses")}
                checked={brandType === "glasses"}
                inline
              />
            </Col>
            <Col>
              <Form.Check
                type='radio'
                id='lensesBrand'
                name='brandType'
                label='براند للعدسات'
                onChange={() => setBrandType("lenses")}
                checked={brandType === "lenses"}
                inline
              />
            </Col>
          </Row>
        </div>

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
              "إضافة البراند"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddBrand;
