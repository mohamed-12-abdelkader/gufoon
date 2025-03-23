import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AddDiscount = () => {
  const token = localStorage.getItem("token");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [percent, setPercent] = useState("");

  // Fetch brands from API
  useEffect(() => {
    const getBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/brands");
        setBrands(response.data);
      } catch (err) {
        setError("فشل تحميل البراندات");
      }
      setLoading(false);
    };

    getBrands();
  }, [token]);

  // Handle discount percentage input change
  const handlePercentChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 100) {
      setPercent(value);
    }
  };

  // Apply discount to brand's products
  const handleCreateOffer = async () => {
    if (!selectedBrand || !percent) {
      toast.error("الرجاء تحديد البراند وإدخال نسبة الخصم");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `/brands/discount/${selectedBrand}`,
        { discount: percent },
      );
      toast.success("تمت إضافة الخصم بنجاح");
      setPercent("");
      setSelectedBrand("");
    } catch (err) {
      toast.error("حدث خطأ أثناء إضافة الخصم");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="text-center">
        <h5 className="fw-bold">
          إضافة <span className="text-danger fs-4">خصم :</span>
        </h5>
      </div>

      <div className="my-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Select
          className="my-2"
          disabled={loading}
          style={{ direction: "ltr" }}
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option>{loading ? "جار تحميل البراندات..." : "اختر البراند"}</option>
          {loading ? (
            <option disabled>Loading...</option>
          ) : brands.length > 0 ? (
            brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))
          ) : (
            <option disabled>لا يوجد براندات متاحة</option>
          )}
        </Form.Select>

        <Form.Control
          type="number"
          value={percent}
          onChange={handlePercentChange}
          placeholder="نسبة الخصم"
          className="my-3"
        />
      </div>

      <div className="text-center">
        <Button variant="primary" onClick={handleCreateOffer} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "إضافة خصم"}
        </Button>
      </div>
    </div>
  );
};

export default AddDiscount;
