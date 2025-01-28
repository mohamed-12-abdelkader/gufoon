import React from "react";
import MultiImageInput from "react-multiple-image-input";
import { Form, Button, Spinner, FormControl } from "react-bootstrap";
import GitLensesType from "../../Hook/admin/lensess/GitLensesType";
import GitLensessBrand from "../../Hook/admin/lensess/GitLensessBrand";
import GitLensessColor from "../../Hook/admin/lensess/GitLensessColor";
import GitLensesReplacement from "../../Hook/admin/lensess/GitLensesReplacement";
import useAddLenses from "../../Hook/admin/lensess/AddLensess";

const AddLenses = () => {
  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100",
  };

  const [loadingtypes, types] = GitLensesType();
  const [loadingLensesbrands, Lensesbrands] = GitLensessBrand();
  const [loadingcolors, colors] = GitLensessColor();
  const [loadingreplacements, replacements] = GitLensesReplacement();

  const {
    lensesColor_id,
    setlensesColor_id,
    lensesReplacement_id,
    setlensesReplacement_id,
    lensesType_id,
    setlensesType_id,
    loading,
    type_id,
    settype_id,
    brand_id,
    setbrand_id,
    image,
    setImages,
    product_name,
    setproduct_name,
    salary,
    setIsalary,
    model_number,
    setmodel_number,
    handleSubmit,
  } = useAddLenses();

  return (
    <Form>
      <Form.Group>
        <MultiImageInput
          images={image}
          setImages={setImages}
          cropConfig={{ crop, ruleOfThirds: true }}
          theme={"light"}
          allowCrop={false}
          max={4}
        />
      </Form.Group>

      <Form.Group className='my-3'>
        <FormControl
          placeholder='اسم المنتج'
          value={product_name}
          onChange={(e) => setproduct_name(e.target.value)}
        />
      </Form.Group>

      <Form.Group className='my-3'>
        <FormControl
          placeholder='موديل المنتج'
          value={model_number}
          onChange={(e) => setmodel_number(e.target.value)}
        />
      </Form.Group>

      <Form.Group className='my-3'>
        <FormControl
          placeholder='سعر المنتج'
          value={salary}
          onChange={(e) => setIsalary(e.target.value)}
        />
      </Form.Group>

      <Form.Group className='my-3'>
        <Form.Select
          value={type_id}
          onChange={(e) => settype_id(e.target.value)}
        >
          <option value=''>اختر الصنف</option>
          <option value={6}>عدسات ملونة Plano</option>
          <option value={7}>عدسات ملونة Power</option>
          <option value={8}>عدسات طبية</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className='my-3'>
        <Form.Select
          value={brand_id}
          onChange={(e) => setbrand_id(e.target.value)}
          disabled={loadingLensesbrands}
        >
          <option value=''>
            {loadingLensesbrands ? "جار تحميل البراندات..." : "اختر البراند"}
          </option>
          {Lensesbrands &&
            Lensesbrands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className='my-3'>
        <Form.Select
          value={lensesColor_id}
          onChange={(e) => setlensesColor_id(e.target.value)}
          disabled={loadingcolors}
        >
          <option value=''>
            {loadingcolors ? "جار تحميل الألوان..." : "اختر اللون"}
          </option>
          {colors &&
            colors.map((color) => (
              <option key={color.lensescolor_id} value={color.lensescolor_id}>
                {color.color}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className='my-3'>
        <Form.Select
          value={lensesReplacement_id}
          onChange={(e) => setlensesReplacement_id(e.target.value)}
          disabled={loadingreplacements}
        >
          <option value=''>
            {loadingreplacements ? "جار تحميل المدة..." : "اختر مدة العدسة"}
          </option>
          {replacements &&
            replacements.map((replacement) => (
              <option
                key={replacement.lensesreplacement_id}
                value={replacement.lensesreplacement_id}
              >
                {replacement.replacement}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className='my-3'>
        <Form.Select
          value={lensesType_id}
          onChange={(e) => setlensesType_id(e.target.value)}
          disabled={loadingtypes}
        >
          <option value=''>
            {loadingtypes ? "جار تحميل الأنواع..." : "اختر النوع"}
          </option>
          {types &&
            types.map((type) => (
              <option key={type.lensestype_id} value={type.lensestype_id}>
                {type.lensestype}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <div className='text-center'>
        <Button variant='primary' onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation='border' size='sm' /> : "إضافة العدسة"}
        </Button>
      </div>
    </Form>
  );
};

export default AddLenses;
