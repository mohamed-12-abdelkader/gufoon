import React, { useState } from "react";
import MultiImageInput from "react-multiple-image-input";
import { Form, Button, Spinner } from "react-bootstrap";
import GitGlassesSize from "../../Hook/admin/GitGlassesSize";
import GitType from "../../Hook/admin/GitType";
import GitGlassesColor from "../../Hook/admin/GitGlassesColor";
import GitGlassesFrameType from "../../Hook/admin/GitGlassesFrameType";
import GitGlassesMatrial from "../../Hook/admin/GitGlassesMatrial";
import GitGlassLensesColor from "../../Hook/admin/GitGlassLensesColor";
import GitGlassesShaps from "../../Hook/admin/GitGlassesShaps";
import GitGlassesBrands from "../../Hook/admin/GitGlassesBrands";
import useAddGlasses from "../../Hook/admin/AddGlasses";

const AddGlasses = () => {
  const [loadingsizes, sizes] = GitGlassesSize();
  const [loadingtype, type] = GitType();
  const [loadingcolor, colors] = GitGlassesColor();
  const [loadingframType, framType] = GitGlassesFrameType();
  const [loadingmatrials, matrials] = GitGlassesMatrial();
  const [loadingLensesColor, glassLensesColor] = GitGlassLensesColor();
  const [loadingshaps, shaps] = GitGlassesShaps();
  const [loadingbrand, brands] = GitGlassesBrands();

  const [
    frameMaterial_id,
    setframeMaterial_id,
    glassSize_id,
    setglassSize_id,
    glassLensesColor_id,
    setglassLensesColor_id,
    loading,
    type_id,
    settype_id,
    brand_id,
    setbrand_id,
    framType_id,
    setframType_id,
    frameShape_id,
    setframeShape_id,
    handleSubmit,
    images,
    setframeColor_id,
    product_name,
    setproduct_name,
    setImages,
    salary,
    setIsalary,
    model_number,
    setmodel_number,
  ] = useAddGlasses();

  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100",
  };

  return (
    <div className='container my-5'>
      <div className='text-center my-3'>
        <h2 className='fw-bold text-'>اضافة نظارة جديدة</h2>
      </div>

      <MultiImageInput
        images={images}
        setImages={setImages}
        cropConfig={{ crop, ruleOfThirds: true }}
        theme='light'
        allowCrop={false}
        max={4}
      />

      <Form.Control
        placeholder='اسم المنتج'
        className='my-3'
        value={product_name}
        onChange={(e) => setproduct_name(e.target.value)}
      />

      <Form.Control
        placeholder='موديل المنتج'
        className='my-3'
        value={model_number}
        onChange={(e) => setmodel_number(e.target.value)}
      />

      <Form.Control
        placeholder='سعر المنتج'
        className='my-3'
        value={salary}
        onChange={(e) => setIsalary(e.target.value)}
      />

      <Form.Select
        onChange={(e) => settype_id(e.target.value)}
        className='my-2'
        disabled={loadingtype}
      >
        <option>{loadingtype ? "جار تحميل الأنواع..." : "اختر النوع"}</option>
        {!loadingtype &&
          Array.isArray(type) &&
          type.map((t) => (
            <option key={t.type_id} value={t.type_id}>
              {t.type_name}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setbrand_id(e.target.value)}
        className='my-2'
        disabled={loadingbrand}
      >
        <option>
          {loadingbrand ? "جار تحميل البراندات..." : "اختر البراند"}
        </option>
        {!loadingbrand &&
          Array.isArray(brands) &&
          brands.map((b) => (
            <option key={b.brand_id} value={b.brand_id}>
              {b.brand_name}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setglassSize_id(e.target.value)}
        className='my-2'
        disabled={loadingsizes}
      >
        <option>
          {loadingsizes ? "جار تحميل المقاسات..." : "اختر مقاس النظارة"}
        </option>
        {!loadingsizes &&
          Array.isArray(sizes) &&
          sizes.map((s) => (
            <option key={s.glasssize_id} value={s.glasssize_id}>
              {s.size}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setframeColor_id(e.target.value)}
        className='my-2'
        disabled={loadingcolor}
      >
        <option>
          {loadingcolor ? "جار تحميل الألوان..." : "اختر لون الإطار"}
        </option>
        {!loadingcolor &&
          Array.isArray(colors) &&
          colors.map((c) => (
            <option key={c.framecolor_id} value={c.framecolor_id}>
              {c.color}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setframType_id(e.target.value)}
        className='my-2'
        disabled={loadingframType}
      >
        <option>
          {loadingframType ? "جار تحميل أنواع الإطار..." : "اختر نوع الإطار"}
        </option>
        {!loadingframType &&
          Array.isArray(framType) &&
          framType.map((f) => (
            <option key={f.framtype_id} value={f.framtype_id}>
              {f.type}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setframeMaterial_id(e.target.value)}
        className='my-2'
        disabled={loadingmatrials}
      >
        <option>
          {loadingmatrials ? "جار تحميل مادة الإطار..." : "اختر مادة الإطار"}
        </option>
        {!loadingmatrials &&
          Array.isArray(matrials) &&
          matrials.map((m) => (
            <option key={m.framematerial_id} value={m.framematerial_id}>
              {m.material}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setglassLensesColor_id(e.target.value)}
        className='my-2'
        disabled={loadingLensesColor}
      >
        <option>
          {loadingLensesColor ? "جار تحميل ألوان العدسة..." : "اختر لون العدسة"}
        </option>
        {!loadingLensesColor &&
          Array.isArray(glassLensesColor) &&
          glassLensesColor.map((g) => (
            <option key={g.glasslensescolor_id} value={g.glasslensescolor_id}>
              {g.color}
            </option>
          ))}
      </Form.Select>

      <Form.Select
        onChange={(e) => setframeShape_id(e.target.value)}
        className='my-2'
        disabled={loadingshaps}
      >
        <option>
          {loadingshaps ? "جار تحميل الأشكال..." : "اختر شكل النظارة"}
        </option>
        {!loadingshaps &&
          Array.isArray(shaps) &&
          shaps.map((s) => (
            <option key={s.frameshape_id} value={s.frameshape_id}>
              {s.shape}
            </option>
          ))}
      </Form.Select>

      <div className='text-center my-4'>
        <Button
          variant='primary'
          onClick={handleSubmit}
          disabled={loading}
          size='lg'
        >
          {loading ? <Spinner animation='border' size='sm' /> : "اضافة النظارة"}
        </Button>
      </div>
    </div>
  );
};

export default AddGlasses;
