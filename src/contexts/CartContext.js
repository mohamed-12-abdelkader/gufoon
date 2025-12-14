import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import baseUrl from '../api/baseUrl';
import { getProductById } from '../utils/services';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    } else {
      // For non-authenticated users, show empty cart
      setCart([]);
    }
  }, [isAuthenticated]);

  // Fetch product details for a product ID
  const fetchProductDetails = async (productId) => {
    try {
      const product = await getProductById(productId);
      return product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  // Fetch cart from API - new response format: { items: [...], pricing: {...}, coupon: {...} }
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await baseUrl.get('api/carts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // API returns: { items: [...], pricing: {...}, coupon: {...} }
      if (data && data.items && Array.isArray(data.items)) {
        // Map items to cart format - product info is already included
        const cartItems = data.items.map((cartItem) => ({
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          userId: cartItem.userId,
          productInfo: cartItem.product || {
            id: cartItem.productId,
            name: 'منتج غير متاح',
            price: 0,
            cover: null
          }
        }));
        setCart(cartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
      toast.error('حدث خطأ أثناء تحميل السلة');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    // Check for token directly from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('يرجى تسجيل الدخول لإضافة منتجات للسلة');
      return;
    }

    setLoading(true);
    try {
      
      // Check if product already exists in cart
      const existingCartItem = cart.find(item => item.productId === product.id);
      
      if (existingCartItem) {
        // Update quantity if product exists
        await baseUrl.put(`api/carts/${existingCartItem.id}`, {
          productId: product.id,
          quantity: existingCartItem.quantity + 1
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add new product to cart
        await baseUrl.post('api/carts', {
          productId: product.id,
          quantity: 1
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Refresh cart to get updated data
      await fetchCart();
      toast.success(`${product.name} تم إضافته إلى السلة ✅`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'حدث خطأ أثناء إضافة المنتج للسلة';
      toast.error(errorMessage + ' ❌');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart using `cartId`
  const removeFromCart = async (cartId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('يرجى تسجيل الدخول');
      return;
    }

    setLoading(true);
    try {
      await baseUrl.delete(`api/carts/${cartId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh cart
      await fetchCart();
      toast.info('تمت إزالة المنتج من السلة 🛒');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('خطأ في إزالة المنتج ❌');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity using `cartId`
  const updateQuantity = async (cartId, newQuantity) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('يرجى تسجيل الدخول');
      return;
    }

    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }

    try {
      
      // Get the cart item to find productId
      const cartItem = cart.find(item => item.id === cartId);
      if (!cartItem) {
        toast.error('عنصر السلة غير موجود');
        return;
      }

      await baseUrl.put(`api/carts/${cartId}`, {
        productId: cartItem.productId,
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh cart
      await fetchCart();
      toast.success('تم تحديث كمية المنتج 🔄');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('خطأ في تحديث الكمية ❌');
    }
  };

  // Clear all cart items
  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await baseUrl.delete('api/carts/empty', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCart([]);
      toast.success('تم تفريغ السلة بنجاح');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('حدث خطأ أثناء تفريغ السلة');
    }
  };

  // Update cart from API response (used when applying coupons)
  const updateCartFromResponse = (cartResponse) => {
    if (cartResponse && cartResponse.items && Array.isArray(cartResponse.items)) {
      const cartItems = cartResponse.items.map((cartItem) => {
        const productId = cartItem.product?.id || cartItem.productId;
        const product = cartItem.product || {};
        
        return {
          id: cartItem.id,
          productId: productId,
          quantity: cartItem.quantity,
          userId: cartItem.userId || null, // userId might not be in coupon response
          productInfo: {
            id: product.id || productId,
            name: product.name || 'منتج غير متاح',
            price: product.price || 0,
            discount: product.discount || 0,
            cover: product.cover || null,
            description: product.description || null,
            stock: product.stock || 0,
            brandId: product.brandId,
            colorId: product.colorId,
            categoryId: product.categoryId,
            // Include any other product fields that might be needed
            brand: product.brand,
            color: product.color,
            category: product.category
          }
        };
      });
      setCart(cartItems);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart, loading, clearCart, updateCartFromResponse }}>
      {children}
    </CartContext.Provider>
  );
};
