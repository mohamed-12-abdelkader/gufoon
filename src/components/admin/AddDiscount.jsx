import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import GitGlassesBrands from "../../Hook/admin/GitGlassesBrands";
import GitLensessBrand from "../../Hook/admin/lensess/GitLensessBrand";
import AddOffer from "../../Hook/admin/AddOffer";

const AddDiscount = () => {
  const [loadingbrand, brands] = GitGlassesBrands();
  const [loadingLensesbrands, Lensesbrands] = GitLensessBrand();
  const [id, setId] = useState("1");
  const [isGlassesChecked, setIsGlassesChecked] = useState(true);
  const [isLensesChecked, setIsLensesChecked] = useState(false);
  const [
    handleBrandChange,
    handlePercentChange,
    loading,
    brand_id,
    percent,
    handleCreateOffer,
  ] = AddOffer({ id: id });

  const handleCheckboxChange = (type) => {
    if (type === "glasses") {
      setIsGlassesChecked(true);
      setIsLensesChecked(false);
      setId("1");
    } else if (type === "lenses") {
      setIsGlassesChecked(false);
      setIsLensesChecked(true);
      setId("2");
    }
  };

  return (
    <div>
      <div className='text-center'>
        <h5 className='fw-bold'>
          اضافة <span className='text-danger fs-4'>خصم :</span>{" "}
        </h5>
      </div>
      <div className='my-5'>
        {isLensesChecked && (
          <Form.Select
            onChange={handleBrandChange}
            className='my-2'
            disabled={loadingLensesbrands}
            style={{ direction: "ltr" }}
          >
            <option>
              {loadingLensesbrands
                ? "جار  تحميل البراندات..."
                : "اختر  براند العدسات "}
            </option>
            {loadingLensesbrands ? (
              <option disabled>Loading...</option>
            ) : Lensesbrands && Lensesbrands.length > 0 ? (
              Lensesbrands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))
            ) : (
              <option disabled>لا يوجد براندات للعدسات متاحة</option>
            )}
          </Form.Select>
        )}

        {isGlassesChecked && (
          <Form.Select
            onChange={handleBrandChange}
            className='my-2'
            disabled={loadingbrand}
            style={{ direction: "ltr" }}
          >
            <option>
              {loadingbrand
                ? "جار تحميل البراندات ..."
                : "اختر البراند النظارات"}
            </option>
            {loadingbrand ? (
              <option disabled>Loading...</option>
            ) : brands && brands.length > 0 ? (
              brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))
            ) : (
              <option disabled>لا يوجد براندات للنظارات متاحة</option>
            )}
          </Form.Select>
        )}

        <Form.Control
          type='number'
          value={percent}
          onChange={handlePercentChange}
          placeholder='نسبة الخصم'
          className='my-3'
        />

        <Form.Check
          type='checkbox'
          className='m-2'
          checked={isGlassesChecked}
          onChange={() => handleCheckboxChange("glasses")}
          label='خصم للنظارات'
        />

        <Form.Check
          type='checkbox'
          className='m-2'
          checked={isLensesChecked}
          onChange={() => handleCheckboxChange("lenses")}
          label='خصم للعدسات'
        />
      </div>

      <div className='text-center'>
        <Button variant='primary' onClick={handleCreateOffer}>
          اضافة خصم
        </Button>
      </div>
    </div>
  );
};

export default AddDiscount;
