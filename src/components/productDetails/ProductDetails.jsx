import React, { useState } from "react";
import ScrollToTop from "../scollToTop/ScrollToTop";
import { Button, Carousel, Row, Col, Badge } from "react-bootstrap";
import { FaCartPlus, FaShippingFast, FaRegClock } from "react-icons/fa";
import { BsBox2Heart, BsStarFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";

const ProductDetails = ({ products }) => {
  const [index, setIndex] = useState(0);
  const product = products?.result?.[0] || {};

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const productSpecs = [
    {
      title: "المعلومات الأساسية",
      icon: <BsBox2Heart size={24} />,
      items: [
        { key: "اسم المنتج", value: products.product_name },
        { key: "الموديل", value: products.model_number },
        { key: "البراند", value: products.brand_name },
        {
          key: "السعر",
          value: `${products.salary_before || products.salary} ج.م`,
        },
        {
          key: "الضمان",
          value: products.replacement ? `${products.replacement} أشهر` : null,
        },
      ],
    },
    {
      title: "مواصفات الإطار",
      icon: <FaShippingFast size={24} />,
      items: [
        { key: "مقاس النظارة", value: products.size },
        { key: "مادة الإطار", value: products.frame_material },
        { key: "لون الإطار", value: products.frame_color },
        { key: "نوع الإطار", value: products.frame_type },
        { key: "شكل الإطار", value: products.frameShape },
      ],
    },
    {
      title: "مواصفات العدسات",
      icon: <BsStarFill size={24} />,
      items: [
        { key: "نوع العدسة", value: products.lensesType },
        { key: "لون العدسة", value: products.lenses_color },
        { key: "مادة العدسة", value: products.lensesMaterial },
        { key: "طلاء العدسة", value: products.lensesCoating },
      ],
    },
  ];

  return (
    <div className='product-details-page' dir='rtl'>
      <div className='product-header py-4 bg-primary text-white'>
        <div className='container'>
          <h2 className='mb-0 fw-bold'>{products.product_name}</h2>
          <div className='d-flex align-items-center gap-2 mt-2'>
            <BsStarFill className='text-warning' />
            <span>منتج أصلي 100%</span>
          </div>
        </div>
      </div>

      <div className='container py-5'>
        <Row className='g-4'>
          {/* صور المنتج */}
          <Col lg={6}>
            <div className='product-gallery bg-white rounded-4 p-3 shadow-sm'>
              {products.images ? (
                <>
                  <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    className='main-carousel mb-3'
                    indicators={false}
                    interval={null}
                  >
                    {products.images.map((img) => (
                      <Carousel.Item key={img.image_id}>
                        <div className='position-relative rounded-4 overflow-hidden'>
                          <img
                            src={img.image}
                            className='d-block w-100 object-fit-cover'
                            style={{ height: "500px" }}
                            alt='Product'
                          />
                          {products.discount && (
                            <div className='discount-badge'>
                              <MdLocalOffer className='me-1' />
                              خصم {products.discount}%
                            </div>
                          )}
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Row className='g-2 thumbnail-gallery'>
                    {products.images.map((img, idx) => (
                      <Col key={img.image_id} xs={3}>
                        <div
                          className={`thumbnail-item ${
                            idx === index ? "active" : ""
                          }`}
                          onClick={() => setIndex(idx)}
                        >
                          <img
                            src={img.image}
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
                      alt='No Image'
                      className='mb-3'
                      style={{ width: "120px" }}
                    />
                    <p className='text-muted'>لا توجد صور متاحة</p>
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* تفاصيل المنتج */}
          <Col lg={6}>
            <div className='product-info'>
              <div className='price-section bg-white rounded-4 p-4 shadow-sm mb-4'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='price-tag'>
                    <h3 className='mb-0 text-success fw-bold'>
                      {products.salary_before || products.salary} ج.م
                    </h3>
                    {products.salary_before && (
                      <div className='old-price'>
                        <del className='text-muted'>{products.salary} ج.م</del>
                        <Badge bg='danger' className='ms-2'>
                          توفير {products.discount}%
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
                {products.replacement && (
                  <div className='warranty-info'>
                    <FaRegClock className='text-primary' />
                    <span>ضمان استبدال لمدة {products.replacement} أشهر</span>
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
              {products.description && (
                <div className='additional-info bg-white rounded-4 p-4 shadow-sm mt-4'>
                  <h5 className='fw-bold mb-3'>معلومات إضافية</h5>
                  <p className='text-muted mb-0'>{products.description}</p>
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
      `}</style>
    </div>
  );
};

export default ProductDetails;
