import React, { useEffect, useState } from "react";
import ScrollToTop from "../components/scollToTop/ScrollToTop";
import { Button, Carousel, Row, Col, Badge } from "react-bootstrap";
import { FaCartPlus, FaShippingFast, FaRegClock } from "react-icons/fa";
import { BsBox2Heart, BsStarFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getProductById } from "../utils/services";

const DetailedProduct = () => {
  const { product_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [index, setIndex] = useState(0);

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
        { key: "الموديل", value: product.model_number },
        { key: "البراند", value: product.brand.name },
        {
          key: "السعر",
          value: product.discount && product.discount > 0
            ? `${product.price - product.discount} ج.م (بدلاً من ${product.price} ج.م بخصم ${product.discount} ج.م)`
            : `${product.price} ج.م`
        },
        {
          key: "الضمان",
          value: product.warranty ? `${product.warranty} أشهر` : null,
        },
      ],
    },
    {
      title: "مواصفات الإطار",
      icon: <FaShippingFast size={24} />,
      items: [
        { key: "مقاس النظارة", value: product?.frameSize?.size },
        { key: "مادة الإطار", value: product?.frameMaterial?.material },
        { key: "لون الإطار", value: product?.frameColor?.color },
        { key: "نوع الإطار", value: product?.frameType?.name },
        { key: "شكل الإطار", value: product?.frameShape?.shape },
      ],
    },
    {
      title: "مواصفات العدسات",
      icon: <BsStarFill size={24} />,
      items: [
        { key: "نوع العدسة", value: product?.lenseType?.name },
        { key: "لون العدسة", value: product?.lenseColor?.color },
        { key: "مادة العدسة", value: product?.lenseMaterial?.material },
        { key: "طلاء العدسة", value: product?.lensCoating?.coating },
      ],
    },
  ];

  return (
    <div className='product-details-page' dir='rtl'>
      <div className='product-header py-4 bg-primary text-white'>
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
              {product.productImages ? (
                <>
                  <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    className='main-carousel mb-3'
                    indicators={false}
                    interval={null}
                  >
                    {product.productImages.map((image, i) => (
                      <Carousel.Item key={i}>
                        <div className='position-relative rounded-4 overflow-hidden'>
                          <img
                            src={image.url}
                            className='d-block w-100 object-fit-cover'
                            style={{ height: "500px" }}
                            alt='Product'
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
                    {product.productImages.map((img, idx) => (
                      <Col key={idx} xs={3}>
                        <div
                          className={`thumbnail-item ${idx === index ? "active" : ""
                            }`}
                          onClick={() => setIndex(idx)}
                        >
                          <img
                            src={img.url}
                            alt='thumbnail'
                            className='w-100 rounded-3'
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              ) : (
                <div className='no-image-placeholder'>
                  <div className='text-center p-5'>
                    <img
                      src='/path-to-no-image.png'
                      alt=''
                      className='mb-3'
                      style={{ width: "120px" }}
                    />
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
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='price-tag'>
                    <h3 className='mb-0 text-success fw-bold'>
                      {product.discount > 0
                        ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                        : product.price} ج.م
                    </h3>

                    {product.discount > 0 && (
                      <div className='old-price'>
                        <del className='text-muted'>{product.price} ج.م</del>
                        <Badge bg='danger' className='ms-2'>
                          توفير {product.discount}%
                        </Badge>
                      </div>
                    )}

                  </div>
                  <Button
                    variant='primary'
                    size='lg'
                    className='add-to-cart-btn'
                  >
                    <FaCartPlus size={20} />
                    <span>إضافة للسلة</span>
                  </Button>
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
                  <h5 className='fw-bold mb-3'>معلومات إضافية</h5>
                  <p className='text-muted mb-0'>{product.description}</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <ScrollToTop />

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
      `}</style>
    </div>
  );
};

export default DetailedProduct;
