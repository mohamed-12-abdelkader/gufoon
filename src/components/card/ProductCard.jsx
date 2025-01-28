import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCartPlus, FaRegEdit, FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Spinner, Badge } from "react-bootstrap";
import useAddToCart from "../../Hook/user/useAddToCart";

const ProductCard = ({
  glasse,
  isAdmin,

  loadingItems,
  openDeleteModal,
  openEditModal,
  href,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const { handleaddToCart, loading } = useAddToCart();
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // هنا يمكنك إضافة المنطق الخاص بإضافة/إزالة المنتج من المفضلة
  };

  const isAdminUser = userData?.role === "admin";

  return (
    <div className='product-card' dir='rtl'>
      <div className='card-inner'>
        <Link to={href} className='product-image-link'>
          <div className='image-wrapper'>
            <img
              src={glasse.images[0].image}
              alt={glasse.product_name}
              className='product-image h-[200px] border'
            />
            <div className='card-badges'>
              {glasse.percent && (
                <Badge bg='danger' className='discount-badge'>
                  خصم {glasse.percent}%
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
                <h6 className='product-title'>{glasse.product_name}</h6>
              </Link>
              {!isAdminUser && (
                <button
                  className='add-to-cart-btn'
                  onClick={() =>
                    handleaddToCart(glasse.product_id, glasse.type_id)
                  }
                  disabled={loading}
                >
                  {loading ? <Spinner size='sm' /> : <FaCartPlus />}
                </button>
              )}
              {isAdminUser && (
                <div className='admin-controls'>
                  <button
                    className='control-btn delete'
                    onClick={() => openDeleteModal(glasse)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className='control-btn edit'
                    onClick={() => openEditModal(glasse)}
                  >
                    <FaRegEdit />
                  </button>
                </div>
              )}
            </div>
            <div className='price-wrapper'>
              {glasse.salary_before && (
                <span className='original-price'>
                  {glasse.salary_before} ر.س
                </span>
              )}
              <span className='current-price'>
                {glasse.salary_after || glasse.salary} ر.س
              </span>
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
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .card-inner:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.03);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-inner:hover .hover-overlay {
          opacity: 1;
        }

        .wishlist-icon {
          color: #dc3545;
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .wishlist-icon:hover {
          transform: scale(1.2);
        }

        .discount-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
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
          color: #2c3e50;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 40px;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e9ecef;
        }

        .price-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .current-price {
          font-weight: 700;
          color: #2196f3;
          font-size: 16px;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
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
          background: #ccc;
          cursor: not-allowed;
        }

        .admin-controls {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 10px;
        }

        .control-btn {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .control-btn:hover {
          background: #f8f9fa;
        }

        .control-btn.delete {
          color: #dc3545;
        }

        .control-btn.edit {
          color: #0d6efd;
        }

        .card-badges {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 2;
        }

        .discount-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
        }

        .favorite-btn {
          background: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #dc3545;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .favorite-btn:hover {
          transform: scale(1.1);
        }

        .favorite-btn.active {
          background: #dc3545;
          color: white;
        }

        .brand-name {
          margin-bottom: 4px;
        }

        .product-details {
          margin-top: 8px;
        }

        .specs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .spec-item {
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
