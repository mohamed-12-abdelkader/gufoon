import React, { useState } from "react";
import GitProducts from "../../Hook/gitProduct/GitProducts";
import Pagnation from "../pagnation/Pagnation";
import { addToCart } from "../../Hook/addToCart/AddToCart";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import EditeProduct from "../../Hook/admin/EditeProduct";
import ProductCard from "../card/ProductCard";
import EditModal from "../modal/EditModal";
import DeleteModal from "../modal/DeleteModal";
import UserType from "../../Hook/userType/UserType";
import { Form, Button, Accordion } from "react-bootstrap";
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const ViewAllProducts = ({ id }) => {
  const [page, setPage] = useState(1);
  const [products, productsLoading] = GitProducts({ id: id, page: page });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();
  const [userData, isAdmin, user] = UserType();
  const [loadingItems, setLoadingItems] = useState({});

  // فلاتر جديدة
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState([]);

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

  // الألوان المتاحة
  const availableColors = ["Black", "Brown", "Blue", "Gold", "Silver"];
  const availableBrands = ["Ray-Ban", "Gucci", "Prada", "Tom Ford"];
  const frameTypes = ["Full Frame", "Half Frame", "Rimless"];

  // تصفية المنتجات
  const filterProducts = () => {
    if (!products?.result) return [];

    let filteredProducts = [...products.result];

    // فلتر السعر
    if (priceRange.min !== "" || priceRange.max !== "") {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.salary_before || product.salary;
        return (
          (priceRange.min === "" || price >= Number(priceRange.min)) &&
          (priceRange.max === "" || price <= Number(priceRange.max))
        );
      });
    }

    // فلتر الألوان
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedColors.includes(product.frame_color)
      );
    }

    // فلتر الماركات
    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedBrands.includes(product.brand_name)
      );
    }

    // فلتر نوع الإطار
    if (selectedFrameTypes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedFrameTypes.includes(product.frame_type)
      );
    }

    // الترتيب
    if (sortBy) {
      filteredProducts.sort((a, b) => {
        const priceA = a.salary_before || a.salary;
        const priceB = b.salary_before || b.salary;
        return sortBy === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return filteredProducts;
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

  if (productsLoading) {
    return (
      <div
        className='flex justify-center items-center'
        style={{ minHeight: "80vh" }}
      >
        جار التحميل ...........
      </div>
    );
  }
  if (!products) {
    return (
      <div
        className='flex justify-center items-center'
        style={{ minHeight: "80vh" }}
      >
        لا يوجد منتجات ...........
      </div>
    );
  }
  console.log(products);
  return (
    <div className='products-page' style={{ minHeight: "80vh" }}>
      <div className='products-container'>
        {/* Sidebar Filter */}
        <div className='filter-sidebar'>
          <div className='filter-header'>
            <FaFilter className='filter-icon' />
            <h4>تصفية المنتجات</h4>
          </div>

          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>السعر</Accordion.Header>
              <Accordion.Body>
                <div className='price-range'>
                  <Form.Group className='mb-3'>
                    <Form.Label>من</Form.Label>
                    <Form.Control
                      type='number'
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>إلى</Form.Label>
                    <Form.Control
                      type='number'
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </Form.Group>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='1'>
              <Accordion.Header>ترتيب حسب السعر</Accordion.Header>
              <Accordion.Body>
                <div className='sort-options'>
                  <Button
                    variant={sortBy === "asc" ? "primary" : "outline-primary"}
                    className='w-100 mb-2'
                    onClick={() => setSortBy("asc")}
                  >
                    <FaSortAmountUp className='me-2' />
                    من الأقل للأعلى
                  </Button>
                  <Button
                    variant={sortBy === "desc" ? "primary" : "outline-primary"}
                    className='w-100'
                    onClick={() => setSortBy("desc")}
                  >
                    <FaSortAmountDown className='me-2' />
                    من الأعلى للأقل
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='2'>
              <Accordion.Header>اللون</Accordion.Header>
              <Accordion.Body>
                <div className='color-options'>
                  {availableColors.map((color) => (
                    <Form.Check
                      key={color}
                      type='checkbox'
                      label={color}
                      checked={selectedColors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColors([...selectedColors, color]);
                        } else {
                          setSelectedColors(
                            selectedColors.filter((c) => c !== color)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='3'>
              <Accordion.Header>الماركة</Accordion.Header>
              <Accordion.Body>
                <div className='brand-options'>
                  {availableBrands.map((brand) => (
                    <Form.Check
                      key={brand}
                      type='checkbox'
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(
                            selectedBrands.filter((b) => b !== brand)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey='4'>
              <Accordion.Header>نوع الإطار</Accordion.Header>
              <Accordion.Body>
                <div className='frame-type-options'>
                  {frameTypes.map((type) => (
                    <Form.Check
                      key={type}
                      type='checkbox'
                      label={type}
                      checked={selectedFrameTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFrameTypes([...selectedFrameTypes, type]);
                        } else {
                          setSelectedFrameTypes(
                            selectedFrameTypes.filter((t) => t !== type)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Button
            variant='outline-secondary'
            className='reset-filters mt-3 w-100'
            onClick={() => {
              setPriceRange({ min: "", max: "" });
              setSortBy("");
              setSelectedColors([]);
              setSelectedBrands([]);
              setSelectedFrameTypes([]);
            }}
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>

        {/* Products Grid */}
        <div className='products-grid'>
          {productsLoading ? (
            <div className='loading-message'>جار التحميل ...........</div>
          ) : !products ? (
            <div className='no-products-message'>
              لا يوجد منتجات ...........
            </div>
          ) : (
            <>
              <div className='products-wrapper'>
                {filterProducts().map((product) => (
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
              <div className='pagination-wrapper'>
                <Pagnation
                  id={id}
                  setPage={setPage}
                  pageCount={products.totalPages}
                  currentPage={page}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
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

      <style jsx>{`
        .products-page {
          padding: 20px;
          background-color: #f8f9fa;
        }

        .products-container {
          display: flex;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .filter-sidebar {
          width: 300px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .filter-icon {
          color: #4b6cb7;
          font-size: 1.2rem;
        }

        .products-grid {
          flex: 1;
        }

        .products-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .loading-message,
        .no-products-message {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #666;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .price-range,
        .sort-options,
        .color-options,
        .brand-options,
        .frame-type-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .products-container {
            flex-direction: column;
          }

          .filter-sidebar {
            width: 100%;
            position: static;
          }

          .products-wrapper {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ViewAllProducts;
