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

/** عدد المنتجات في كل صفحة — غيّر القيمة لاحقاً عند زيادة عدد المنتجات */
const PRODUCTS_PER_PAGE = 12;

function getTotalCountFromApi(data) {
  if (!data || typeof data !== "object") return 0;

  const pick = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const v =
      obj.count ??
      obj.totalCount ??
      obj.total ??
      obj.pagination?.total ??
      obj.meta?.total;
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const top = pick(data);
  if (top != null) return top;

  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const nested = pick(inner);
    if (nested != null) return nested;
  }

  return 0;
}

const ViewAllProducts = ({ offers }) => {
  const { id } = useParams();

  const additionalFilters = {};
  if (id) {
    // For categories pages - use the category ID from URL params
    additionalFilters.categoryId = id;
  } else if (offers) {
    // For offers page
    additionalFilters.isDiscount = true;
  }

  const [filter, setFilter] = useState({
    ...additionalFilters,
    limit: PRODUCTS_PER_PAGE,
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
              framesTypes: filter.framesTypes,
            },
          });
          data = response.data;
        } else {
          // Fallback to general products API for offers or other cases
          const response = await baseUrl.get("/products", {
            params: filter,
          });
          data = response.data;
        }

        // معالجة البيانات من الـ API
        console.log("API Response:", data);
        const productsData = data.data || data.products || [];
        const totalCountParsed = getTotalCountFromApi(data);

        console.log("Products Data:", productsData);
        console.log("Total Count:", totalCountParsed);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalCount(totalCountParsed);
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
    setCurrentPage(1);
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
        return { ...prevFilter, [key]: updatedArray, skip: 0 };
      }
      return { ...prevFilter, [key]: val, skip: 0 };
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
      <div className="products-page" style={{ minHeight: "80vh" }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-center">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
            </div>
            <h4 className="text-danger">{error}</h4>
            <p className="text-muted">يرجى المحاولة مرة أخرى لاحقاً</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="mt-3"
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
      <div className="products-page products-page--loading">
        <div className="products-container">
          {/* Loading skeleton for filter sidebar */}
          <div className="filter-sidebar">
            <div className="filter-header">
              <div className="skeleton-icon"></div>
              <div className="skeleton-title"></div>
            </div>

            {/* Skeleton for filter sections */}
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className="skeleton-filter-section mb-3">
                <div className="skeleton-filter-header"></div>
                <div className="skeleton-filter-content">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="skeleton-filter-item"></div>
                  ))}
                </div>
              </div>
            ))}

            <div className="skeleton-reset-button"></div>
          </div>

          {/* Loading skeleton for products grid */}
          <div className="products-grid">
            <div className="products-wrapper">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="skeleton-product-card">
                  <div className="skeleton-card-image"></div>
                  <div className="skeleton-card-content">
                    <div className="skeleton-product-title"></div>
                    <div className="skeleton-product-specs">
                      <div className="skeleton-spec-item"></div>
                      <div className="skeleton-spec-item"></div>
                    </div>
                    <div className="skeleton-price-section">
                      <div className="skeleton-price"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          .products-page--loading {
            min-height: 80vh;
            background: linear-gradient(
              180deg,
              var(--bg-secondary) 0%,
              var(--bg-primary) 42%,
              var(--bg-primary) 100%
            );
          }

          .products-container {
            display: flex;
            gap: clamp(16px, 2.5vw, 28px);
            padding: clamp(16px, 3vw, 32px);
            max-width: 1440px;
            margin: 0 auto;
            align-items: flex-start;
          }

          .filter-sidebar {
            width: 300px;
            flex-shrink: 0;
            background: var(--card-bg);
            padding: 22px;
            border-radius: 16px;
            box-shadow: 0 2px 12px var(--shadow);
            border: 1px solid var(--border-color);
          }

          .products-grid {
            flex: 1;
            min-width: 0;
          }

          .products-wrapper {
            display: grid;
            gap: clamp(16px, 2vw, 22px);
            grid-template-columns: 1fr;
            margin-bottom: 30px;
          }

          @media (min-width: 576px) {
            .products-wrapper {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (min-width: 1024px) {
            .products-wrapper {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          @media (max-width: 991px) {
            .products-container {
              flex-direction: column;
            }
            .filter-sidebar {
              width: 100%;
            }
          }

          /* Skeleton Loading Styles */
          .skeleton-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
          }

          .skeleton-title {
            height: 24px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
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
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
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
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            width: 100%;
          }

          .skeleton-reset-button {
            height: 40px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
            width: 100%;
            margin-top: 20px;
          }

          .skeleton-product-card {
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px var(--shadow);
            border: 1px solid var(--border-color);
            min-height: 380px;
            width: 100%;
            min-width: 0;
          }

          .skeleton-card-image {
            height: 250px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          .skeleton-card-content {
            padding: 15px;
          }

          .skeleton-product-title {
            height: 20px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
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
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
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
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
            width: 80px;
          }

          .skeleton-button {
            height: 35px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
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
    <div className="products-page">
      <style jsx>{`
        .products-page {
          min-height: 80vh;
          background: linear-gradient(
            180deg,
            var(--bg-secondary) 0%,
            var(--bg-primary) 42%,
            var(--bg-primary) 100%
          );
          color: var(--text-primary);
          transition:
            background-color 0.3s ease,
            color 0.3s ease;
        }

        .products-container {
          display: flex;
          gap: clamp(16px, 2.5vw, 28px);
          padding: clamp(16px, 3vw, 32px);
          max-width: 1440px;
          margin: 0 auto;
          align-items: flex-start;
        }

        .filter-sidebar {
          width: 300px;
          flex-shrink: 0;
          background: var(--card-bg);
          padding: 22px;
          border-radius: 16px;
          box-shadow:
            0 1px 3px var(--shadow),
            0 8px 24px -6px var(--shadow);
          border: 1px solid var(--border-color);
          position: sticky;
          top: 88px;
          height: fit-content;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-icon {
          color: #0078ff;
          font-size: 1.35rem;
          flex-shrink: 0;
        }

        .filter-title {
          font-family: var(--font-primary);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .products-grid {
          flex: 1;
          min-width: 0;
        }

        .products-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          padding: 14px 18px;
          background: var(--card-bg);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 12px var(--shadow);
        }

        .products-count {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .products-count strong {
          color: var(--text-primary);
          font-weight: 700;
        }

        .products-wrapper {
          display: grid;
          gap: clamp(16px, 2vw, 22px);
          grid-template-columns: 1fr;
          margin-bottom: 8px;
        }

        @media (min-width: 576px) {
          .products-wrapper {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .products-wrapper {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 12px 20px;
          margin-top: 16px;
          border-top: 1px solid var(--border-color);
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 120, 255, 0.03) 100%
          );
          border-radius: 0 0 4px 4px;
        }

        .empty-state-box {
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px dashed var(--border-color);
          padding: 48px 24px;
          max-width: 480px;
          margin: 0 auto;
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
          border-color: #0078ff;
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
          background: linear-gradient(
            90deg,
            var(--bg-tertiary) 25%,
            var(--bg-secondary) 50%,
            var(--bg-tertiary) 75%
          );
        }

        @media (max-width: 991px) {
          .products-container {
            flex-direction: column;
            gap: 18px;
            padding: 14px 14px 24px;
          }

          /* المنتجات أولاً، ثم الفلاتر أسفل — أوضح للموبايل */
          .products-grid {
            order: 1;
            width: 100%;
          }

          .filter-sidebar {
            order: 2;
            width: 100%;
            max-width: none;
            position: static;
            max-height: none;
            padding: 16px 14px 18px;
            border-radius: 14px;
            box-shadow:
              0 2px 8px var(--shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
          }

          .filter-header {
            margin-bottom: 14px;
            padding-bottom: 12px;
          }

          .filter-title {
            font-size: 1.12rem;
          }

          .filter-sidebar .accordion-item {
            border-radius: 10px !important;
            overflow: hidden;
            margin-bottom: 8px;
            border: 1px solid var(--border-color) !important;
          }

          .filter-sidebar .accordion-button {
            font-size: 0.92rem;
            font-weight: 600;
            padding: 14px 16px;
            min-height: 48px;
            box-shadow: none;
          }

          .filter-sidebar .accordion-button::after {
            margin-inline-start: auto;
          }

          .filter-sidebar .accordion-body {
            padding: 14px 16px 16px;
          }

          .filter-sidebar .price-range {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            align-items: start;
          }

          .filter-sidebar .price-range .mb-3 {
            margin-bottom: 0 !important;
          }

          .filter-sidebar .sort-options .btn {
            min-height: 46px;
            font-size: 0.9rem;
            border-radius: 10px;
          }

          .filter-sidebar .form-check {
            min-height: 2.25rem;
            padding-top: 4px;
            padding-bottom: 4px;
          }

          .filter-sidebar .form-check-input {
            width: 1.15em;
            height: 1.15em;
            margin-top: 0.2em;
          }

          .filter-sidebar .reset-filters {
            min-height: 48px;
            font-weight: 600;
            border-radius: 10px;
            margin-top: 12px !important;
          }

          .pagination-wrapper {
            padding: 20px 8px 16px;
            margin-top: 12px;
          }
        }

        @media (max-width: 575px) {
          .products-toolbar {
            padding: 12px 14px;
            border-radius: 12px;
          }

          .products-count {
            font-size: 0.88rem;
            line-height: 1.4;
          }

          .filter-title {
            font-size: 1.05rem;
          }

          .filter-sidebar {
            padding: 14px 12px 16px;
          }

          .filter-sidebar .accordion-button {
            font-size: 0.88rem;
            padding: 12px 12px;
          }

          .filter-sidebar .accordion-body {
            padding: 12px 12px 14px;
          }
        }
      `}</style>
      <div className="products-container">
        {/* Sidebar Filter */}
        <div className="filter-sidebar">
          <div className="filter-header">
            <FaFilter className="filter-icon" />
            <h4 className="filter-title">تصفية المنتجات</h4>
          </div>

          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>السعر</Accordion.Header>
              <Accordion.Body>
                <div className="price-range">
                  <Form.Group className="mb-3">
                    <Form.Label>من</Form.Label>
                    <Form.Control
                      type="number"
                      value={filter.minPrice || ""}
                      onChange={(e) => changeFilter("minPrice", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>إلى</Form.Label>
                    <Form.Control
                      type="number"
                      value={filter.maxPrice || ""}
                      onChange={(e) => changeFilter("maxPrice", e.target.value)}
                    />
                  </Form.Group>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>ترتيب حسب السعر</Accordion.Header>
              <Accordion.Body>
                <div className="sort-options">
                  <Button
                    variant={
                      filter.orderType === "asc" ? "primary" : "outline-primary"
                    }
                    className="w-100 mb-2"
                    onClick={() => changeFilter("orderType", "asc")}
                  >
                    <FaSortAmountUp className="me-2" />
                    من الأقل للأعلى
                  </Button>
                  <Button
                    variant={
                      filter.orderType === "desc"
                        ? "primary"
                        : "outline-primary"
                    }
                    className="w-100"
                    onClick={() => changeFilter("orderType", "desc")}
                  >
                    <FaSortAmountDown className="me-2" />
                    من الأعلى للأقل
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>اللون</Accordion.Header>
              <Accordion.Body>
                <div className="color-options">
                  {availableColors.map((color) => (
                    <Form.Check
                      key={color}
                      type="checkbox"
                      label={color}
                      checked={filter.colors && filter.colors.includes(color)}
                      onChange={(e) => {
                        const val = e.target.checked ? color : false;
                        changeFilter("colors", val);
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>الماركة</Accordion.Header>
              <Accordion.Body>
                <div className="brand-options">
                  {availableBrands.map((brand) => (
                    <Form.Check
                      key={brand}
                      type="checkbox"
                      label={brand}
                      checked={filter.brands && filter.brands.includes(brand)}
                      onChange={(e) => {
                        const val = e.target.checked ? brand : false;
                        changeFilter("brands", val);
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>نوع الإطار</Accordion.Header>
              <Accordion.Body>
                <div className="frame-type-options">
                  {availableFrames.map((frame) => (
                    <Form.Check
                      key={frame}
                      type="checkbox"
                      label={frame}
                      checked={
                        filter.framesTypes && filter.framesTypes.includes(frame)
                      }
                      onChange={(e) => {
                        const val = e.target.checked ? frame : false;
                        changeFilter("framesTypes", val);
                      }}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Button
            variant="outline-secondary"
            className="reset-filters mt-3 w-100"
            onClick={() => {
              setCurrentPage(1);
              setFilter({
                ...additionalFilters,
                limit: PRODUCTS_PER_PAGE,
                skip: 0,
                orderBy: "createdAt",
                orderType: "desc",
                colors: [],
                brands: [],
                framesTypes: [],
              });
            }}
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products && products.length > 0 ? (
            <>
              <div className="products-toolbar">
                <p className="products-count">
                  عرض <strong>{products.length}</strong> من{" "}
                  <strong>{totalCount}</strong> منتج
                </p>
              </div>
              <div className="products-wrapper">
                {products.map((product) => (
                  <ProductCard
                    href={`/product/${product.id}`}
                    key={product.id}
                    product={product}
                    openDeleteModal={openDeleteModal}
                  />
                ))}
              </div>
            </>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "50vh" }}
            >
              <div className="text-center empty-state-box">
                <div className="text-muted mb-3">
                  <i className="fas fa-box-open fa-3x"></i>
                </div>
                <h4 className="text-muted mb-2">لا توجد منتجات</h4>
                <p className="text-muted mb-0 small">
                  لا توجد منتجات متاحة في هذا التصنيف حالياً
                </p>
              </div>
            </div>
          )}

          {/* Pagination: يظهر عند وجود أكثر من صفحة واحدة */}
          {products &&
            products.length > 0 &&
            totalCount > 0 &&
            Math.ceil(totalCount / filter.limit) > 1 && (
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
      <ScrollToTop />
    </div>
  );
};

export default ViewAllProducts;
