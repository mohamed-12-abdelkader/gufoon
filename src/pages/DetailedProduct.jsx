import React, { useEffect, useState } from "react";
import ScrollToTop from "../components/scollToTop/ScrollToTop";
import { Button, Carousel, Row, Col, Badge } from "react-bootstrap";
import { FaCartPlus, FaShippingFast, FaRegClock, FaShoppingBag } from "react-icons/fa";
import { BsBox2Heart, BsStarFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getProductById } from "../utils/services";
import { toast } from "react-toastify";
import UserType from "../Hook/userType/UserType";
import BuyNowModal from "../components/modal/BuyNowModal";
import AuthRequiredModal from "../components/modal/AuthRequiredModal";
import LoginModal from "../components/modal/LoginModal";
import SignupModal from "../components/modal/SignupModal";
import { useCart } from "../contexts/CartContext";

const DetailedProduct = () => {
  const { product_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [index, setIndex] = useState(0);
  
  // Modal states
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // User authentication
  const [userData, isAdmin, user] = UserType();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await getProductById(product_id);
        setProduct(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!userData) {
      setShowAuthRequiredModal(true);
      return;
    }

    try {
      await addToCart(product);
      // Toast message is handled by CartContext
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("خطأ في إضافة المنتج للسلة، حاول مجدداً");
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!userData) {
      setShowAuthRequiredModal(true);
      return;
    }
    setShowBuyNowModal(true);
  };

  // Handle Auth Required Modal Actions
  const handleShowLoginModal = () => {
    setShowAuthRequiredModal(false);
    setShowLoginModal(true);
  };

  const handleShowSignupModal = () => {
    setShowAuthRequiredModal(false);
    setShowSignupModal(true);
  };

  // Close all modals
  const handleCloseAllModals = () => {
    setShowBuyNowModal(false);
    setShowAuthRequiredModal(false);
    setShowLoginModal(false);
    setShowSignupModal(false);
  };


  if (loading) return (
    <div className='product-details-page' dir='rtl'>
      <div className='product-header py-4 bg-primary text-white'>
        <div className='container'>
          <div className='skeleton-title'></div>
          <div className='skeleton-subtitle'></div>
        </div>
      </div>

      <div className='container py-5'>
        <Row className='g-4'>
          {/* Loading skeleton for product images */}
          <Col lg={6}>
            <div className='product-gallery bg-white rounded-4 p-3 shadow-sm'>
              <div className='skeleton-image-main mb-3'></div>
              <Row className='g-2'>
                {[1, 2, 3, 4].map((i) => (
                  <Col key={i} xs={3}>
                    <div className='skeleton-thumbnail'></div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          {/* Loading skeleton for product details */}
          <Col lg={6}>
            <div className='product-info'>
              <div className='price-section bg-white rounded-4 p-4 shadow-sm mb-4'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='skeleton-price'></div>
                  <div className='skeleton-button'></div>
                </div>
                <div className='skeleton-warranty'></div>
              </div>

              <div className='specs-section bg-white rounded-4 p-4 shadow-sm'>
                {[1, 2, 3].map((section) => (
                  <div key={section} className='spec-section mb-4'>
                    <div className='section-header d-flex align-items-center gap-3 mb-3'>
                      <div className='skeleton-icon'></div>
                      <div className='skeleton-section-title'></div>
                    </div>
                    <div className='specs-grid'>
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className='skeleton-spec-item'></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className='additional-info bg-white rounded-4 p-4 shadow-sm mt-4'>
                <div className='skeleton-section-title mb-3'></div>
                <div className='skeleton-description'></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .product-details-page {
          background-color: #f8f9fa;
        }
        .product-header {
          background: linear-gradient(45deg, #1a237e, #3949ab);
        }
        .discount-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #dc3545;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .thumbnail-item {
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .thumbnail-item.active {
          opacity: 1;
          border-color: #0d6efd;
        }
        .thumbnail-item:hover {
          opacity: 0.8;
        }
        .warranty-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 16px;
        }
        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
        }
        .buy-now-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .buy-now-btn:hover {
          background: linear-gradient(45deg, #218838, #1ea085);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .price-tag {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .old-price {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .specs-accordion {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .section-header {
          padding-bottom: 12px;
          border-bottom: 2px solid #e9ecef;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 12px;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .spec-item:hover {
          background-color: #e9ecef;
        }
        .spec-key {
          color: #6c757d;
          font-weight: 500;
        }
        .spec-value {
          font-weight: 600;
          color: #212529;
        }
        .additional-info {
          line-height: 1.6;
        }
        @media (min-width: 768px) {
          .specs-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
  if (!product) return <div><h1>لم يتم العثور على منتجات</h1></div>

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const productSpecs = [
    {
      title: "المعلومات الأساسية",
      icon: <BsBox2Heart size={24} />,
      items: [
        { key: "اسم المنتج", value: product.name },
        { key: "البراند", value: product.brand?.name },
        { key: "اللون", value: product.color?.name },
        { key: "المخزون", value: `${product.stock} قطعة متاحة` },
        {
          key: "السعر",
          value: product.discount && product.discount > 0
            ? `${(product.price - (product.price * product.discount / 100)).toFixed(2)} ر.س (بدلاً من ${product.price} ر.س بخصم ${product.discount}%)`
            : `${product.price} ر.س`
        },
        
      ],
    },
    {
      title: "تفاصيل المنتج",
      icon: <FaShippingFast size={24} />,
      items: [
        { key: "رقم المنتج", value: `#${product.id}` },
        { key: "تاريخ الإضافة", value: new Date(product.createdAt).toLocaleDateString('ar-EG') },
        { key: "آخر تحديث", value: new Date(product.updatedAt).toLocaleDateString('ar-EG') },
        { key: "التصنيف", value: `تصنيف رقم ${product.categoryId}` },
      ],
    },
    {
      title: "معلومات إضافية",
      icon: <BsStarFill size={24} />,
      items: [
        { key: "عدد الصور", value: `${product.ProductImages?.length || 0} صورة` },
        { key: "حالة المنتج", value: product.stock > 0 ? "متوفر" : "غير متوفر" },
        { key: "نوع الخصم", value: product.discount > 0 ? "خصم نسبة" : "بدون خصم" },
        { key: "مبلغ التوفير", value: product.discount > 0 ? `${(product.price * product.discount / 100).toFixed(2)} ر.س` : "0 ر.س " },
      ],
    },
  ];

  return (
    <div className='' dir='rtl'>
      <div className=' py-4 bg-blue-500 text-white'>
        <div className='container'>
          <h2 className='mb-0 fw-bold'>{product.name}</h2>
          <div className='d-flex align-items-center gap-2 mt-2'>
            <BsStarFill className='text-warning' />
            <span>منتج أصلي 100%</span>
          </div>
        </div>
      </div>

      <div className='container py-5'>
        <Row className='g-4'>
          {/* Product images */}
          <Col lg={6}>
            <div className='product-gallery bg-white rounded-4 p-3 shadow-sm'>
              {product.ProductImages && product.ProductImages.length > 0 ? (
                <>
                  <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    className='main-carousel mb-3'
                    indicators={false}
                    interval={null}
                  >
                    {product.ProductImages.map((image, i) => (
                      <Carousel.Item key={i}>
                        <div className='position-relative rounded-4 overflow-hidden product-image-container'>
                          <img
                            src={image.url}
                            className='d-block w-100 product-main-image'
                            alt='Product'
                            loading='lazy'
                          />
                          {product.discount && (
                            <div className='discount-badge'>
                              <MdLocalOffer className='me-1' />
                              خصم {product.discount}%
                            </div>
                          )}
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Row className='g-2 thumbnail-gallery'>
                    {product.ProductImages.map((img, idx) => (
                      <Col key={idx} xs={3}>
                        <div
                          className={`thumbnail-item ${idx === index ? "active" : ""
                            }`}
                          onClick={() => setIndex(idx)}
                        >
                          <img
                            src={img.url}
                            alt='thumbnail'
                            className='w-100 rounded-3 thumbnail-image'
                            loading='lazy'
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              ) : product.cover ? (
                <div className='single-image-display'>
                  <div className='position-relative rounded-4 overflow-hidden product-image-container'>
                    <img
                      src={product.cover}
                      className='d-block w-100 product-main-image'
                      alt={product.name}
                      loading='lazy'
                    />
                    {product.discount && (
                      <div className='discount-badge'>
                        <MdLocalOffer className='me-1' />
                        خصم {product.discount}%
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='no-image-placeholder'>
                  <div className='text-center p-5'>
                    <div className='mb-3' style={{ fontSize: "120px", color: "#6c757d" }}>
                      🖼️
                    </div>
                    <p className='text-muted'>لا توجد صور متاحة</p>
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Product details */}
          <Col lg={6}>
            <div className='product-info'>
              <div className='price-section bg-white rounded-4 p-4 shadow-sm mb-4'>
                <div className='price-header-wrapper mb-3'>
                  <div className='price-tag'>
                    <h3 className='mb-0 text-success fw-bold product-price'>
                      {product.discount > 0
                        ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                        : product.price} ر.س
                    </h3>

                    {product.discount > 0 && (
                      <div className='old-price'>
                        <del className='text-muted'>{product.price} ر.س</del>
                        <Badge bg='danger' className='ms-2'>
                          توفير {product.discount}%
                        </Badge>
                      </div>
                    )}

                  </div>
                  {!isAdmin && (
                    <div className='action-buttons-wrapper'>
                      <Button
                        variant='primary'
                        size='lg'
                        className="action-btn add-to-cart-btn"
                        onClick={handleAddToCart}
                      >
                        <FaCartPlus size={20} />
                        <span className="text-white mx-1">إضافة للسلة</span>
                      </Button>
                      <Button
                        variant='success'
                        size='lg'
                        className='action-btn buy-now-btn'
                        onClick={handleBuyNow}
                      >
                        <FaShoppingBag size={20} />
                        <span className="text-white m-1">شراء الآن</span>
                      </Button>
                    </div>
                  )}
                </div>
                {product.warranty && (
                  <div className='warranty-info'>
                    <FaRegClock className='text-primary' />
                    <span>ضمان استبدال لمدة {product.warranty} أشهر</span>
                  </div>
                )}
              </div>

              <div className='specs-section bg-white rounded-4 p-4 shadow-sm'>
                <div className='specs-accordion'>
                  {productSpecs.map((section, idx) => (
                    <div key={idx} className='spec-section mb-4'>
                      <div className='section-header d-flex align-items-center gap-3 mb-3'>
                        <div className='icon-wrapper'>{section.icon}</div>
                        <h5 className='mb-0 fw-bold'>{section.title}</h5>
                      </div>
                      <div className='specs-grid'>
                        {section.items.map(
                          (item, index) =>
                            item.value && (
                              <div key={index} className='spec-item'>
                                <span className='spec-key'>{item.key}</span>
                                <span className='spec-value'>{item.value}</span>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information Section */}
              {product.description && (
                <div className='additional-info bg-white rounded-4 p-4 shadow-sm mt-4'>
                  <h5 className='fw-bold mb-3'>وصف المنتج</h5>
                  <p className='text-muted mb-0'>{product.description}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className='stock-info bg-white rounded-4 p-4 shadow-sm mt-4'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h6 className='mb-1 fw-bold'>حالة المخزون</h6>
                    <p className='mb-0 text-muted'>
                      {product.stock > 0 ? (
                        <span className='text-success'>
                          <i className='fas fa-check-circle me-1'></i>
                          متوفر ({product.stock} قطعة)
                        </span>
                      ) : (
                        <span className='text-danger'>
                          <i className='fas fa-times-circle me-1'></i>
                          غير متوفر
                        </span>
                      )}
                    </p>
                  </div>
                  {product.stock > 0 && (
                    <div className='text-center'>
                      <div className='badge bg-success fs-6 px-3 py-2'>
                        جاهز للشحن
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <ScrollToTop />

      {/* Modals */}
      <BuyNowModal 
        show={showBuyNowModal} 
        handleClose={() => setShowBuyNowModal(false)} 
        product={product} 
      />
      
      <AuthRequiredModal 
        show={showAuthRequiredModal} 
        handleClose={() => setShowAuthRequiredModal(false)}
        onLoginClick={handleShowLoginModal}
        onSignupClick={handleShowSignupModal}
      />
      
      <LoginModal 
        show={showLoginModal} 
        handleClose={() => setShowLoginModal(false)} 
      />
      
      <SignupModal 
        show={showSignupModal} 
        handleClose={() => setShowSignupModal(false)} 
      />

      <style jsx>{`
        .product-details-page {
          background-color: #f8f9fa;
        }
        .product-header {
          background: linear-gradient(45deg, #1a237e, #3949ab);
        }
        .discount-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #dc3545;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .thumbnail-item {
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .thumbnail-item.active {
          opacity: 1;
          border-color: #0d6efd;
        }
        .thumbnail-item:hover {
          opacity: 0.8;
        }
        .warranty-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 16px;
        }
        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
        }
        .buy-now-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .buy-now-btn:hover {
          background: linear-gradient(45deg, #218838, #1ea085);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .price-tag {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .old-price {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .specs-accordion {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .section-header {
          padding-bottom: 12px;
          border-bottom: 2px solid #e9ecef;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 12px;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .spec-item:hover {
          background-color: #e9ecef;
        }
        .spec-key {
          color: #6c757d;
          font-weight: 500;
        }
        .spec-value {
          font-weight: 600;
          color: #212529;
        }
        .additional-info {
          line-height: 1.6;
        }
        /* Product Images - High Quality Display */
        .product-image-container {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-height: 600px;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .product-main-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          max-width: 100%;
          max-height: 100%;
        }
        
        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 1 / 1;
        }
        
        /* Price Section Responsive */
        .price-header-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .product-price {
          font-size: 2rem;
        }
        
        .old-price {
          flex-wrap: wrap;
        }
        
        /* Action Buttons Responsive */
        .action-buttons-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 12px;
          width: 100%;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .spec-item {
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .spec-value {
          text-align: left;
        }
        
        /* Responsive Styles */
        @media (min-width: 576px) {
          .action-buttons-wrapper {
            flex-direction: row;
          }
          
          .action-btn {
            width: auto;
            flex: 1;
          }
        }
        
        @media (min-width: 768px) {
          .specs-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .price-header-wrapper {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .action-buttons-wrapper {
            flex-direction: row;
            width: auto;
          }
          
          .action-btn {
            width: auto;
            min-width: 160px;
          }
          
          .product-price {
            font-size: 2.5rem;
          }
          
          .product-image-container {
            max-height: 700px;
          }
          
          .thumbnail-item {
            border-radius: 8px;
            overflow: hidden;
            aspect-ratio: 1 / 1;
          }
        }
        
        @media (min-width: 992px) {
          .product-image-container {
            max-height: 800px;
          }
        }
        
        @media (max-width: 575px) {
          .product-gallery {
            padding: 8px !important;
          }
          
          .price-section {
            padding: 16px !important;
          }
          
          .product-price {
            font-size: 1.75rem;
          }
          
          .discount-badge {
            top: 10px;
            left: 10px;
            padding: 6px 12px;
            font-size: 12px;
          }
          
          .thumbnail-gallery {
            margin-top: 8px;
          }
          
          .specs-section {
            padding: 16px !important;
          }
          
          .section-header h5 {
            font-size: 1rem;
          }
        }
        
        /* Skeleton Loading Styles */
        .skeleton-title {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          width: 60%;
        }
        .skeleton-subtitle {
          height: 20px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          width: 40%;
          margin-top: 12px;
        }
        .skeleton-image-main {
          height: 500px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-thumbnail {
          height: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .skeleton-price {
          height: 40px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          width: 120px;
        }
        .skeleton-button {
          height: 48px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
          width: 140px;
        }
        .skeleton-warranty {
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          width: 200px;
          margin-top: 16px;
        }
        .skeleton-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-section-title {
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          width: 150px;
        }
        .skeleton-spec-item {
          height: 40px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .skeleton-description {
          height: 80px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Dark Mode Support */
        .product-gallery {
          background: var(--card-bg) !important;
          border: 1px solid var(--border-color) !important;
        }

        .price-section {
          background: var(--card-bg) !important;
          border: 1px solid var(--border-color) !important;
        }

        .specs-section {
          background: var(--card-bg) !important;
          border: 1px solid var(--border-color) !important;
        }

        .stock-info {
          background: var(--card-bg) !important;
          border: 1px solid var(--border-color) !important;
        }

        .spec-item {
          background-color: var(--bg-secondary) !important;
        }

        .spec-item:hover {
          background-color: var(--bg-tertiary) !important;
        }

        .spec-key {
          color: var(--text-muted) !important;
        }

        .spec-value {
          color: var(--text-primary) !important;
        }

        .warranty-info {
          background-color: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
        }

        .section-header {
          border-bottom-color: var(--border-color) !important;
        }
      `}</style>
    </div>
  );
};

export default DetailedProduct;
