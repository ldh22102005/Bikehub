import React, { useMemo, useState } from 'react';
import { Alert, Image, View, ScrollView, StyleSheet, Text, Pressable, TextInput } from 'react-native';

import { useProducts } from '../hooks/useProducts';

const normalize = (v) => String(v ?? '').toLowerCase();

const stockBadge = (qty) => {
  const n = Number(qty || 0);
  if (!Number.isFinite(n) || n <= 0) return { label: 'Out of Stock', color: '#EF4444' };
  if (n <= 3) return { label: `${n} left`, color: '#F59E0B' };
  return { label: `${n} in stock`, color: '#22C55E' };
};

export default function AdminProductsScreen({ onNavigate, onLogout, onEditProduct }) {
  // === 1. KHỞI TẠO STATE & HOOKS ===
  const { products: allProducts, deleteProduct } = useProducts();
  const [searchText, setSearchText] = useState('');

  // === 2. TÌM KIẾM VÀ LỌC SẢN PHẨM (MEMO) ===
  const products = useMemo(() => {
    const q = normalize(searchText).trim();
    return (allProducts || []).filter((p) => {
      if (!q) return true;
      return normalize(p?.name).includes(q) || normalize(p?.category).includes(q) || normalize(p?.id).includes(q);
    });
  }, [searchText, allProducts]);

  // === 3. HÀM XÁC NHẬN XÓA SẢN PHẨM ===
  const confirmDelete = (p) => {
    const id = p?.id;
    if (!id) return;
    Alert.alert('Xoá sản phẩm?', 'Thao tác này không thể hoàn tác.', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteProduct?.(id) },
    ]);
  };

  // === 4. RENDER GIAO DIỆN QUẢN LÝ SẢN PHẨM ===
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarIcon}>☰</Text>
        <Text style={styles.topBarTitle}>BIKE WORLD</Text>
        <View style={styles.topBarRight}>
          <Pressable style={styles.adminPanelBtn} onPress={() => onNavigate?.('Dashboard')}>
            <Text style={styles.adminPanelText}>Dashboard</Text>
          </Pressable>
          <Pressable onPress={onLogout} hitSlop={8}>
            <Text style={[styles.topBarIcon, { color: '#ef4444' }]}>Đăng xuất</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sản phẩm</Text>
          <Text style={styles.headerSubtitle}>Danh sách sản phẩm (lưu bằng AsyncStorage).</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <Pressable style={[styles.addButton, { flex: 1, marginBottom: 0 }]} onPress={() => onNavigate?.('AddProduct')}>
            <Text style={styles.addButtonIcon}>＋</Text>
            <Text style={styles.addButtonText}>Thêm SP</Text>
          </Pressable>
          <Pressable style={[styles.addButton, { flex: 1, marginBottom: 0, backgroundColor: '#10B981' }]} onPress={() => onNavigate?.('CategoryManagement')}>
            <Text style={styles.addButtonIcon}>📋</Text>
            <Text style={styles.addButtonText}>Danh mục</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput value={searchText} onChangeText={setSearchText} placeholder="Tìm sản phẩm..." placeholderTextColor="#94a3b8" style={styles.searchInput} />
        </View>

        {products.map((p) => (
          <View key={String(p.id)} style={styles.productCard}>
            <View style={styles.productImage}>
              {p.image ? <Image source={p.image} style={styles.productImg} resizeMode="contain" /> : <Text style={styles.productImageText}>🚲</Text>}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.productSku} numberOfLines={1}>
                {p.category}
              </Text>
              <Text style={styles.productPrice}>{p.price}</Text>
              {(() => {
                const s = stockBadge(p.stockQty);
                return <Text style={[styles.productStock, { color: s.color }]}>{s.label}</Text>;
              })()}
            </View>
            <View style={styles.productActions}>
              <Pressable style={styles.actionBtn} onPress={() => onEditProduct?.(p)}>
                <Text style={styles.actionIcon}>✎</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(p)}>
                <Text style={styles.actionIcon}>🗑</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  spacer: {
    height: 120,
  },

  // ==========================================
  // THANH ĐIỀU HƯỚNG TRÊN (TOP BAR)
  // ==========================================
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 30,
  },
  topBarIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminPanelBtn: {
    backgroundColor: '#00A8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  adminPanelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // TIÊU ĐỀ TRANG (HEADER)
  // ==========================================
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },

  // ==========================================
  // NÚT THAO TÁC (ADD BUTTON)
  // ==========================================
  addButton: {
    backgroundColor: '#00A8E8',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // TÌM KIẾM (SEARCH)
  // ==========================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
  },

  // ==========================================
  // THẺ SẢN PHẨM (PRODUCT CARD)
  // ==========================================
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImageText: {
    fontSize: 32,
  },
  productImg: {
    width: 54,
    height: 54,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  productSku: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00A8E8',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 11,
    color: '#999',
  },

  // ==========================================
  // THAO TÁC SẢN PHẨM (ACTIONS)
  // ==========================================
  productActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
  },
});
