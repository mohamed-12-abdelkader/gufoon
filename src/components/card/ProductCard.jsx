import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner, Badge } from "react-bootstrap";
import { useCart } from "../../contexts/CartContext";
import UserType from "../../Hook/userType/UserType";

const ProductCard = ({ product, openDeleteModal, openEditModal, href }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, isAdmin, user] = UserType();
  const { addToCart } = useCart();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart(product);
    setLoading(false);
  };

  return (
    <>
      <div className="product-card" dir="rtl">
        <div className="card-inner">
          <Link to={href} className="product-image-link">
            <div className="image-wrapper">
              <img
                src={
                  product.cover ||
                  (product.ProductImages && product.ProductImages.length > 0
                    ? product.ProductImages[0].url
                    : "https://via.placeholder.com/400x400?text=No+Image")
                }
                alt={product.name}
                className="product-image"
                loading="lazy"
                decoding="async"
              />
              <div className="card-badges">
                {product.discount && (
                  <Badge bg="danger" className="discount-badge">
                    خصم {product.discount}%
                  </Badge>
                )}
                <button
                  className={`favorite-btn ${isFavorite ? "active" : ""}`}
                  onClick={handleFavoriteClick}
                >
                  <FaRegHeart />
                </button>
              </div>
            </div>
          </Link>

          <div className="product-content">
            <div className="flex justify-between items-center">
              <div>
                <Link to={href} className="product-title-link">
                  <h6 className="product-title">{product.name}</h6>
                </Link>

                {isAdmin ? (
                  <div className="admin-controls">
                    <button
                      className="control-btn delete"
                      onClick={() => openDeleteModal(product)}
                    >
                      <MdDelete />
                    </button>
                    <Link
                      className="control-btn edit"
                      to={`/admin/update_product/${product.id}`}
                      title="Update Product"
                    >
                      <FaRegEdit />{" "}
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={loading}
                    aria-label="إضافة للسلة"
                    title="إضافة للسلة"
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" className="cart-spinner" />
                    ) : (
                      <FaShoppingCart className="cart-icon" aria-hidden />
                    )}
                  </button>
                )}
              </div>
              <div className="price-wrapper">
                {product.discount ? (
                  <>
                    <span className="original-price">
                      {product.price.toFixed(2)} ر.س
                    </span>
                    <span className="current-price discount-price">
                      {(product.price * (1 - product.discount / 100)).toFixed(
                        2,
                      )}{" "}
                      ر.س
                    </span>
                  </>
                ) : (
                  <span className="current-price">
                    {product.price.toFixed(2)} ر.س
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .product-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          min-height: 380px;
          height: auto;
          padding: 8px;
          box-sizing: border-box;
          perspective: 1000px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          min-height: 364px;
          height: 100%;
          background: var(--card-bg);
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 2px 8px var(--shadow),
            0 12px 28px -12px rgba(0, 0, 0, 0.12);
          transition: box-shadow 0.35s ease, transform 0.35s ease,
            border-color 0.25s ease;
          border: 1px solid var(--border-color);
        }

        .card-inner:hover {
          box-shadow:
            0 8px 24px var(--shadow),
            0 20px 40px -16px rgba(0, 120, 255, 0.12);
          transform: translateY(-4px);
          border-color: rgba(0, 120, 255, 0.2);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: radial-gradient(
            ellipse 85% 75% at 50% 40%,
            var(--bg-secondary) 0%,
            var(--bg-tertiary) 55%,
            var(--bg-secondary) 100%
          );
        }

        .product-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .card-inner:hover .product-image {
          transform: scale(1.06);
        }

        .card-badges {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .favorite-btn {
          background: var(--card-bg);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          color: #dc3545;
        }

        .favorite-btn.active {
          color: #dc3545;
        }

        .product-content {
          padding: 14px 16px 16px;
        }

        .product-content .flex {
          align-items: flex-start;
          gap: 10px;
        }

        .product-title-link {
          text-decoration: none;
          color: inherit;
        }

        .product-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 40px;
        }

        .price-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .current-price {
          font-weight: 700;
          color: #0078ff;
          font-size: 16px;
        }

        .current-price.discount-price {
          color: #dc3545;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--text-muted);
          font-size: 13px;
        }

        .add-to-cart-btn {
          flex-shrink: 0;
          background: linear-gradient(145deg, #012148 0%, #0a4a8c 100%);
          color: #fff;
          border: none;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            filter 0.25s ease;
          box-shadow:
            0 4px 14px rgba(1, 33, 72, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .add-to-cart-btn .cart-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
        }

        .add-to-cart-btn .cart-spinner {
          width: 1.1rem;
          height: 1.1rem;
          border-width: 2px;
          color: #fff;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: scale(1.06);
          box-shadow:
            0 6px 20px rgba(0, 120, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .add-to-cart-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .add-to-cart-btn:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
          box-shadow: none;
          filter: none;
        }

        .add-to-cart-btn:focus-visible {
          outline: 2px solid #0078ff;
          outline-offset: 2px;
        }

        .admin-controls {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 10px;
        }

        .control-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: var(--bg-tertiary);
          transform: scale(1.1);
        }

        .control-btn.delete:hover {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .control-btn.edit:hover {
          background: #ffc107;
          color: white;
          border-color: #ffc107;
        }

        [data-theme="dark"] .card-inner {
          background: var(--card-bg);
          border-color: var(--border-color);
        }

        [data-theme="dark"] .image-wrapper {
          background: var(--bg-tertiary);
        }

        [data-theme="dark"] .favorite-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        [data-theme="dark"] .control-btn {
          background: var(--bg-tertiary);
          border-color: var(--border-color);
        }

        [data-theme="dark"] .add-to-cart-btn:not(:disabled) {
          background: linear-gradient(145deg, #1a3a6e 0%, #2563a8 100%);
          box-shadow:
            0 4px 14px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </>
  );
};

export default ProductCard;
