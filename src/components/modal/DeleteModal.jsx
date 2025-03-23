import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeleteModal = ({
  show,
  onHide,
  productToDelete,
  deleteGlasses,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <h6>تأكيد الحذف</h6>
      </Modal.Header>
      <Modal.Body>
        {productToDelete && productToDelete.id}؟ هل تريد حقًا حذف{" "}
        {productToDelete && productToDelete.name}؟
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          إغلاق
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            deleteGlasses(productToDelete.id);
          }}
        >
          {loading ? <Spinner /> : "حذف"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
