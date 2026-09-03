import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import baseUrl from '../api/baseUrl';

const CartContext = createContext();
const GUEST_CART_KEY = 'guest_cart';

export const useCart = () => useContext(CartContext);

const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const toProductInfo = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price || 0,
  discount: product.discount || 0,
  cover: product.cover || null,
  stock: product.stock || 0,
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      migrateGuestCart(token).finally(() => fetchCart());
    } else {
      setCart(readGuestCart());
    }
  }, [isAuthenticated]);

  const migrateGuestCart = async (token) => {
    const guestItems = readGuestCart();
    if (!guestItems.length) return;

    try {
      for (const item of guestItems) {
        await baseUrl.post(
          'api/carts',
          { productId: item.productId, quantity: item.quantity || 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error migrating guest cart:', error);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCart(readGuestCart());
      return;
    }

    setLoading(true);
    try {
      const { data } = await baseUrl.get('api/carts', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (data && data.items && Array.isArray(data.items)) {
        const cartItems = data.items.map((cartItem) => ({
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          userId: cartItem.userId,
          productInfo: cartItem.product || {
            id: cartItem.productId,
            name: 'منتج غير متاح',
            price: 0,
            cover: null,
          },
        }));
        setCart(cartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');

    if (!token) {
      const current = readGuestCart();
      const existing = current.find((item) => item.productId === product.id);
      let next;
      if (existing) {
        next = current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, productInfo: toProductInfo(product) }
            : item
        );
      } else {
        next = [
          ...current,
          {
            id: `guest-${product.id}`,
            productId: product.id,
            quantity: 1,
            productInfo: toProductInfo(product),
          },
        ];
      }
      writeGuestCart(next);
      setCart(next);
      toast.success(`${product.name} تم إضافته إلى السلة ✅`);
      return;
    }

    setLoading(true);
    try {
      const existingCartItem = cart.find((item) => item.productId === product.id);

      if (existingCartItem) {
        await baseUrl.put(
          `api/carts/${existingCartItem.id}`,
          {
            productId: product.id,
            quantity: existingCartItem.quantity + 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        await baseUrl.post(
          'api/carts',
          {
            productId: product.id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      await fetchCart();
      toast.success(`${product.name} تم إضافته إلى السلة ✅`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'حدث خطأ أثناء إضافة المنتج للسلة';
      toast.error(errorMessage + ' ❌');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      const next = readGuestCart().filter((item) => item.id !== cartId);
      writeGuestCart(next);
      setCart(next);
      toast.info('تمت إزالة المنتج من السلة 🛒');
      return;
    }

    setLoading(true);
    try {
      await baseUrl.delete(`api/carts/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchCart();
      toast.info('تمت إزالة المنتج من السلة 🛒');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('خطأ في إزالة المنتج ❌');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      const next = readGuestCart().map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      );
      writeGuestCart(next);
      setCart(next);
      toast.success('تم تحديث كمية المنتج 🔄');
      return;
    }

    try {
      const cartItem = cart.find((item) => item.id === cartId);
      if (!cartItem) {
        toast.error('عنصر السلة غير موجود');
        return;
      }

      await baseUrl.put(
        `api/carts/${cartId}`,
        {
          productId: cartItem.productId,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await fetchCart();
      toast.success('تم تحديث كمية المنتج 🔄');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('خطأ في تحديث الكمية ❌');
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart([]);
      return;
    }

    try {
      await baseUrl.delete('api/carts/empty', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCart([]);
      toast.success('تم تفريغ السلة بنجاح');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('حدث خطأ أثناء تفريغ السلة');
    }
  };

  const updateCartFromResponse = (cartResponse) => {
    if (cartResponse && cartResponse.items && Array.isArray(cartResponse.items)) {
      const cartItems = cartResponse.items.map((cartItem) => {
        const productId = cartItem.product?.id || cartItem.productId;
        const product = cartItem.product || {};

        return {
          id: cartItem.id,
          productId: productId,
          quantity: cartItem.quantity,
          userId: cartItem.userId || null,
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
            brand: product.brand,
            color: product.color,
            category: product.category,
          },
        };
      });
      setCart(cartItems);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart,
        loading,
        clearCart,
        updateCartFromResponse,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
