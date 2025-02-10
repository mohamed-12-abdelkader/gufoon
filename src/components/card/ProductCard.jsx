import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCartPlus, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner, Badge } from "react-bootstrap";
import useAddToCart from "../../Hook/user/useAddToCart";
import { useAuth } from "../../contexts/AuthContext";

const ProductCard = ({
  product,
  openDeleteModal,
  openEditModal,
  href,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { handleAddTOCart, loading } = useAddToCart();
  const { isAdmin } = useAuth();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className='product-card' dir='rtl'>
      <div className='card-inner'>
        <Link to={href} className='product-image-link'>
          <div className='image-wrapper'>
            <img
              src={product.cover}
              alt={product.name}
              className='product-image h-[200px] border'
            />
            <div className='card-badges'>
              {product.discount && (
                <Badge bg='danger' className='discount-badge'>
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

        <div className='product-content'>
          <div className='flex justify-between items-center'>
            <div>
              <Link to={href} className='product-title-link'>
                <h6 className='product-title'>{product.name}</h6>
              </Link>

              {isAdmin() ? (
                <div className='admin-controls'>
                  <button
                    className='control-btn delete'
                    onClick={() => openDeleteModal(product)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className='control-btn edit'
                    onClick={() => openEditModal(product)}
                  >
                    <FaRegEdit />
                  </button>
                </div>
              ) : (
                <button
                  className='add-to-cart-btn'
                  onClick={() =>
                    handleAddTOCart(product.id, product.type_id)
                  }
                  disabled={loading}
                >
                  {loading ? <Spinner size='sm' /> : <FaCartPlus />}
                </button>
              )}
            </div>
            <div className='price-wrapper'>
              {product.salary_before && (
                <span className='original-price'>
                  {product.salary_before} ر.س
                </span>
              )}
              <span className='current-price'>
                {discountedPrice.toFixed(2)} ر.س
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
