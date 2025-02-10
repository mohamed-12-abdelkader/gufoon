import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MdDelete } from "react-icons/md";
import GitAllOffer from "../../Hook/admin/GitAllOffer";
import DeleatOffer from "../../Hook/admin/DeleatOffer";

const ManageSalary = () => {
  const [id, setId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleClick = (newId) => {
    setId(newId);
  };
  const [deleteLoading, deleteOffer] = DeleatOffer({ off_id: id });
  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOffer(null);
  };

  const [loadingOffers, offers] = GitAllOffer({ id: id });

  if (loadingOffers) {
    return <h1>جاااار التحميل .....</h1>;
  }


  return (
    <div>
      <div className="flex justify-center">
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => handleClick(1)}
        >
          خصومات النظارات
        </Button>
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => handleClick(2)}
        >
          خصومات العدسات
        </Button>
      </div>
      {id === 1 ? (
        <div className="text-center my-3">
          <h6> خصومات النظارات </h6>
        </div>
      ) : id === 2 ? (
        <div className="text-center my-3">
          <h6> خصومات العدسات </h6>
        </div>
      ) : (
        ""
      )}
      <div>
        {offers ? (
          <div>
            {offers.map((off) => (
              <div
                key={off.brand_id}
                className="w-[100%] h-[50px] border shadow my-3 flex justify-between items-center p-2"
                style={{ borderRadius: "10px" }}
              >
                <div>
                  <h6>براند الخصم : {off.brand_name}</h6>
                </div>
                <div>
                  <h6>نسبة الخصم : %{off.percent}</h6>
                </div>
                <div>
                  <MdDelete
                    className="text-red-500 text-xl"
                    onClick={() => handleDeleteClick(off)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h6>لا يوجد منتجات </h6>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <p>هل أنت متأكد من حذف البراند {selectedOffer.brand_name}؟</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteOffer(selectedOffer.brand_id);
            }}
          >
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSalary;
