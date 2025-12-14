import React, { useEffect, useState } from "react";
import Pagnation from "../components/pagnation/Pagnation";
import DeleateGlasses from "../Hook/admin/DeleateGlasses";
import ProductCard from "../components/card/ProductCard";
import DeleteModal from "../components/modal/DeleteModal";
import { Form, Button, Accordion } from "react-bootstrap";
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import baseUrl from "../api/baseUrl";
import ScrollToTop from "../components/scollToTop/ScrollToTop";

const availableFrames = ["Full Frame", "Half Frame", "Rimless"];
const availableBrands = ["Ray-Ban", "Gucci", "Prada", "Tom Ford"];
const availableColors = ["Black", "Brown", "Blue", "Gold", "Silver"];

const ViewAllProducts = ({ offers }) => {
  const { id } = useParams()

  const additionalFilters = {}
  if (id) {
    // For categories pages - use the category ID from URL params
    additionalFilters.categoryId = id
  } else if (offers) {
    // For offers page
    additionalFilters.isDiscount = true
  }

  const [filter, setFilter] = useState({
    ...additionalFilters,
    limit: 30,
    skip: 0,
    orderBy: "createdAt",
    orderType: "desc",
    colors: [],
    brands: [],
    framesTypes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (id) {
          // Use the new category-specific API endpoint
          const response = await baseUrl.get(`api/products/category/${id}`, {
            params: {
              limit: filter.limit,
              skip: filter.skip,
              orderBy: filter.orderBy,
              orderType: filter.orderType,
              minPrice: filter.minPrice,
              maxPrice: filter.maxPrice,
              colors: filter.colors,
              brands: filter.brands,
              framesTypes: filter.framesTypes
            }
          });
          data = response.data;
        } else {
          // Fallback to general products API for offers or other cases
          const response = await baseUrl.get('/products', {
            params: filter
          });
          data = response.data;
        }
        
        // معالجة البيانات من الـ API
        console.log('API Response:', data);
        const productsData = data.data || data.products || [];
        const totalCountData = data.count || data.totalCount || 0;
        
        console.log('Products Data:', productsData);
        console.log('Total Count:', totalCountData);
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalCount(typeof totalCountData === 'number' ? totalCountData : 0);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("فشل في جلب المنتجات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filter, id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilter((prevFilter) => ({
      ...prevFilter,
      skip: (page - 1) * prevFilter.limit,
    }));
  };

  const changeFilter = (key, val) => {
    setFilter((prevFilter) => {
      if (["colors", "framesTypes", "brands"].includes(key)) {
        let updatedArray = prevFilter[key] || [];
        if (val) {
          if (!updatedArray.includes(val)) {
            updatedArray = [...updatedArray, val];
          }
        } else {
          updatedArray = updatedArray.filter((item) => item !== val);
        }
        return { ...prevFilter, [key]: updatedArray };
      }
      return { ...prevFilter, [key]: val };
    });
  };

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();


  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setProductToDelete(null);
  };

  if (error) {
    return (
      <div className='products-page' style={{ minHeight: "80vh" }}>
        <div className='d-flex justify-content-center align-items-center h-100'>
          <div className='text-center'>
            <div className='text-danger mb-3'>
              <i className='fas fa-exclamation-triangle fa-3x'></i>
            </div>
            <h4 className='text-danger'>{error}</h4>
            <p className='text-muted'>يرجى المحاولة مرة أخرى لاحقاً</p>
            <Button 
              variant='primary' 
              onClick={() => window.location.reload()}
              className='mt-3'
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='products-page' style={{ minHeight: "80vh" }}>
        <div className='products-container'>
          {/* Loading skeleton for filter sidebar */}
          <div className='filter-sidebar'>
            <div className='filter-header'>
              <div className='skeleton-icon'></div>
              <div className='skeleton-title'></div>
            </div>
            
            {/* Skeleton for filter sections */}
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className='skeleton-filter-section mb-3'>
                <div className='skeleton-filter-header'></div>
                <div className='skeleton-filter-content'>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className='skeleton-filter-item'></div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className='skeleton-reset-button'></div>
          </div>

          {/* Loading skeleton for products grid */}
          <div className="products-grid">
            <div className='products-wrapper'>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className='skeleton-product-card'>
                  <div className='skeleton-card-image'></div>
                  <div className='skeleton-card-content'>
                    <div className='skeleton-product-title'></div>
                    <div className='skeleton-product-specs'>
                      <div className='skeleton-spec-item'></div>
                      <div className='skeleton-spec-item'></div>
                    </div>
                    <div className='skeleton-price-section'>
                      <div className='skeleton-price'></div>
                      <div className='skeleton-button'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Skeleton Loading Styles */
          .skeleton-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
          }
          
          .skeleton-title {
            height: 24px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
            width: 120px;
            margin-right: 10px;
          }
          
          .skeleton-filter-section {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
          }
          
          .skeleton-filter-header {
            height: 20px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            width: 80px;
            margin-bottom: 15px;
          }
          
          .skeleton-filter-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .skeleton-filter-item {
            height: 16px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            width: 100%;
          }
          
          .skeleton-reset-button {
            height: 40px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
            width: 100%;
            margin-top: 20px;
          }
          
          .skeleton-product-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            height: 380px;
          }
          
          .skeleton-card-image {
            height: 250px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          
          .skeleton-card-content {
            padding: 15px;
          }
          
          .skeleton-product-title {
            height: 20px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            width: 80%;
            margin-bottom: 12px;
          }
          
          .skeleton-product-specs {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
          }
          
          .skeleton-spec-item {
            height: 16px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            width: 60px;
          }
          
          .skeleton-price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #e9ecef;
          }
          
          .skeleton-price {
            height: 24px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
            width: 80px;
          }
          
          .skeleton-button {
            height: 35px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 50%;
            width: 35px;
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className='products-page' style={{ minHeight: "80vh", backgroundColor: "var(--bg-primary)" }}>
      <style jsx>{`
        .products-page {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .products-container {
          display: flex;
          gap: 20px;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .filter-sidebar {
          width: 280px;
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px var(--shadow);
          border: 1px solid var(--border-color);
          position: sticky;
          top: 20px;
          height: fit-content;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-icon {
          color: #0078FF;
          font-size: 1.2rem;
        }

        .filter-header h4 {
          color: var(--text-primary);
        }

        .products-grid {
          flex: 1;
        }

        .products-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .accordion-item {
          background: var(--bg-secondary);
          border-color: var(--border-color);
        }

        .accordion-button {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .accordion-button:not(.collapsed) {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .accordion-body {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .form-control {
          background: var(--bg-secondary);
          border-color: var(--border-color);
          color: var(--text-primary);
        }

        .form-control:focus {
          background: var(--bg-secondary);
          border-color: #0078FF;
          color: var(--text-primary);
        }

        .form-check-label {
          color: var(--text-primary);
        }

        [data-theme="dark"] .skeleton-icon,
        [data-theme="dark"] .skeleton-title,
        [data-theme="dark"] .skeleton-filter-header,
        [data-theme="dark"] .skeleton-filter-item,
        [data-theme="dark"] .skeleton-reset-button,
        [data-theme="dark"] .skeleton-product-card,
        [data-theme="dark"] .skeleton-card-image,
        [data-theme="dark"] .skeleton-product-title,
        [data-theme="dark"] .skeleton-spec-item,
        [data-theme="dark"] .skeleton-price,
        [data-theme="dark"] .skeleton-button {
          background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
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

        @media (max-width: 480px) {
          .products-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className='products-container'>
        {/* Sidebar Filter */}
        <div className='filter-sidebar'>
          <div className='filter-header'>
            <FaFilter className='filter-icon' />
            <h4 className="fw-bold" style={{ 
              fontFamily: 'var(--font-primary)', 
              fontSize: '1.5rem',
              color: '#2c3e50'
            }}>
              تصفية المنتجات
            </h4>
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
                      value={filter.minPrice || ""}
                      onChange={(e) => changeFilter("minPrice", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>إلى</Form.Label>
                    <Form.Control
                      type='number'
                      value={filter.maxPrice || ""}
                      onChange={(e) => changeFilter("maxPrice", e.target.value)}
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
                    variant={filter.orderType === "asc" ? "primary" : "outline-primary"}
                    className='w-100 mb-2'
                    onClick={() => changeFilter("orderType", "asc")}
                  >
                    <FaSortAmountUp className='me-2' />
                    من الأقل للأعلى
                  </Button>
                  <Button
                    variant={filter.orderType === "desc" ? "primary" : "outline-primary"}
                    className='w-100'
                    onClick={() => changeFilter("orderType", "desc")}
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
                      checked={filter.colors && filter.colors.includes(color)}
                      onChange={(e) => {
                        const val = e.target.checked ? color : false
                        changeFilter('colors', val)
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
                      checked={filter.brands && filter.brands.includes(brand)}
                      onChange={(e) => {
                        const val = e.target.checked ? brand : false
                        changeFilter('brands', val)
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
                  {availableFrames.map((frame) => (
                    <Form.Check
                      key={frame}
                      type='checkbox'
                      label={frame}
                      checked={filter.frames && filter.frames.includes(frame)}
                      onChange={(e) => {
                        const val = e.target.checked ? frame : false
                        changeFilter('framesTypes', val)
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
              setFilter({ 
                ...additionalFilters,
                limit: 30, 
                skip: 0, 
                orderBy: "createdAt", 
                orderType: "desc",
                colors: [],
                brands: [],
                framesTypes: []
              })
            }}
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products && products.length > 0 ? (
            <div className='products-wrapper'>
              {products.map((product) => (
                <ProductCard
                  href={`/product/${product.id}`}
                  key={product.id}
                  product={product}
                  openDeleteModal={openDeleteModal}
                />
              ))}
            </div>
          ) : (
            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "60vh" }}>
              <div className='text-center'>
                <div className='text-muted mb-3'>
                  <i className='fas fa-box-open fa-3x'></i>
                </div>
                <h4 className='text-muted'>لا توجد منتجات</h4>
                <p className='text-muted'>لا توجد منتجات متاحة في هذا التصنيف حالياً</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {products && products.length > 0 && totalCount > filter.limit && (
            <div className="pagination-wrapper">
              <Pagnation
                setPage={handlePageChange}
                pageCount={Math.ceil(totalCount / filter.limit)}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteModal
        show={deleteModalIsOpen}
        onHide={closeDeleteModal}
        productToDelete={productToDelete}
        deleteGlasses={deleteGlasses}
        loading={deleteLoading}
      />
      <ScrollToTop/>
    </div>
  );
};

export default ViewAllProducts;
