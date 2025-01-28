import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const EditModal = ({
  show,
  onHide,
  product_name,
  setproduct_name,
  salary,
  setsalary,
  model_number,
  setmodel_number,
  handleEditGlasses,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <h6>تعديل المنتج</h6>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div dir="rtl" className="form-group">
            <label className="my-2">اسم المنتج:</label>
            <input
              type="text"
              className="form-control"
              value={product_name}
              onChange={(e) => setproduct_name(e.target.value)}
            />
          </div>
          <div dir="rtl" className="form-group">
            <label className="my-2">سعر المنتج:</label>
            <input
              type="number"
              className="form-control"
              value={salary}
              onChange={(e) => setsalary(e.target.value)}
            />
          </div>
          <div dir="rtl" className="form-group">
            <label className="my-2">موديل المنتج:</label>
            <input
              type="number"
              className="form-control"
              value={model_number}
              onChange={(e) => setmodel_number(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          إغلاق
        </Button>
        <Button variant="primary" onClick={handleEditGlasses}>
          {loading ? <Spinner /> : " حفظ التغييرات"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
