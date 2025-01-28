import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { GoCodeSquare } from "react-icons/go";
import { Spinner, Card, Placeholder, Button, Row, Col } from "react-bootstrap";
import "swiper/css";
import "swiper/css/pagination";
import { addToCart } from "../../Hook/addToCart/AddToCart";
import GitOffer from "../../Hook/offerProducts/GitOffer";
import UserType from "../../Hook/userType/UserType";
import EditeProduct from "../../Hook/admin/EditeProduct";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import ProductCard from "../card/ProductCard";
import EditModal from "../modal/EditModal";
import DeleteModal from "../modal/DeleteModal";
import Slider from "../slider/Slider";

const SectionThree = () => {
  const [userData, isAdmin, user] = UserType();
  const [offerProducts, offerProductsLoading] = GitOffer({ id: 1 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();
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
    const walk = (x - startX) * 3; // سرعة السحب
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const openEditModal = (product) => {
    setEditedProduct(product);
    setproduct_name(product.product_name);
    setsalary(product.salary_before);
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
    <div className='slider my-5 bg-barble-500 p-3 bg-[#]'>
      <img
        src={"df058ee4-f4d3-46b8-a050-3cde3f537e04.jpg"}
        className='w-[95%] m-auto h-[250px]'
        style={{ borderRadius: "10px" }}
      />
      <div className='h-[60px] w-[95%] p-2 m-auto flex justify-between items-center border shadow my-5 bg-white'>
        <div>
          <Link className='flex' to='/glasses_offer'>
            <GoCodeSquare className='mx-2 my-1' />
            <h6>عرض المزيد</h6>
          </Link>
        </div>
        <div>
          <h5>خصومات على النظارات</h5>
        </div>
      </div>
      <div>
        {offerProductsLoading ? (
          <Row>
            {[...Array(3)].map((_, index) => (
              <Col key={index} md={4} className='mb-4 '>
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
        ) : offerProducts &&
          offerProducts.data &&
          offerProducts.data.length > 0 ? (
          <Slider>
            {offerProducts.data.map((glasse) => (
              <ProductCard
                href={`/product/${glasse.product_id}/${glasse.type_id}`}
                key={glasse.product_id}
                glasse={glasse}
                isAdmin={isAdmin}
                handleAddToCart={handleAddToCart}
                loadingItems={loadingItems}
                openDeleteModal={openDeleteModal}
                openEditModal={openEditModal}
              />
            ))}
          </Slider>
        ) : (
          <Card className='text-center'>
            <Card.Body>
              <h5>لا يوجد منتجات</h5>
            </Card.Body>
          </Card>
        )}
      </div>
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
        deleteGlasses={deleteGlasses}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SectionThree;
