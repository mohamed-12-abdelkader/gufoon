import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, Placeholder, Button, Row, Col } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import GitOffer from "../../Hook/offerProducts/GitOffer";
import ProductCard from "../card/ProductCard";
import EditModal from "../modal/EditModal";
import DeleteModal from "../modal/DeleteModal";
import { addToCart } from "../../Hook/addToCart/AddToCart";
import EditeProduct from "../../Hook/admin/EditeProduct";
import DeleateLenses from "../../Hook/admin/DeleateLenses";
import UserType from "../../Hook/userType/UserType";
import Slider from "../slider/Slider";

const SectionFour = () => {
  const [userData, isAdmin, user] = UserType();
  const [offerProducts, offerProductsLoading] = GitOffer({ id: 2 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [deleteLoading, deleteLenses] = DeleateLenses();
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const sliderRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [
    loading,
    product_name,
    model_number,
    salary,
    setproduct_name,
    setmodel_number,
    setsalary,
    handleEditGlasses,
  ] = EditeProduct();
  const [loadingItems, setLoadingItems] = useState({});

  const handleMouseDown = (e) => {
    setIsDown(true);
    sliderRef.current.classList.add("active");
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    sliderRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    setIsDown(false);
    sliderRef.current.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 3;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const openEditModal = (product) => {
    setEditedProduct(product);
    setproduct_name(product.product_name);
    setsalary(product.salary_before || product.salary);
    setmodel_number(product.model_number);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditedProduct(null);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setProductToDelete(null);
  };

  const handleAddToCart = async (product) => {
    setLoadingItems((prevLoading) => ({
      ...prevLoading,
      [product.product_id]: true,
    }));
    await addToCart(product);
    setLoadingItems((prevLoading) => ({
      ...prevLoading,
      [product.product_id]: false,
    }));
  };
  return (
    <div className='my-5 p-3'>
      <img
        src={"94254954-4641-453e-92f2-e136cbdf4081.jpg"}
        className='w-[95%] h-[250px] m-auto'
        alt='Offer'
      />
      <div className='h-[60px] w-[95%] p-2 m-auto flex justify-between items-center border shadow my-5 bg-white'>
        <div>
          <Link to='/lenses_offer'>
            <h6>عرض المزيد</h6>
          </Link>
        </div>
        <div>
          <h5>خصومات على العدسات</h5>
        </div>
      </div>

      {offerProductsLoading ? (
        <Row>
          {[...Array(3)].map((_, index) => (
            <Col key={index} md={4} className='mb-4  '>
              <Card>
                <Placeholder
                  as={Card.Img}
                  variant='top'
                  className='h-[200px]'
                />
                <Card.Body>
                  <Placeholder as={Card.Title} animation='glow'>
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation='glow'>
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />
                  </Placeholder>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : offerProducts && offerProducts.data?.length > 0 ? (
        <div
          dir='rtl'
          className='slider-container relative'
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <Slider>
            {offerProducts.data.map(
              (glasse) =>
                glasse?.product_id && (
                  <ProductCard
                    href={`/lenses/${glasse.product_id}`}
                    key={glasse.product_id}
                    glasse={glasse}
                    isAdmin={isAdmin}
                    handleAddToCart={handleAddToCart}
                    loadingItems={loadingItems}
                    openDeleteModal={openDeleteModal}
                    openEditModal={openEditModal}
                  />
                )
            )}
          </Slider>
        </div>
      ) : (
        <div>لا يوجد منتجات</div>
      )}

      <EditModal
        show={modalIsOpen}
        onHide={closeModal}
        product_name={product_name}
        setproduct_name={setproduct_name}
        salary={salary}
        setsalary={setsalary}
        model_number={model_number}
        setmodel_number={setmodel_number}
        handleEditGlasses={() => {
          handleEditGlasses(editedProduct.product_id);
          setTimeout(() => {
            closeModal();
            window.location.reload();
          }, 500);
        }}
        loading={loading}
      />

      <DeleteModal
        show={deleteModalIsOpen}
        onHide={closeDeleteModal}
        productToDelete={productToDelete}
        deleteGlasses={deleteLenses}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SectionFour;
