import React, { useState } from 'react';
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
import { useFavorites } from '../hooks/useFavorites';

const ProductDetailScreen = ({ product, onBack, onAddToCart }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#0ea5e9');

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onBack} style={{ padding: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginTop: 50, color: '#64748B' }}>
          Không tìm thấy thông tin sản phẩm
        </Text>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(product.id);
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['#0ea5e9', '#334155', '#ef4444', '#10b981'];

  const handleAddToCart = () => {
    onAddToCart?.({ product, size: selectedSize, color: selectedColor });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => toggleFavorite(product)}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#ef4444" : "#334155"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{product.tag || 'NEW ARRIVAL'}</Text>
          </View>
          
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{product.rating || '4.8'} (120 Đánh giá)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            {product.oldPrice && <Text style={styles.oldPrice}>{product.oldPrice}</Text>}
          </View>

          {/* Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <View style={styles.specIconBox}>
                <MaterialCommunityIcons name="weight-kilogram" size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.specLabel}>Weight</Text>
              <Text style={styles.specValue}>9.8 kg</Text>
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBox}>
                <MaterialCommunityIcons name="layers-triple-outline" size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.specLabel}>Group set</Text>
              <Text style={styles.specValue}>Shimano</Text>
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBox}>
                <MaterialCommunityIcons name="speedometer" size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.specLabel}>Gears</Text>
              <Text style={styles.specValue}>21 Speed</Text>
            </View>
            <View style={styles.specItem}>
              <View style={styles.specIconBox}>
                <Ionicons name="scan-outline" size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.specLabel}>Material</Text>
              <Text style={styles.specValue}>Carbon</Text>
            </View>
          </View>

          {/* Selection: Size & Color */}
          <View style={styles.selectionContainer}>
            <View style={styles.selectionBlock}>
              <Text style={styles.selectionTitle}>Kích thước</Text>
              <View style={styles.sizeRow}>
                {sizes.map((s) => (
                  <TouchableOpacity 
                    key={s} 
                    style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectionBlock}>
              <Text style={styles.selectionTitle}>Màu sắc</Text>
              <View style={styles.colorRow}>
                {colors.map((c) => (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.colorBtn, { backgroundColor: c }, selectedColor === c && styles.colorBtnActive]}
                    onPress={() => setSelectedColor(c)}
                  >
                    {selectedColor === c && <Feather name="check" size={12} color="#FFF" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={() => onAddToCart?.({ product, size: selectedSize, color: selectedColor })}>
          <Feather name="shopping-bag" size={24} color="#334155" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  headerRight: { flexDirection: 'row' },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { width: '100%', height: 280, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  image: { width: '80%', height: '80%' },
  infoContainer: { padding: 20 },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginBottom: 10 },
  tagText: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold' },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  ratingText: { fontSize: 14, color: '#64748B', marginLeft: 5, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#0ea5e9', marginRight: 10 },
  oldPrice: { fontSize: 16, color: '#94a3b8', textDecorationLine: 'line-through', marginLeft: 10 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  specItem: { width: '48%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 15, alignItems: 'flex-start', marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  specIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  specLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  specValue: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  selectionContainer: { flexDirection: 'column', marginBottom: 20 },
  selectionBlock: { marginBottom: 15 },
  selectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  sizeRow: { flexDirection: 'row' },
  sizeBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  sizeBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  sizeText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  sizeTextActive: { color: '#FFF' },
  colorRow: { flexDirection: 'row' },
  colorBtn: { width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  colorBtnActive: { borderColor: '#0ea5e9', borderWidth: 2 },
  bottomBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', position: 'absolute', bottom: 0, width: '100%' },
  cartBtn: { width: 55, height: 55, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  addBtn: { flex: 1, height: 55, backgroundColor: '#0ea5e9', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default ProductDetailScreen;
