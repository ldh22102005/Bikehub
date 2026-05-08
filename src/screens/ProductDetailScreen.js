import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useFavorites';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['#0F172A', '#0ea5e9', '#94a3b8'];

const ProductDetailScreen = ({ onBack, onAddToCart, product, isDarkMode }) => {
  // === 1. KHỞI TẠO STATE & HOOKS ===
  const { products } = useProducts();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('#0F172A');
  const [userRating, setUserRating] = useState(0);

  // === 2. XỬ LÝ LOGIC DỮ LIỆU (MEMO) ===
  const fallback = products?.[0];
  const currentProduct = useMemo(() => product ?? fallback, [product, fallback]);
  const isFav = isFavorite(currentProduct?.id);
  const productImages = useMemo(() => {
    const imgs = currentProduct?.images?.length ? currentProduct.images : currentProduct?.image ? [currentProduct.image] : [];
    return imgs.length ? imgs : fallback?.images?.length ? fallback.images : fallback?.image ? [fallback.image] : [];
  }, [currentProduct, fallback]);
  const productImage = productImages?.[0];
  const productName = currentProduct?.name ?? 'Bike';
  const productPrice = currentProduct?.price ?? '$0.00';

  const bg = isDarkMode ? '#0F172A' : '#FFF';
  const cardBg = isDarkMode ? '#1E293B' : '#F8FAFC';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const textTitle = isDarkMode ? '#F8FAFC' : '#1e293b';
  const border = isDarkMode ? '#334155' : '#F1F5F9';
  const bottomBarBg = isDarkMode ? '#1E293B' : '#FFF';

  // === 3. RENDER GIAO DIỆN CHÍNH ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textMain }]}>Bike World</Text>
        <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => toggleFavorite(currentProduct)}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#ef4444" : "#0ea5e9"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="share-2" size={22} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Carousel Area */}
        <View style={styles.imageContainer}>
          {!!productImage && <Image source={productImage} style={styles.mainImage} resizeMode="contain" />}
          {/* Pagination dots imitation */}
          <View style={styles.pagination}>
            {Array.from({ length: Math.max(1, Math.min(5, productImages.length || 0)) }).map((_, idx) => (
              <View key={idx} style={[styles.dot, idx === 0 && styles.activeDot]} />
            ))}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.tag}>NEW ARRIVAL</Text>
          <Text style={[styles.productName, { color: textTitle }]}>{productName}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Ionicons name="star-half" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>4.8 (124 đánh giá)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{productPrice}</Text>
            <Text style={styles.oldPrice}>$4,999.00</Text>
          </View>

          <Text style={styles.description}>
            Designed for the uncompromising rider, the Stratus Pro combines an ultra-lightweight carbon frame with professional-grade aerodynamics. Experience the sensation of pure speed and effortless climbing with our most advanced drivetrain system yet.
          </Text>

          {/* Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={[styles.specItem, { backgroundColor: cardBg }]}>
              <Feather name="shopping-bag" size={20} color="#0ea5e9" />
              <View style={styles.specTextContent}>
                <Text style={styles.specLabel}>WEIGHT</Text>
                <Text style={[styles.specValue, { color: textMain }]}>6.8 kg</Text>
              </View>
            </View>
            <View style={[styles.specItem, { backgroundColor: cardBg }]}>
              <MaterialCommunityIcons name="layers-triple-outline" size={20} color="#0ea5e9" />
              <View style={styles.specTextContent}>
                <Text style={styles.specLabel}>GROUP SET</Text>
                <Text style={[styles.specValue, { color: textMain }]}>Shimano Ultegra</Text>
              </View>
            </View>
            <View style={[styles.specItem, { backgroundColor: cardBg }]}>
              <MaterialCommunityIcons name="speedometer" size={20} color="#0ea5e9" />
              <View style={styles.specTextContent}>
                <Text style={styles.specLabel}>GEARS</Text>
                <Text style={[styles.specValue, { color: textMain }]}>22 Speed</Text>
              </View>
            </View>
            <View style={[styles.specItem, { backgroundColor: cardBg }]}>
              <Ionicons name="scan-outline" size={20} color="#0ea5e9" />
              <View style={styles.specTextContent}>
                <Text style={styles.specLabel}>MATERIAL</Text>
                <Text style={[styles.specValue, { color: textMain }]}>T1100 Carbon</Text>
              </View>
            </View>
          </View>

          {/* Select Size */}
          <Text style={[styles.sectionTitle, { color: textMain }]}>Select Frame Size</Text>
          <View style={styles.optionsRow}>
            {SIZES.map((size) => (
              <TouchableOpacity 
                key={size} 
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeBtn, { backgroundColor: cardBg, borderColor: border }, selectedSize === size && styles.activeSizeBtn]}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Select Color */}
          <Text style={[styles.sectionTitle, { color: textMain }]}>Frame Color</Text>
          <View style={styles.optionsRow}>
            {COLORS.map((color) => (
              <TouchableOpacity 
                key={color} 
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle, 
                  { backgroundColor: color },
                  selectedColor === color && styles.activeColorCircle
                ]} 
              />
            ))}
          </View>

          {/* Đánh giá của người dùng */}
          <Text style={[styles.sectionTitle, { color: textMain }]}>Đánh giá của bạn</Text>
          <View style={styles.ratingInputRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <Ionicons
                  name={userRating >= star ? 'star' : 'star-outline'}
                  size={32}
                  color="#F59E0B"
                  style={{ marginRight: 8 }}
                />
              </TouchableOpacity>
            ))}
            {userRating > 0 && <Text style={styles.thanksText}>Cảm ơn bạn!</Text>}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: bottomBarBg, borderTopColor: border }]}>
        <TouchableOpacity style={[styles.cartBtn, { borderColor: border }]}>
          <Feather name="shopping-cart" size={20} color={textMain} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            onAddToCart?.({
              product: currentProduct,
              size: selectedSize,
              color: selectedColor,
            })
          }
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 140 
  },

  // ==========================================
  // PHẦN HEADER
  // ==========================================
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  headerIcons: { 
    flexDirection: 'row' 
  },
  headerIconBtn: { 
    marginRight: 15 
  },

  // ==========================================
  // HÌNH ẢNH SẢN PHẨM & TRƯỢT ẢNH
  // ==========================================
  imageContainer: { 
    height: 300, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  mainImage: { 
    width: '90%', 
    height: '100%' 
  },
  pagination: { 
    flexDirection: 'row', 
    position: 'absolute', 
    bottom: 20 
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#E2E8F0', 
    marginHorizontal: 3 
  },
  activeDot: { 
    backgroundColor: '#0ea5e9', 
    width: 12 
  },

  // ==========================================
  // THÔNG TIN CƠ BẢN SẢN PHẨM
  // ==========================================
  detailsContainer: { 
    paddingHorizontal: 20, 
    marginTop: 10 
  },
  tag: { 
    fontSize: 10, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  productName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginTop: 5 
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8 
  },
  ratingText: { 
    fontSize: 13, 
    color: '#64748B', 
    marginLeft: 8, 
    fontWeight: '600' 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 
  },
  price: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0ea5e9', 
    marginRight: 10 
  },
  oldPrice: { 
    fontSize: 14, 
    color: '#94a3b8', 
    textDecorationLine: 'line-through' 
  },
  description: { 
    fontSize: 14, 
    color: '#64748B', 
    lineHeight: 22, 
    marginTop: 15 
  },

  // ==========================================
  // BẢNG THÔNG SỐ KỸ THUẬT (SPECS)
  // ==========================================
  specsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 25 
  },
  specItem: { 
    width: '48%', 
    backgroundColor: '#F8FAFC', 
    borderRadius: 12, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  specTextContent: { 
    marginLeft: 10 
  },
  specLabel: { 
    fontSize: 10, 
    color: '#94a3b8', 
    fontWeight: 'bold' 
  },
  specValue: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#334155' 
  },

  // ==========================================
  // TÙY CHỌN SẢN PHẨM (SIZE & MÀU MÀU)
  // ==========================================
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginTop: 20, 
    marginBottom: 15 
  },
  optionsRow: { 
    flexDirection: 'row', 
    marginBottom: 10 
  },
  sizeBtn: { 
    width: 50, 
    height: 40, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12, 
    backgroundColor: '#F8FAFC' 
  },
  activeSizeBtn: { 
    borderColor: '#0ea5e9', 
    backgroundColor: '#E0F2FE' 
  },
  sizeText: { 
    color: '#64748B', 
    fontWeight: '600' 
  },
  activeSizeText: { 
    color: '#0ea5e9' 
  },
  colorCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    marginRight: 15, 
    borderWidth: 3, 
    borderColor: 'transparent' 
  },
  activeColorCircle: { 
    borderColor: '#E0F2FE' 
  },

  // ==========================================
  // ĐÁNH GIÁ (RATING INPUT)
  // ==========================================
  ratingInputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  thanksText: { 
    color: '#22c55e', 
    fontWeight: 'bold', 
    marginLeft: 5 
  },

  // ==========================================
  // THANH ĐIỀU HƯỚNG MUA HÀNG DƯỚI CÙNG
  // ==========================================
  bottomBar: { 
    flexDirection: 'row', 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    position: 'absolute', 
    bottom: 0, 
    backgroundColor: '#FFF', 
    width: '100%', 
    alignItems: 'center' 
  },
  cartBtn: { 
    width: 50, 
    height: 50, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  addBtn: { 
    flex: 1, 
    height: 50, 
    backgroundColor: '#0ea5e9', 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addBtnText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginRight: 10 
  },
});

export default ProductDetailScreen;
