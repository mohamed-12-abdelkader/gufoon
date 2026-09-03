import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import SectionOne from "../../components/home/SectionOne";
import ProductCard from "../../components/card/ProductCard";
import DeleteModal from "../../components/modal/DeleteModal";
import DeleateGlasses from "../../Hook/admin/DeleateGlasses";
import SectionTwo from "../../components/home/SectionTwo";
import InstallmentBanner from "../../components/home/InstallmentBanner";
import Slider from "../../components/slider/Slider";
import { Link } from "react-router-dom";
import baseUrl from "../../api/baseUrl";

const HIGHLIGHTS = [
  "فحص نظر مجاني",
  "عدسات طبية أصلية",
  "توصيل داخل المملكة",
  "ضمان على الإطارات",
  "تشكيلة شمسي وطبي",
  "خدمة ما بعد البيع",
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, deleteGlasses] = DeleateGlasses();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);
        const { data } = await baseUrl.get("/api/categories/homepage");
        const validCategories = Array.isArray(data)
          ? data
              .map((category) => ({
                ...category,
                products: Array.isArray(category.products) ? category.products : [],
              }))
              .filter((category) => category.products.length > 0)
          : [];
        setCategories(validCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
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
      <SectionOne />

      <div className="home-page" dir="rtl">
        <div className="home-ambient" aria-hidden="true">
          <span className="home-orb home-orb-a" />
          <span className="home-orb home-orb-b" />
          <span className="home-orb home-orb-c" />
        </div>

        <div className="home-ticker">
          <Marquee speed={38} gradient={false} pauseOnHover>
            {HIGHLIGHTS.map((item, i) => (
              <span key={item} className={`home-ticker-item tone-${i % 3}`}>
                <span className="home-ticker-dot" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>

        <SectionTwo />

        <InstallmentBanner />

        <div className="home-products-wrap">
          {loading ? (
            <div className="home-state">
              <Spinner animation="border" className="home-spinner" />
              <p>جاري تحميل المجموعات...</p>
            </div>
          ) : error ? (
            <div className="home-state">
              <span className="home-state-icon">!</span>
              <h4>{error}</h4>
              <p>يرجى المحاولة مرة أخرى لاحقاً</p>
              <button type="button" className="home-retry" onClick={() => window.location.reload()}>
                إعادة المحاولة
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="home-state">
              <h4>لا توجد تصنيفات متاحة</h4>
              <p>ترقب مجموعاتنا القادمة</p>
            </div>
          ) : (
            categories.map((category, catIndex) => (
              <motion.section
                key={category.id}
                className="home-collection"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(catIndex, 3) * 0.05 }}
              >
                <div className="home-collection-inner">
                  <header className="home-collection-head">
                    <div className="home-collection-copy">
                      <h2 className="home-collection-title">{category.name}</h2>
                      {category.description &&
                        category.description.trim() !== category.name.trim() && (
                        <p className="home-collection-desc">{category.description}</p>
                      )}
                    </div>
                    <Link to={`/categories/${category.id}`} className="home-more-btn">
                      عرض المزيد
                    </Link>
                  </header>

                  <div className={`home-products-slider ${category.products.length > 2 ? "has-more" : ""}`}>
                    <Slider>
                      {category.products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          openDeleteModal={openDeleteModal}
                          href={`/product/${product.id}`}
                          index={index}
                        />
                      ))}
                    </Slider>
                    {category.products.length > 2 && (
                      <div className="home-swipe-hint" aria-hidden="true">
                        <span className="home-swipe-dot is-on" />
                        <span className="home-swipe-dot" />
                        <span className="home-swipe-dot" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))
          )}
        </div>
      </div>

      <DeleteModal
        show={deleteModalIsOpen}
        onHide={closeDeleteModal}
        productToDelete={productToDelete}
        deleteGlasses={deleteGlasses}
        loading={deleteLoading}
      />

      <style>{`
        .home-page {
          position: relative;
          background: var(--bg-primary);
          overflow-x: hidden;
        }

        .home-ambient {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .home-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.45;
          will-change: transform;
        }

        .home-orb-a {
          width: 420px;
          height: 420px;
          background: rgba(0, 108, 53, 0.32);
          top: 4%;
          right: -8%;
          animation: homeOrbA 18s ease-in-out infinite;
        }

        .home-orb-b {
          width: 340px;
          height: 340px;
          background: rgba(0, 108, 53, 0.18);
          top: 38%;
          left: -10%;
          animation: homeOrbB 22s ease-in-out infinite;
        }

        .home-orb-c {
          width: 280px;
          height: 280px;
          background: rgba(212, 175, 119, 0.12);
          bottom: 8%;
          right: 18%;
          animation: homeOrbC 16s ease-in-out infinite;
        }

        .home-ticker {
          position: relative;
          z-index: 1;
          border-block: 1px solid var(--border-color);
          background: linear-gradient(90deg, rgba(0, 108, 53, 0.16), rgba(16, 24, 20, 0.45) 42%, rgba(0, 108, 53, 0.16));
          padding: 0.7rem 0;
        }

        .home-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-inline: 1.6rem;
          color: var(--cream, #f4ead8) !important;
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .home-ticker-dot,
        .home-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
          animation: homePulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }

        .home-ticker-item.tone-1 .home-ticker-dot {
          background: var(--gold, #d4af77);
          box-shadow: 0 0 10px var(--gold-glow, rgba(212, 175, 119, 0.42));
        }
        .home-ticker-item.tone-2 .home-ticker-dot {
          background: var(--copper, #c4785a);
          box-shadow: 0 0 10px rgba(196, 120, 90, 0.45);
        }

        .home-products-wrap {
          position: relative;
          z-index: 1;
        }

        .home-state {
          min-height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.5rem;
          padding: 3rem 1rem;
        }

        .home-state p,
        .home-state h4 {
          color: var(--text-secondary) !important;
          margin: 0 !important;
        }

        .home-spinner {
          color: var(--accent) !important;
          width: 2.4rem;
          height: 2.4rem;
          border-width: 3px;
        }

        .home-state-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-soft);
          color: var(--accent) !important;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .home-retry {
          margin-top: 0.4rem;
          border: none;
          background: var(--accent);
          color: #06210f;
          font-weight: 700;
          padding: 0.5rem 1.3rem;
          border-radius: 999px;
          box-shadow: 0 8px 20px var(--accent-glow);
        }

        .home-collection {
          padding: 2.25rem 0;
        }

        .home-collection + .home-collection {
          border-top: 1px solid var(--border-color);
        }

        .home-collection-inner {
          width: min(1200px, calc(100% - 2rem));
          margin: 0 auto;
        }

        .home-collection-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .home-collection-copy {
          min-width: 0;
        }

        .home-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--accent) !important;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          margin-bottom: 0.25rem;
        }

        .home-collection-title {
          margin: 0 !important;
          font-size: 1.45rem !important;
          line-height: 1.35 !important;
          font-weight: 800 !important;
          color: var(--text-primary) !important;
          position: relative;
          display: inline-block;
        }

        .home-collection-title::after {
          content: "";
          display: block;
          width: 42px;
          height: 3px;
          margin-top: 0.4rem;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--accent), transparent);
          animation: homeLine 2.8s ease-in-out infinite;
        }

        .home-collection-desc {
          margin: 0.35rem 0 0 !important;
          max-width: 50ch;
          color: var(--text-secondary) !important;
          font-size: 0.92rem;
        }

        .home-more-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          color: #06210f !important;
          background: var(--accent);
          font-weight: 700;
          font-size: 0.88rem;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 6px 18px var(--accent-glow);
          animation: homeBtnGlow 2.6s ease-in-out infinite;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .home-more-btn:hover {
          color: #06210f !important;
          filter: brightness(1.08);
          transform: translateY(-2px);
          animation-play-state: paused;
        }

        .home-products-slider {
          margin-inline: -0.15rem;
          position: relative;
        }

        .home-products-slider .g-slider-track {
          align-items: stretch;
          gap: 1rem;
          padding: 12px 6px 22px;
        }

        .home-products-slider .g-slider-track > .product-card {
          flex: 0 0 260px;
          width: 260px;
          max-width: 260px;
          height: auto;
        }

        .home-products-slider .g-slider-btn {
          box-shadow: 0 6px 16px var(--accent-glow);
        }

        .home-swipe-hint {
          display: none;
        }

        @keyframes homeOrbA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 50px) scale(1.12); }
        }
        @keyframes homeOrbB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(70px, -40px) scale(1.08); }
        }
        @keyframes homeOrbC {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, -60px); }
        }
        @keyframes homePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.65; }
        }
        @keyframes homeLine {
          0%, 100% { width: 42px; opacity: 0.75; }
          50% { width: 88px; opacity: 1; }
        }
        @keyframes homeBtnGlow {
          0%, 100% { box-shadow: 0 6px 18px var(--accent-glow); }
          50% { box-shadow: 0 0 22px 2px rgba(0, 108, 53, 0.5); }
        }

        @media (max-width: 1100px) {
          .home-products-slider .g-slider-track > .product-card {
            flex: 0 0 240px;
            width: 240px;
            max-width: 240px;
          }
        }

        @media (max-width: 767px) {
          .home-orb-a,
          .home-orb-b,
          .home-orb-c {
            width: 220px;
            height: 220px;
            filter: blur(50px);
          }
          .home-collection {
            padding: 1.5rem 0 1.15rem;
          }
          .home-collection-head {
            align-items: center;
            margin-bottom: 0.75rem;
          }
          .home-collection-inner {
            width: calc(100% - 1.5rem);
          }
          .home-collection-title {
            font-size: 1.12rem !important;
          }
          .home-collection-title::after {
            width: 28px;
            height: 2px;
            margin-top: 0.3rem;
            animation: none;
          }
          .home-collection-desc {
            display: none;
          }
          .home-more-btn {
            font-size: 0.78rem;
            padding: 0.38rem 0.85rem;
            box-shadow: none;
            animation: none;
          }
          .home-products-slider {
            margin-inline: 0;
          }
          .home-products-slider .g-slider-track {
            gap: 0.6rem;
            padding: 4px 0 8px;
          }
          .home-products-slider .g-slider-track > .product-card {
            flex: 0 0 calc((100% - 2rem) / 2);
            width: calc((100% - 2rem) / 2);
            max-width: none;
            scroll-snap-align: start;
          }
          .home-swipe-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 0.15rem 0 0;
          }
          .home-swipe-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.22);
          }
          .home-swipe-dot.is-on {
            width: 16px;
            border-radius: 99px;
            background: var(--accent);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-orb,
          .home-ticker-dot,
          .home-eyebrow-dot,
          .home-collection-title::after,
          .home-more-btn {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
