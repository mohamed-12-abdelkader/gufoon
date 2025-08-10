import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoCodeSquare } from "react-icons/go";
import { Card, Placeholder, Row, Col } from "react-bootstrap";
import "swiper/css";
import "swiper/css/pagination";
import { addToCart } from "../../Hook/addToCart/AddToCart";
import EditeProduct from "../../Hook/admin/EditeProduct";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import ProductCard from "../card/ProductCard";
import EditModal from "../modal/EditModal";
import DeleteModal from "../modal/DeleteModal";
import Slider from "../slider/Slider";
import { getDiscountedGlasses } from "../../utils/services";

const SectionThree = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDiscountedGlasses() {
      setLoading(true);
      setError(null);

      try {
        const data = await getDiscountedGlasses({ limit: 10, skip: 0, orderBy: 'price', orderType: 'asc' });
        setProducts(data?.data || []);
      } catch (err) {
        setError('فشل في جلب النظارات المخفضة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    }

    fetchDiscountedGlasses();
  }, []);

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
    editLoading,
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
    setproduct_name(product.name);
    setsalary(product.price);
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
    
      <div className='h-[60px] w-[95%] p-2 m-auto flex justify-between items-center border shadow my-5 bg-white'>
        <div>
          <Link className='flex' to='/offers'>
            <GoCodeSquare className='mx-2 my-1' />
            <h6>عرض المزيد</h6>
          </Link>
        </div>
        <div>
          <h5>خصومات على النظارات</h5>
        </div>
      </div>
      <div>
        {loading ? (
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
        ) :
          products.length ? (
            <Slider>
              {products.map((product) => (
                <ProductCard
                  href={`/product/${product.id}`}
                  key={product.id}
                  product={product}
                  handleAddToCart={handleAddToCart}
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
          handleEditGlasses(editedProduct.id);
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
