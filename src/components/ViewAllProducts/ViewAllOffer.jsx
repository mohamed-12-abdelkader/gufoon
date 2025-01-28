import React, { useState } from "react";
import Pagnation from "../pagnation/Pagnation";
import { addToCart } from "../../Hook/addToCart/AddToCart";
import GitOffer from "../../Hook/offerProducts/GitOffer";
import ProductCard from "../card/ProductCard";
import { Spinner } from "react-bootstrap";
import UserType from "../../Hook/userType/UserType";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import EditeProduct from "../../Hook/admin/EditeProduct";
import EditModal from "../modal/EditModal";
import DeleteModal from "../modal/DeleteModal";

const ViewAllOffer = ({ id }) => {
  const [userData, isAdmin, user] = UserType();
  const [page, setPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState(""); // حالة الفلترة
  const [loadingItems, setLoadingItems] = useState({});
  const [offerProducts, offerProductsLoading] = GitOffer({
    id: id,
    page: page,
    priceFilter: priceFilter, // تمرير priceFilter إلى GitOffer
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();

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

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value); // تحديث قيمة الفلترة
    setPage(1); // إعادة تعيين الصفحة عند تغيير الفلتر
  };

  if (offerProductsLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "80vh" }}
      >
        جار التحميل ...........
      </div>
    );
  }
  if (!offerProducts) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "80vh" }}
      >
        لا يوجد منتجات ...........
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* خانات الفلترة */}
      <div className="my-4 flex justify-center">
        <label>
          <input
            type="radio"
            name="price"
            value="low"
            onChange={handlePriceFilterChange}
          />{" "}
          أقل من 50
        </label>
        <label>
          <input
            type="radio"
            name="price"
            value="mid"
            onChange={handlePriceFilterChange}
          />{" "}
          من 50 إلى 100
        </label>
        <label>
          <input
            type="radio"
            name="price"
            value="high"
            onChange={handlePriceFilterChange}
          />{" "}
          أكثر من 100
        </label>
      </div>

      {/* عرض المنتجات */}
      <div className="my-[50px] mt-[100px] w-[90%] mx-auto flex justify-center flex-wrap">
        {offerProducts.data.map((product) => (
          <ProductCard
            key={product.product_id}
            glasse={product}
            isAdmin={isAdmin}
            handleAddToCart={handleAddToCart}
            loadingItems={loadingItems}
            openDeleteModal={openDeleteModal}
            openEditModal={openEditModal}
          />
        ))}
      </div>
      <div>
        <Pagnation
          id={id}
          setPage={setPage}
          pageCount={offerProducts.totalPages}
          currentPage={page}
        />
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

export default ViewAllOffer;
