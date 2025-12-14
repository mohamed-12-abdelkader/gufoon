import React, { useState } from "react";
import { Link, Links } from "react-router-dom";
import { FaCartPlus, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import UserType from "../../Hook/userType/UserType";

const ProductCard = ({ product, openDeleteModal, openEditModal, href }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const  [userData, isAdmin, user] =UserType()
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
                src={product.cover || (product.ProductImages && product.ProductImages.length > 0 ? product.ProductImages[0].url : 'https://via.placeholder.com/300x200?text=No+Image')}
                alt={product.name}
                className="product-image h-[200px] border"
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

                {isAdmin? (
                  <div className="admin-controls">
                    <button
                      className="control-btn delete"
                      onClick={() => openDeleteModal(product)}
                    >
                      <MdDelete />
                    </button>
                    <Link className="control-btn edit" to={`/admin/update_product/${product.id}`} title="Update Product"><FaRegEdit /> </Link>
                  </div>
                ) : (
                  <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : <FaCartPlus />}
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
                      {(product.price * (1 - product.discount / 100)).toFixed(2)} ر.س
                    </span>
                  </>
                ) : (
                  <span className="current-price">{product.price.toFixed(2)} ر.س</span>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .product-card {
          flex: 0 0 auto;
          width: 280px;
          height: 380px;
          padding: 10px;
          perspective: 1000px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px var(--shadow);
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }

        .card-inner:hover {
          box-shadow: 0 8px 25px var(--shadow);
          transform: translateY(-5px);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
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
          padding: 15px;
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
          color: #0078FF;
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
          background: #0d6efd;
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          background: #0b5ed7;
          transform: scale(1.1);
        }

        .add-to-cart-btn:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
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
      `}</style>
    </>
  );
};

export default ProductCard;