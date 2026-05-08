import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const CartContext = createContext(null);

// Hàm hỗ trợ bóc tách giá tiền từ dạng chuỗi (vd: "$1,200.00") sang số thực
const parsePriceToNumber = (price) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const normalized = String(price).replace(/[^0-9.]/g, '');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
};

export const CartProvider = ({ children }) => {
  // === 1. STATE GIỎ HÀNG ===
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // === 2. LIFECYCLE: TẢI & LƯU TRỮ GIỎ HÀNG ===
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('cartItems');
        if (!mounted) return;
        if (stored) setCartItems(JSON.parse(stored));
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem('cartItems', JSON.stringify(cartItems)).catch(() => {});
  }, [cartItems, loading]);

  // === 3. CÁC HÀM THAO TÁC VỚI SẢN PHẨM TRONG GIỎ ===
  // Thêm mới sản phẩm vào giỏ (Gộp số lượng nếu trùng Size & Màu)
  const addToCart = useCallback(({ product, size, color }) => {
    if (!product) return;
    const key = `${product.id}__${size ?? ''}__${color ?? ''}`;

    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          key,
          product,
          size,
          color,
          unitPrice: parsePriceToNumber(product.price),
          quantity: 1,
        },
      ];
    });
  }, []);

  // Tăng số lượng 1 sản phẩm
  const increaseQty = useCallback((key) => {
    setCartItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item)));
  }, []);

  // Giảm số lượng 1 sản phẩm (Sẽ bị xóa khỏi giỏ nếu giảm về 0)
  const decreaseQty = useCallback((key) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Các hàm tiện ích bổ sung: Xóa, Làm trống giỏ, Ghi đè lại giỏ hàng (dùng khi mua lại)
  const removeItem = useCallback((key) => setCartItems((prev) => prev.filter((x) => x.key !== key)), []);
  const clearCart = useCallback(() => setCartItems([]), []);
  const replaceCart = useCallback((items) => setCartItems(Array.isArray(items) ? items : []), []);

  // === 4. TỰ ĐỘNG TÍNH TOÁN TỔNG TIỀN (MEMO) ===
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
    const shipping = subtotal > 0 ? 0 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  const value = useMemo(
    () => ({ cartItems, loading, totals, addToCart, increaseQty, decreaseQty, removeItem, clearCart, replaceCart }),
    [cartItems, loading, totals, addToCart, increaseQty, decreaseQty, removeItem, clearCart, replaceCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
