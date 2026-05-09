import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';

const HomeScreen = ({ user, onOpenProduct, onOpenChat }) => {
  // === 1. LẤY DỮ LIỆU TỪ HOOKS & CONTEXT ===
  const { width } = useWindowDimensions();
  const { products, categories } = useProducts();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('');

  // === 2. XỬ LÝ LOGIC HIỂN THỊ (MEMO KHÔNG RENDER LẠI) ===
  // Xác định danh mục nào đang được chọn ở thanh ngang
  const effectiveCategoryKey = selectedCategoryKey || categories?.[0]?.key || '';
  const selectedCategoryLabel = useMemo(
    () => categories?.find((c) => c.key === effectiveCategoryKey)?.label ?? '',
    [categories, effectiveCategoryKey]
  );

  // Lọc sản phẩm tương ứng với Danh mục đã chọn để hiển thị (Lấy tối đa 4 sp)
  const selectedProducts = useMemo(() => {
    const list = (products || []).filter((p) => (selectedCategoryLabel ? p.category === selectedCategoryLabel : true));
    const base = list.length ? list : products || [];
    return base.slice(0, 4);
  }, [products, selectedCategoryLabel]);

  // Sản phẩm nổi bật (Lấy sản phẩm thứ 2 để không trùng với Hero Banner)
  const featuredProduct = useMemo(() => products?.[1] || products?.[0], [products]);

  // === 3. TẠO CẤU TRÚC GIAO DIỆN CHÍNH ===
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Header Hiện Đại --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Xin chào, {user?.name ?? 'Rider'}</Text>
          <Text style={styles.headerTitle}>Bike World</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Banner Khuyến Mãi (Hero Section) --- */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTag}>#MỚI_VỀ</Text>
            <Text style={styles.heroMainTitle}>Sẵn sàng cho{"\n"}hành trình mới?</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={products?.[0]?.image} 
            style={styles.heroImage} 
            resizeMode="contain" 
          />
        </View>

        {/* --- Danh Mục (Cuộn ngang) --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bộ sưu tập</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Tất cả</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {(categories || []).map((c) => {
              const isActive = c.key === effectiveCategoryKey;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.catCard, isActive && styles.catCardActive]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedCategoryKey(c.key)}
                >
                  <View style={[styles.catIconWrap, isActive && styles.catIconWrapActive]}>
                    {c.image ? (
                      <Image source={{ uri: c.image }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                    ) : (
                      <Ionicons name="bicycle" size={20} color={isActive ? '#FFF' : '#0EA5E9'} />
                    )}
                  </View>
                  <Text style={[styles.catText, isActive && styles.catTextActive]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- Sản Phẩm Nổi Bật --- */}
        {featuredProduct && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sự lựa chọn tốt nhất</Text>
            </View>
            <TouchableOpacity 
              style={styles.featuredCard}
              activeOpacity={0.9}
              onPress={() => onOpenProduct?.(featuredProduct)}
            >
              <View style={styles.featuredImageBg}>
                <Image source={featuredProduct.image} style={styles.featuredImg} resizeMode="contain" />
                <View style={styles.featuredTag}>
                  <Text style={styles.featuredTagText}>HOT</Text>
                </View>
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredCategory}>{featuredProduct.category}</Text>
                <Text style={styles.featuredName} numberOfLines={2}>{featuredProduct.name}</Text>
                <View style={styles.featuredPriceRow}>
                  <Text style={styles.featuredPrice}>{featuredProduct.price}</Text>
                  <View style={styles.featuredRating}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.featuredRatingText}>{featuredProduct.rating || '4.9'}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* --- Gợi Ý Sản Phẩm (Gird) --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{selectedCategoryLabel || 'Sản phẩm gợi ý'}</Text>
            <Text style={styles.sectionHint}>Hiển thị 4 mẫu</Text>
          </View>
          <View style={styles.productGrid}>
            {selectedProducts.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.productCard, { width: (width - 60) / 2 }]}
                onPress={() => onOpenProduct?.(item)}
              >
                <View style={styles.productImageBg}>
                  <Image source={item.image} style={styles.productImg} resizeMode="contain" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={{ fontSize: 10, color: '#64748B', marginLeft: 4, fontWeight: 'bold' }}>{item.rating || '4.8'}</Text>
                  </View>
                  <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <TouchableOpacity style={styles.addBtn}>
                      <Ionicons name="add" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Nút Chatbot Hỗ Trợ (Floating Action Button) */}
      <TouchableOpacity style={styles.fab} onPress={onOpenChat} activeOpacity={0.8}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH VÀ KHU VỰC CUỘN
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#FBFDFF' 
  },
  scrollContent: { 
    paddingBottom: 110 
  },

  // ==========================================
  // PHẦN HEADER HIỆN ĐẠI
  // ==========================================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerGreeting: { 
    fontSize: 13, 
    color: '#94A3B8', 
    fontWeight: '500' 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#0F172A', 
    letterSpacing: -0.5 
  },

  // ==========================================
  // BANNER KHUYẾN MÃI (HERO SECTION)
  // ==========================================
  heroSection: {
    marginHorizontal: 24,
    marginTop: 10,
    backgroundColor: '#0EA5E9',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 180,
  },
  heroTextContent: { 
    flex: 1, 
    zIndex: 2 
  },
  heroTag: { 
    color: '#BAE6FD', 
    fontWeight: '800', 
    fontSize: 11, 
    marginBottom: 4 
  },
  heroMainTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    lineHeight: 26 
  },
  heroBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  heroBtnText: { 
    color: '#0EA5E9', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  heroImage: {
    position: 'absolute',
    right: -30,
    bottom: -10,
    width: 200,
    height: 160,
    transform: [{ rotate: '-10deg' }],
  },
  
  // ==========================================
  // CÁC SECTION TIÊU ĐỀ
  // ==========================================
  section: { 
    marginTop: 24, 
    paddingHorizontal: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  seeAll: { 
    fontSize: 13, 
    color: '#0EA5E9', 
    fontWeight: '600' 
  },
  sectionHint: { 
    fontSize: 12, 
    color: '#94A3B8', 
    fontWeight: '600' 
  },

  // ==========================================
  // DANH MỤC LỌC NHANH
  // ==========================================
  catList: { 
    paddingRight: 14 
  },
  catCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginRight: 12,
    width: 98,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  catCardActive: { 
    backgroundColor: '#0EA5E9', 
    borderColor: '#0EA5E9' 
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIconWrapActive: { 
    backgroundColor: 'rgba(255,255,255,0.2)' 
  },
  catText: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#64748B' 
  },
  catTextActive: { 
    color: '#FFF' 
  },

  // ==========================================
  // SẢN PHẨM NỔI BẬT
  // ==========================================
  featuredCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  featuredImageBg: {
    width: 120,
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImg: {
    width: '90%',
    height: '90%',
  },
  featuredTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  featuredCategory: {
    fontSize: 11,
    color: '#0EA5E9',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  featuredPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredRatingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // ==========================================
  // LƯỚI SẢN PHẨM GỢI Ý
  // ==========================================
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  productImageBg: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: { 
    width: '100%', 
    height: '100%' 
  },
  productInfo: { 
    padding: 6, 
    marginTop: 4 
  },
  productCategory: { 
    fontSize: 10, 
    color: '#94A3B8', 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  productName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1E293B', 
    marginTop: 2 
  },
  productPriceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10 
  },
  productPrice: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#0EA5E9' 
  },
  addBtn: {
    backgroundColor: '#1E293B',
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==========================================
  // NÚT CHAT HỖ TRỢ TRỰC TUYẾN (FAB)
  // ==========================================
  fab: {
    position: 'absolute',
    bottom: 90, // Đặt cao hơn 90px để không bị che bởi thanh Menu bên dưới
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981', // Màu xanh lá thân thiện
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
});

export default HomeScreen;
