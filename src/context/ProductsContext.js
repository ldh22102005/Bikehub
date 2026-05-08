import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { bikeCategories as DEFAULT_CATEGORIES, bikeData as DEFAULT_PRODUCTS } from '../data/products';

export const ProductsContext = createContext(null);

// === CÁC BIẾN & HÀM TIỆN ÍCH (HELPERS) ===
const STORAGE_KEY = 'products_v1';
const CATEGORIES_KEY = 'categories_v1';

const normalize = (v) => String(v ?? '').trim();
const normalizeLower = (v) => normalize(v).toLowerCase();

const makeCategoryKey = (label) =>
  normalize(label)
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `cat-${Date.now()}`;

const normalizeImageItem = (img) => {
  if (!img) return null;
  if (typeof img === 'number') return img; // require(...)
  if (typeof img === 'object' && img.uri) return { uri: String(img.uri) };
  return null;
};

const ensureProductShape = (p) => {
  if (!p) return null;
  const id = String(p.id ?? '').trim() || String(Date.now());
  const stockQty = Number.isFinite(Number(p.stockQty)) ? Math.max(0, Number(p.stockQty)) : 0;

  const image = normalizeImageItem(p.image);
  const images = Array.isArray(p.images) ? p.images.map(normalizeImageItem).filter(Boolean) : [];
  const ensuredImages = images.length ? images : image ? [image] : [];
  const primaryImage = ensuredImages[0] ?? null;
  return {
    id,
    name: normalize(p.name),
    price: normalize(p.price),
    category: normalize(p.category),
    categoryKey: normalize(p.categoryKey),
    images: ensuredImages,
    image: primaryImage,
    tag: p.tag,
    stockQty,
  };
};

export const ProductsProvider = ({ children }) => {
  // === 1. STATE KHỞI TẠO ===
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // === 2. LIFECYCLE: LẤY DỮ LIỆU LƯU TRỮ KHI MỞ APP ===
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [storedProducts, storedCategories] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(CATEGORIES_KEY),
        ]);

        if (!mounted) return;

        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed) && parsed.length) {
            const next = parsed.map(ensureProductShape).filter(Boolean);
            if (next.length) setProducts(next);
          }
        }

        if (storedCategories) {
          const parsedCat = JSON.parse(storedCategories);
          if (Array.isArray(parsedCat) && parsedCat.length) {
            setCategories(
              parsedCat
                .map((c) => ({ key: normalize(c?.key), label: normalize(c?.label) }))
                .filter((c) => c.key && c.label)
            );
          }
        }
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

  // Migration: Tự động đồng bộ (gắn categoryKey) cho các sản phẩm dữ liệu cũ
  useEffect(() => {
    if (loading) return;
    if (!Array.isArray(products) || products.length === 0) return;
    if (!Array.isArray(categories) || categories.length === 0) return;

    const labelToKey = new Map(categories.map((c) => [normalizeLower(c.label), normalize(c.key)]));
    let changed = false;

    const next = products.map((p) => {
      if (!p) return p;
      if (normalize(p.categoryKey)) return p;
      const inferred = labelToKey.get(normalizeLower(p.category));
      if (!inferred) return p;
      changed = true;
      return { ...p, categoryKey: inferred };
    });

    if (changed) setProducts(next);
  }, [loading, products, categories]);

  // Tự động lưu Danh sách sản phẩm xuống máy mỗi khi có cập nhật
  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products)).catch(() => {});
  }, [products, loading]);

  // Tự động lưu Danh mục xuống máy mỗi khi có cập nhật
  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)).catch(() => {});
  }, [categories, loading]);

  // === 3. CÁC HÀM TƯƠNG TÁC DỮ LIỆU (ACTIONS) ===
  const categoriesByLabel = useMemo(() => new Map(categories.map((c) => [c.label, c.key])), [categories]);
  const categoriesByKey = useMemo(() => new Map(categories.map((c) => [c.key, c.label])), [categories]);

  // ---- XỬ LÝ DANH MỤC (Thêm / Sửa / Xóa) ----
  const addCategory = useCallback(
    (label, image) => {
      const cleanLabel = normalize(label);
      if (!cleanLabel) return null;
      const existing = categories.find((c) => normalizeLower(c.label) === normalizeLower(cleanLabel));
      if (existing) return existing;

      const next = { key: makeCategoryKey(cleanLabel), label: cleanLabel, image: image ?? null };
      setCategories((prev) => [next, ...prev]);
      return next;
    },
    [categories]
  );

  const updateCategory = useCallback((key, nextLabel, image) => {
    const targetKey = normalize(key);
    const cleanLabel = normalize(nextLabel);
    if (!targetKey || !cleanLabel) return { ok: false, message: 'Thiếu thông tin.' };

    setCategories((prev) => {
      const duplicate = prev.find((c) => normalizeLower(c.label) === normalizeLower(cleanLabel) && normalize(c.key) !== targetKey);
      if (duplicate) return prev;
      return prev.map((c) => (normalize(c.key) === targetKey ? { ...c, label: cleanLabel, image: image ?? c.image } : c));
    });

    setProducts((prev) =>
      prev.map((p) => {
        if (normalize(p.categoryKey) !== targetKey) return p;
        return ensureProductShape({ ...p, category: cleanLabel });
      })
    );

    return { ok: true };
  }, []);

  const deleteCategory = useCallback((key) => {
    const targetKey = normalize(key);
    if (!targetKey) return;
    setCategories((prev) => prev.filter((c) => normalize(c.key) !== targetKey));
    setProducts((prev) =>
      prev.map((p) => {
        if (normalize(p.categoryKey) !== targetKey) return p;
        return ensureProductShape({ ...p, categoryKey: '', category: '' });
      })
    );
  }, []);

  // ---- XỬ LÝ SẢN PHẨM (Thêm / Sửa / Xóa) ----
  const addProduct = useCallback(
    ({ name, price, categoryLabel, images, image, stockQty }) => {
      const cleanName = normalize(name);
      const cleanPrice = normalize(price);
      const cleanCategoryLabel = normalize(categoryLabel);
      if (!cleanName || !cleanPrice || !cleanCategoryLabel) return { ok: false, message: 'Vui lòng nhập đủ Tên, Giá, Danh mục.' };

      const ensuredCategory =
        categories.find((c) => normalizeLower(c.label) === normalizeLower(cleanCategoryLabel)) ||
        addCategory(cleanCategoryLabel) ||
        { key: '', label: cleanCategoryLabel };

      const newProduct = ensureProductShape({
        id: `P-${Date.now()}`,
        name: cleanName,
        price: cleanPrice,
        category: ensuredCategory.label,
        categoryKey: ensuredCategory.key,
        images: Array.isArray(images) && images.length ? images : image ? [image] : [],
        image: image ?? null,
        stockQty: Number.isFinite(Number(stockQty)) ? Number(stockQty) : 0,
      });

      setProducts((prev) => [newProduct, ...prev]);
      return { ok: true, product: newProduct };
    },
    [categories, addCategory]
  );

  const updateProduct = useCallback(
    (id, patch) => {
      const targetId = String(id ?? '');
      const nextPatch = patch || {};

      const categoryLabel = nextPatch.categoryLabel ?? nextPatch.category;
      let ensuredCategory = null;
      if (categoryLabel !== undefined) {
        const cleanLabel = normalize(categoryLabel);
        if (cleanLabel) {
          ensuredCategory =
            categories.find((c) => normalizeLower(c.label) === normalizeLower(cleanLabel)) ||
            addCategory(cleanLabel) ||
            { key: '', label: cleanLabel };
        } else {
          ensuredCategory = { key: '', label: '' };
        }
      }

      setProducts((prev) =>
        prev.map((p) => {
          if (String(p.id) !== targetId) return p;
          const merged = { ...p, ...nextPatch };
          if (ensuredCategory) {
            merged.category = ensuredCategory.label;
            merged.categoryKey = ensuredCategory.key;
          }
          return ensureProductShape(merged);
        })
      );
    },
    [categories, addCategory]
  );

  const deleteProduct = useCallback((id) => {
    const targetId = String(id ?? '');
    setProducts((prev) => prev.filter((p) => String(p.id) !== targetId));
  }, []);

  // Trừ số lượng tồn kho của sản phẩm sau khi Khách đặt hàng thành công
  const applyPurchase = useCallback((cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;
    const qtyByProductId = new Map();
    for (const item of cartItems) {
      const pid = item?.product?.id;
      if (!pid) continue;
      const q = Number(item?.quantity || 0);
      if (!Number.isFinite(q) || q <= 0) continue;
      const key = String(pid);
      qtyByProductId.set(key, (qtyByProductId.get(key) || 0) + q);
    }
    if (qtyByProductId.size === 0) return;

    setProducts((prev) =>
      prev.map((p) => {
        const used = qtyByProductId.get(String(p.id)) || 0;
        if (!used) return p;
        const nextStock = Math.max(0, Number(p.stockQty || 0) - used);
        return { ...p, stockQty: nextStock };
      })
    );
  }, []);

  // Đóng gói dữ liệu và hàm để chia sẻ cho toàn bộ App
  const value = useMemo(
    () => ({
      loading,
      products,
      categories,
      categoriesByLabel,
      categoriesByKey,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      applyPurchase,
    }),
    [
      loading,
      products,
      categories,
      categoriesByLabel,
      categoriesByKey,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      applyPurchase,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
