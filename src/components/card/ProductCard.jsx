import React, { useState } from "react";
import { Link, Links } from "react-router-dom";
import { FaCartPlus, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const ProductCard = ({ product, openDeleteModal, openEditModal, href }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAdmin, isAuthenticated } = useAuth();
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
    <div className="product-card" dir="rtl">
      <div className="card-inner">
        <Link to={href} className="product-image-link">
          <div className="image-wrapper">
            <img
              src={product.cover}
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

              {isAdmin() ? (
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
                  <span className="original-price" style={{ textDecoration: "line-through", color: "gray" }}>
                    {product.price.toFixed(2)} ر.س
                  </span>
                  <span className="current-price" style={{ color: "red", marginRight: "10px" }}>
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
  );
};

export default ProductCard;