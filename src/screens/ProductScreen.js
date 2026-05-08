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
  Dimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';

const { width } = Dimensions.get('window');

const ProductScreen = ({ onBack, onNavigateToCart, onOpenProduct }) => {
  const { products, categories } = useProducts();
  const uiCategories = useMemo(() => ['Tất cả', ...(categories || []).map((c) => c.label)], [categories]);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return (products || []).filter((product) => {
      const productCategory = product.category ?? '';

      const matchesCategory =
        selectedCategory === 'Tất cả'
          ? true
          : productCategory === selectedCategory;

      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;
      return String(product.name ?? '').toLowerCase().includes(normalizedQuery);
    });
  }, [products, query, selectedCategory]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.bikeCard}
      onPress={() => onOpenProduct?.(item)}
    >
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Ionicons name="heart-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
        <Image source={item.image} style={styles.bikeImage} resizeMode="contain" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.bikeCategory}>{String(item.category).toUpperCase()}</Text>
        <Text style={styles.bikeName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.bikePrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sản phẩm</Text>
        <TouchableOpacity onPress={onNavigateToCart}>
          <Feather name="shopping-cart" size={22} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchWrapper}>
            <Feather name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#94a3b8"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        <View style={styles.catContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={uiCategories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isActive = item === selectedCategory;
              return (
                <TouchableOpacity
                  style={[styles.catBtn, isActive && styles.catBtnActive]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text style={[styles.catBtnText, isActive && styles.catBtnTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listPadding}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  content: { flex: 1 },
  searchSection: { paddingHorizontal: 20, marginTop: 10 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#334155' },
  catContainer: { paddingVertical: 20, paddingLeft: 20 },
  catBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  catBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  catBtnText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
  catBtnTextActive: { color: '#FFF' },
  row: { justifyContent: 'space-between', paddingHorizontal: 20 },
  listPadding: { paddingBottom: 100 },
  bikeCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtn: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  bikeImage: { width: '80%', height: '80%' },
  cardInfo: { marginTop: 12, paddingHorizontal: 5 },
  bikeCategory: { fontSize: 10, color: '#0ea5e9', fontWeight: 'bold', marginBottom: 4 },
  bikeName: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  bikePrice: { fontSize: 14, color: '#0ea5e9', fontWeight: 'bold', marginTop: 6 },
});

export default ProductScreen;
