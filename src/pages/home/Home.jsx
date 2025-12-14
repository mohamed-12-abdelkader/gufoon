import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import SectionOne from "../../components/home/SectionOne";
import ProductCard from "../../components/card/ProductCard";
import DeleteModal from "../../components/modal/DeleteModal";
import UserType from "../../Hook/userType/UserType";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import SectionTwo from "../../components/home/SectionTwo";
import Slider from "../../components/slider/Slider";
import { Link } from "react-router-dom";
import baseUrl from "../../api/baseUrl";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();
  
  const [userData, isAdmin, user] = UserType();
  console.log(isAdmin);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);
        const { data } = await baseUrl.get("/api/categories/homepage");
        // التأكد من أن البيانات هي array وأن كل تصنيف له products
        const validCategories = Array.isArray(data) ? data.map(category => ({
          ...category,
          products: Array.isArray(category.products) ? category.products : []
        })) : [];
        setCategories(validCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("حدث خطأ في تحميل التصنيفات");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setProductToDelete(null);
  };

    return (
    <>
     <SectionOne/>
     <SectionTwo/>
    <div className="py-5 w-[90%] mx-auto" dir="rtl">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted" style={{ 
              fontFamily: 'var(--font-primary)',
              fontSize: '1.1rem'
            }}>
              جاري تحميل المنتجات...
            </p>
          </div>
      </div>
      ) : error ? (
        <div className="d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle fa-3x"></i>
          </div>
            <h4 className="text-danger" style={{ 
              fontFamily: 'var(--font-primary)'
            }}>
              {error}
            </h4>
            <p className="text-muted" style={{ 
              fontFamily: 'var(--font-primary)'
            }}>
              يرجى المحاولة مرة أخرى لاحقاً
            </p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="mt-3"
              style={{ 
                fontFamily: 'var(--font-primary)'
              }}
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
      ) : categories && Array.isArray(categories) ? categories.map((category) => (
         <div key={category.id} className="mb-5">
           {/* الكارت الخاص بالتصنيف */}
           <Card className="mb-4 border-0 h-[100px] bg-blue-500 shadow-sm rounded-4 p-3">
             <Card.Body className="d-flex justify-content-between align-items-center">
               <div>
                 <Card.Title className="fs-3 fw-bold text-primary mb-0" style={{ 
                   fontFamily: 'var(--font-primary)', 
                   fontSize: '2rem',
                   fontWeight: '700',
                   color: '#0078FF'
                 }}>
                   {category.name}
                 </Card.Title>
                 <Card.Text className="text-muted mt-1" style={{ 
                   fontFamily: 'var(--font-primary)',
                   fontSize: '1.1rem',
                   fontWeight: '400'
                 }}>
                   {category.description}
                 </Card.Text>
               </div>
              <Link to={`/categories/${category.id}`}>
              <Button
                variant="outline-primary"
                className="fw-semibold rounded-pill px-4"
                style={{ 
                  fontFamily: 'var(--font-primary)',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
                >
                عرض المزيد
              </Button>
                </Link>
            </Card.Body>
          </Card>

           {/* المنتجات الخاصة بالتصنيف */}
           {/* Slider للموبايل */}
           <div className="mobile-products-slider d-md-none">
             {category.products && Array.isArray(category.products) && category.products.length > 0 ? (
               <Slider>
                 {category.products.map((product) => (
                   <div key={product.id} className="product-slide-item" style={{ minWidth: "280px", margin: "0 10px" }}>
                     <ProductCard 
                       product={product}
                       openDeleteModal={openDeleteModal}
                       href={`/product/${product.id}`}
                     />
                   </div>
                 ))}
               </Slider>
             ) : (
               <div className="text-center py-4">
                 <p className="text-muted">لا توجد منتجات في هذا التصنيف</p>
               </div>
             )}
           </div>

           {/* Grid للشاشات الكبيرة */}
           <div className="desktop-products-grid d-none d-md-block">
           <Row xs={1} sm={2} md={3} lg={4} className="g-4">
             {category.products && Array.isArray(category.products) ? category.products.map((product) => (
               <Col key={product.id}>
                 <ProductCard 
                   product={product}
                   openDeleteModal={openDeleteModal}
                   href={`/product/${product.id}`}
                 />
               </Col>
             )) : (
               <Col>
                 <div className="text-center py-4">
                   <p className="text-muted">لا توجد منتجات في هذا التصنيف</p>
                 </div>
               </Col>
             )}
           </Row>
           </div>
        </div>
      )) : (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>لا توجد تصنيفات متاحة</h4>
            <p>جاري تحميل التصنيفات...</p>
          </div>
        </div>
      )}
    </div>

    {/* Delete Modal */}
    <DeleteModal
      show={deleteModalIsOpen}
      onHide={closeDeleteModal}
      productToDelete={productToDelete}
      deleteGlasses={deleteGlasses}
      loading={deleteLoading}
    />
    
    <style>{`
      .mobile-products-slider {
        margin: 1rem 0;
      }
      
      .product-slide-item {
        display: inline-block;
        vertical-align: top;
      }
      
      .mobile-products-slider .slider-container {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        gap: 1rem;
        padding: 0.5rem 0;
      }
      
      .mobile-products-slider .slider-container::-webkit-scrollbar {
        display: none;
      }
      
      .mobile-products-slider .slider-container.active {
        cursor: grabbing;
        cursor: -webkit-grabbing;
      }
      
      @media (max-width: 767px) {
        .mobile-products-slider {
          margin: 1rem -10px;
        }
        
        .product-slide-item {
          min-width: 260px !important;
          margin: 0 8px !important;
        }
      }
      
      @media (min-width: 768px) {
        .desktop-products-grid {
          display: block !important;
        }
      }
    `}</style>
          </>
  );
};

export default Home;
