import React, { useEffect, useState } from "react";
import ScrollToTop from "../components/scollToTop/ScrollToTop";
import { Button, Carousel, Row, Col, Badge } from "react-bootstrap";
import { FaCartPlus, FaShippingFast, FaRegClock, FaShoppingBag } from "react-icons/fa";
import { BsBox2Heart, BsStarFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../utils/services";
import { toast } from "react-toastify";
import UserType from "../Hook/userType/UserType";
import BuyNowModal from "../components/modal/BuyNowModal";
import { useCart } from "../contexts/CartContext";
import "./DetailedProduct.css";

const DetailedProduct = () => {
  const { product_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [index, setIndex] = useState(0);
  
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [, isAdmin] = UserType();
  const { addToCart } = useCart();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const previous = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    scrollTop();
    const frame = requestAnimationFrame(scrollTop);
    const timer = window.setTimeout(scrollTop, 50);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      if ("scrollRestoration" in window.history && previous) {
        window.history.scrollRestoration = previous;
      }
    };
  }, [product_id]);

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
  }, [product_id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("خطأ في إضافة المنتج للسلة، حاول مجدداً");
    }
  };

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
  };


  if (loading) return (
    <div className='product-details-page' dir='rtl'>
      <div className='product-details-hero'>
        <div className='container product-details-hero__inner'>
          <div className='skeleton-subtitle'></div>
          <div className='skeleton-title'></div>
        </div>
      </div>

      <div className='container py-5'>
        <Row className='g-4'>
          {/* Loading skeleton for product images */}
          <Col lg={6}>
            <div className="product-gallery p-3 p-md-4">
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
              <div className="price-section p-4 mb-4">
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div className='skeleton-price'></div>
                  <div className='skeleton-button'></div>
                </div>
                <div className='skeleton-warranty'></div>
              </div>

              <div className="specs-section p-4">
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

              <div className="additional-info p-4 mt-4">
                <div className='skeleton-section-title mb-3'></div>
                <div className='skeleton-description'></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );

  if (!product) {
    return (
      <div className="product-details-page" dir="rtl">
        <div className="container product-details-empty">
          <div className="product-details-empty__card">
            <h1 className="h4 mb-3 text-body">لم يتم العثور على المنتج</h1>
            <p className="text-muted mb-0">
              قد يكون الرابط غير صحيح أو تم حذف المنتج.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="product-details-page" dir="rtl">
      <header className="product-details-hero">
        <div className="container product-details-hero__inner">
          <nav className="product-details-hero__crumbs" aria-label="مسار الصفحة">
            <Link to="/">الرئيسية</Link>
            <span aria-hidden="true">/</span>
            <Link to="/products">المنتجات</Link>
            {product.category?.name && product.categoryId && (
              <>
                <span aria-hidden="true">/</span>
                <Link to={`/categories/${product.categoryId}`}>{product.category.name}</Link>
              </>
            )}
          </nav>

          <div className="product-details-hero__meta">
            <span className="product-details-hero__badge">
              <BsStarFill className="product-details-hero__star" aria-hidden />
              منتج أصلي 100%
            </span>
            {product.brand?.name && (
              <span className="product-details-hero__chip">{product.brand.name}</span>
            )}
            <span className={`product-details-hero__chip ${product.stock > 0 ? "is-stock" : "is-out"}`}>
              {product.stock > 0 ? "متوفر" : "غير متوفر"}
            </span>
            {product.discount > 0 && (
              <span className="product-details-hero__chip is-sale">خصم {product.discount}%</span>
            )}
          </div>

          <h1 className="product-details-hero__title">{product.name}</h1>
        </div>
      </header>

      <div className="container py-4 py-lg-5">
        <Row className='g-4'>
          {/* Product images */}
          <Col lg={6}>
            <div className="product-gallery p-3 p-md-4">
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
                          {product.discount > 0 && (
                            <div className="discount-badge">
                              <MdLocalOffer className="me-1" aria-hidden />
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
                    {product.discount > 0 && (
                      <div className="discount-badge">
                        <MdLocalOffer className="me-1" aria-hidden />
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
              <div className="price-section p-4 mb-4">
                <div className='price-header-wrapper mb-3'>
                  <div className='price-tag'>
                    <h3 className="mb-0 fw-bold product-price">
                      {product.discount > 0
                        ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                        : product.price} ر.س
                    </h3>

                    {product.discount > 0 && (
                      <div className='old-price'>
                        <del className='text-muted'>{product.price} ر.س</del>
                        <Badge className="product-save-badge ms-2">
                          توفير {product.discount}%
                        </Badge>
                      </div>
                    )}

                  </div>
                  {!isAdmin && (
                    <div className='action-buttons-wrapper'>
                      <Button
                        variant="primary"
                        className="action-btn add-to-cart-btn"
                        onClick={handleAddToCart}
                      >
                        <FaCartPlus size={18} />
                        <span>إضافة للسلة</span>
                      </Button>
                      <Button
                        variant="success"
                        className="action-btn buy-now-btn"
                        onClick={handleBuyNow}
                      >
                        <FaShoppingBag size={18} />
                        <span>شراء الآن</span>
                      </Button>
                    </div>
                  )}
                </div>
                {product.warranty && (
                  <div className='warranty-info'>
                    <FaRegClock />
                    <span>ضمان استبدال لمدة {product.warranty} أشهر</span>
                  </div>
                )}
              </div>

              <div className="specs-section p-4">
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
                <div className="additional-info p-4 mt-4">
                  <h5 className='fw-bold mb-3'>وصف المنتج</h5>
                  <p className='text-muted mb-0'>{product.description}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className="stock-info p-4 mt-4">
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h6 className='mb-1 fw-bold'>حالة المخزون</h6>
                    <p className='mb-0 text-muted'>
                      {product.stock > 0 ? (
                        <span className="stock-in">
                          متوفر ({product.stock} قطعة)
                        </span>
                      ) : (
                        <span className="stock-out">
                          غير متوفر
                        </span>
                      )}
                    </p>
                  </div>
                  {product.stock > 0 && (
                    <div className='text-center'>
                      <div className="product-ready-badge">
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

      <BuyNowModal 
        show={showBuyNowModal} 
        handleClose={() => setShowBuyNowModal(false)} 
        product={product} 
      />

    </div>
  );
};

export default DetailedProduct;
