import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';

const SearchScreen = ({ onBackHome, onProfile, isDarkMode }) => {
  // === 1. KHỞI TẠO HOOKS & STATE ===
  const { width } = useWindowDimensions();
  const { products, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');

  const effectiveCategory = selectedCategory || categories?.[0]?.label || '';

  const bg = isDarkMode ? '#0F172A' : '#FFF';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';
  const searchBg = isDarkMode ? '#1E293B' : '#F8FAFC';

  // === 2. LỌC SẢN PHẨM THEO TỪ KHÓA VÀ DANH MỤC (MEMO) ===
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return (products || []).filter((product) => {
      const matchesCategory = effectiveCategory ? product.category === effectiveCategory : true;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;
      return product.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query, effectiveCategory, products]);

  // === 3. COMPONENT CON (RENDER ITEM GRID) ===
  const renderGridItem = ({ item }) => (
    <View style={[styles.bikeCard, { backgroundColor: cardBg, borderColor: border, width: (width - 60) / 2 }]}>
      <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#334155' : '#F8FAFC' }]}>
        {item.tag && (
          <View style={[styles.tagBadge, { backgroundColor: item.tag === 'NEW' ? '#0ea5e9' : '#fca5a5' }]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        )}
        <View style={[styles.ratingBadge, { backgroundColor: cardBg }]}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.ratingBadgeText, { color: textMain }]}>{item.rating || '4.8'}</Text>
        </View>
        <Image source={item.image} style={styles.bikeImage} resizeMode="contain" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.bikeName, { color: textMain }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.bikePrice}>{item.price}</Text>
      </View>
    </View>
  );

  // === 4. COMPONENT CON (RENDER HEADER CỦA LIST) ===
  const ListHeader = () => (
    <View>
      <View style={styles.searchSection}>
        <View style={[styles.searchWrapper, { backgroundColor: searchBg, borderColor: border }]}>
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            style={[styles.searchInput, { color: textMain }]}
            placeholder="Tìm kiếm xe đạp..."
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
          />
          <MaterialCommunityIcons name="tune-variant" size={20} color="#64748B" />
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        data={categories || []}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const isActive = item.label === effectiveCategory;
          return (
            <TouchableOpacity
              style={[styles.catBtn, { backgroundColor: searchBg }, isActive && styles.catBtnActive]}
              onPress={() => setSelectedCategory(item.label)}
            >
              <Text style={[styles.catBtnText, isActive && styles.catBtnTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.featuredCard, { backgroundColor: cardBg, borderColor: border }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505705422147-5e98f963b5f0?q=80&w=500' }}
          style={styles.featuredImage}
        />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredTag}>SỰ LỰA CHỌN TỐT NHẤT</Text>
          <Text style={[styles.featuredTitle, { color: textMain }]}>City Glide Electric</Text>
          <Text style={styles.featuredPrice}>$3,200.00</Text>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // === 5. RENDER GIAO DIỆN CHÍNH ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBackHome}>
          <Feather name="menu" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bike World</Text>
        <Feather name="shopping-cart" size={24} color="#0ea5e9" />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollContent}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  scrollContent: { 
    paddingBottom: 100 
  },

  // ==========================================
  // PHẦN HEADER
  // ==========================================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },

  // ==========================================
  // THANH TÌM KIẾM
  // ==========================================
  searchSection: { 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 15, 
    color: '#334155' 
  },

  // ==========================================
  // DANH MỤC LỌC NHANH (SCROLL NGANG)
  // ==========================================
  catScroll: { 
    paddingLeft: 20, 
    marginVertical: 20, 
    maxHeight: 50 
  },
  catBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    backgroundColor: '#F1F5F9', 
    borderRadius: 12, 
    marginRight: 10 
  },
  catBtnActive: { 
    backgroundColor: '#E0F2FE' 
  },
  catBtnText: { 
    fontSize: 13, 
    color: '#64748B' 
  },
  catBtnTextActive: { 
    color: '#0ea5e9', 
    fontWeight: 'bold' 
  },

  // ==========================================
  // DANH SÁCH LƯỚI SẢN PHẨM (GRID PRODUCTS)
  // ==========================================
  row: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  bikeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: { 
    height: 140, 
    backgroundColor: '#F8FAFC' 
  },
  bikeImage: { 
    width: '100%', 
    height: '100%' 
  },
  tagBadge: { 
    position: 'absolute', 
    top: 8, 
    left: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    zIndex: 1 
  },
  tagText: { 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  ratingBadgeText: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginLeft: 4 
  },
  cardInfo: { 
    padding: 12 
  },
  bikeName: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  bikePrice: { 
    fontSize: 14, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginTop: 4 
  },

  // ==========================================
  // SẢN PHẨM NỔI BẬT (FEATURED CARD)
  // ==========================================
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    height: 160,
    overflow: 'hidden',
  },
  featuredImage: { 
    width: '40%', 
    height: '100%' 
  },
  featuredInfo: { 
    flex: 1, 
    padding: 15, 
    justifyContent: 'center' 
  },
  featuredTag: { 
    fontSize: 9, 
    color: '#B45309', 
    fontWeight: 'bold' 
  },
  featuredTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  featuredPrice: { 
    fontSize: 14, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginVertical: 5 
  },
  viewBtn: { 
    backgroundColor: '#0ea5e9', 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  viewBtnText: { 
    color: '#FFF', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },

  // ==========================================
  // BOTTOM NAVIGATION (Nếu Có)
  // ==========================================
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: 70,
  },
  navItem: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  navText: { 
    fontSize: 10, 
    color: '#94a3b8', 
    marginTop: 4 
  },
  activeNavText: { 
    color: '#0ea5e9', 
    fontWeight: '600' 
  },
});

export default SearchScreen;
