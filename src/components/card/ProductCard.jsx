import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaRegEdit, FaRegHeart, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { useCart } from "../../contexts/CartContext";
import UserType from "../../Hook/userType/UserType";

const ProductCard = ({ product, openDeleteModal, openEditModal, href, index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, isAdmin] = UserType();
  const { addToCart } = useCart();

  const price = Number(product?.price) || 0;
  const discount = Number(product?.discount) || 0;
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  const imageSrc =
    product.cover ||
    product.productImages?.[0]?.url ||
    product.ProductImages?.[0]?.url ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    await addToCart(product);
    setLoading(false);
  };

  return (
      <motion.article
        className="product-card"
        dir="rtl"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: Math.min(index, 8) * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pcard">
          <Link to={href} className="pcard-media">
            <img
              src={imageSrc}
              alt={product.name}
              className="pcard-image"
              loading="lazy"
              decoding="async"
            />
            <span
              className="pcard-shine"
              aria-hidden="true"
              style={{ animationDelay: `${(index % 5) * 0.9}s` }}
            />
            <span className="pcard-overlay">
              <span>عرض المنتج</span>
            </span>
            <div className="pcard-badges">
              {discount > 0 && (
                <span className="pcard-discount">خصم {discount}%</span>
              )}
              <button
                type="button"
                className={`pcard-fav ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                aria-label="إضافة للمفضلة"
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </Link>

          <div className="pcard-body">
            <Link to={href} className="pcard-title-link">
              <h6 className="pcard-title">{product.name}</h6>
            </Link>

            <div className="pcard-footer">
              <div className="pcard-price">
                {discount > 0 ? (
                  <>
                    <span className="pcard-price-now">
                      {discountedPrice.toFixed(2)} ر.س
                    </span>
                    <span className="pcard-price-old">{price.toFixed(2)} ر.س</span>
                  </>
                ) : (
                  <span className="pcard-price-now">{price.toFixed(2)} ر.س</span>
                )}
              </div>

              {isAdmin ? (
                <div className="pcard-admin">
                  <button
                    type="button"
                    className="pcard-ctrl delete"
                    onClick={() => openDeleteModal(product)}
                    aria-label="حذف المنتج"
                  >
                    <MdDelete />
                  </button>
                  <Link
                    className="pcard-ctrl edit"
                    to={`/admin/update_product/${product.id}`}
                    title="تحديث المنتج"
                  >
                    <FaRegEdit />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  className="pcard-cart"
                  onClick={handleAddToCart}
                  disabled={loading}
                  aria-label="إضافة للسلة"
                  title="إضافة للسلة"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaShoppingCart />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      <style>{`
        .product-card {
          width: 100%;
          min-width: 0;
          height: 100%;
        }

        .pcard {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.25s ease;
        }

        .pcard:hover,
        .pcard:focus-within {
          transform: translateY(-8px);
          z-index: 2;
          border-color: var(--accent);
          box-shadow:
            0 0 0 1px rgba(0, 108, 53, 0.4),
            0 0 28px var(--accent-glow),
            0 16px 32px -12px rgba(0, 0, 0, 0.5);
        }

        .pcard-media {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f7f1e8;
          flex-shrink: 0;
        }

        .pcard-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }

        .pcard:hover .pcard-image {
          transform: scale(1.06);
        }

        .pcard-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 32%,
            rgba(46, 229, 157, 0.18) 48%,
            transparent 64%
          );
          transform: translateX(-120%);
          pointer-events: none;
          animation: pcardShine 5.5s ease-in-out infinite;
        }

        .pcard:hover .pcard-shine {
          animation: pcardShine 0.9s ease forwards;
        }

        @keyframes pcardShine {
          0%, 72% { transform: translateX(-120%); }
          88%, 100% { transform: translateX(120%); }
        }

        @keyframes pcardBadge {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 16px rgba(196, 120, 90, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 18px rgba(196, 120, 90, 0.55); }
        }

        .pcard-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 1.15rem;
          background: linear-gradient(
            to top,
            rgba(7, 11, 9, 0.78) 0%,
            rgba(7, 11, 9, 0.12) 48%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .pcard:hover .pcard-overlay {
          opacity: 1;
        }

        .pcard-overlay span {
          color: #06210f !important;
          background: var(--accent);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          box-shadow: 0 8px 20px var(--accent-glow);
          transform: translateY(10px);
          transition: transform 0.35s ease;
        }

        .pcard:hover .pcard-overlay span {
          transform: translateY(0);
        }

        .pcard-badges {
          position: absolute;
          top: 12px;
          inset-inline: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .pcard-discount {
          background: linear-gradient(135deg, #c4785a, #a85a40);
          color: #fffaf2 !important;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.28rem 0.65rem;
          border-radius: 999px;
          box-shadow: 0 6px 16px rgba(196, 120, 90, 0.4);
          animation: pcardBadge 2.4s ease-in-out infinite;
        }

        .pcard-fav {
          margin-inline-start: auto;
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(7, 11, 9, 0.55);
          color: #fff;
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .pcard-fav:hover {
          transform: scale(1.1);
          color: #fb7185;
        }

        .pcard-fav.active {
          color: #fb7185;
          background: rgba(251, 113, 133, 0.18);
        }

        .pcard-body {
          padding: 0.85rem 0.95rem 1rem;
          margin-top: auto;
        }

        .pcard-title-link {
          text-decoration: none;
          color: inherit;
        }

        .pcard-title {
          margin: 0 0 0.55rem !important;
          font-size: 0.92rem !important;
          font-weight: 700 !important;
          color: var(--text-primary) !important;
          line-height: 1.4 !important;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5em;
        }

        .pcard-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .pcard-price {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pcard-price-now {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--gold, #d4af77) !important;
          letter-spacing: 0.01em;
        }

        .pcard-price-old {
          font-size: 0.78rem;
          text-decoration: line-through;
          color: var(--text-muted) !important;
        }

        .pcard-cart {
          width: 46px;
          height: 46px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(145deg, #006C35 0%, #005a2c 100%);
          color: #06210f;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 8px 18px var(--accent-glow);
          transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
        }

        .pcard-cart:hover:not(:disabled) {
          transform: scale(1.08) rotate(-6deg);
          filter: brightness(1.08);
          box-shadow: 0 0 22px var(--accent-glow);
        }

        .pcard-cart:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .pcard-admin {
          display: flex;
          gap: 8px;
        }

        .pcard-ctrl {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .pcard-ctrl:hover {
          transform: scale(1.08);
        }

        .pcard-ctrl.delete:hover {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }

        .pcard-ctrl.edit:hover {
          background: #eab308;
          color: #fff;
          border-color: #eab308;
        }

        @media (max-width: 767px) {
          .pcard {
            border-radius: 14px;
          }
          .pcard:hover,
          .pcard:focus-within {
            transform: none;
            box-shadow: none;
            border-color: var(--border-color);
          }
          .pcard-media {
            aspect-ratio: 1 / 0.92;
            padding: 8px 8px 0;
            background: #f4efe6;
          }
          .pcard-overlay {
            display: none;
          }
          .pcard-fav {
            width: 30px;
            height: 30px;
          }
          .pcard-body {
            padding: 0.55rem 0.65rem 0.7rem;
          }
          .pcard-title {
            font-size: 0.78rem !important;
            margin: 0 0 0.4rem !important;
            min-height: 0;
            -webkit-line-clamp: 2;
          }
          .pcard-price-now {
            font-size: 0.88rem;
          }
          .pcard-cart {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            box-shadow: none;
          }
          .pcard-cart:hover:not(:disabled) {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card,
          .pcard,
          .pcard-image,
          .pcard-shine,
          .pcard-overlay,
          .pcard-overlay span,
          .pcard-discount {
            animation: none !important;
            transition: none !important;
          }
          .pcard:hover {
            transform: none;
          }
        }
      `}      </style>
    </motion.article>
  );
};

export default ProductCard;
