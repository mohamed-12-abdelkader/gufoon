import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import baseUrl from '../api/baseUrl';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart on startup
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(localCart);
    }
  }, [isAuthenticated]);

  // Fetch cart from API for authenticated users
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await baseUrl.get('/carts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async product => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await baseUrl.post('/carts', { productId: product.id, quantity: 1 }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        fetchCart();
      } else {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = localCart.find(item => item.productId === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          localCart.push({
            id: Date.now(), // Temporary ID for local cart
            productId: product.id,
            quantity: 1,
            productInfo: product,
          });
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
      }

      toast.success(`${product.name} تم إضافته إلى السلة ✅`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء إضافة المنتج للسلة ❌');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart using `cartId`
  const removeFromCart = async cartId => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await baseUrl.delete(`/carts/${cartId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        fetchCart();
      } else {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        localCart = localCart.filter(item => item.id !== cartId);
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
      }

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
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }

    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await baseUrl.put(`/carts/${cartId}`, { quantity: newQuantity }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        fetchCart();
      } else {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = localCart.findIndex(item => item.id === cartId);

        if (itemIndex !== -1) {
          localCart[itemIndex].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(localCart));
          setCart(localCart);
        }
      }

      toast.success('تم تحديث كمية المنتج 🔄');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('خطأ في تحديث الكمية ❌');
    }
  };

  // Merge local cart with backend after login
  const mergeCartAfterLogin = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (localCart.length > 0 && isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await Promise.all(
          localCart.map(item =>
            baseUrl.post('/carts', { productId: item.productId, quantity: item.quantity }, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
          )
        );
        localStorage.removeItem('cart');
        fetchCart();
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await baseUrl.delete('/carts/empty', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        fetchCart();
      } else {
        localStorage.removeItem('cart');
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      mergeCartAfterLogin();
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart, loading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
