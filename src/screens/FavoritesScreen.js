import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, useWindowDimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesScreen = ({ onBack, onOpenProduct, isDarkMode }) => {
  // === 1. LẤY DỮ LIỆU FAVORITES ===
  const { width } = useWindowDimensions();
  const { favoriteItems, toggleFavorite } = useFavorites();
  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';

  // === 2. COMPONENT RENDER TỪNG SẢN PHẨM LƯỚI ===
  const renderItem = ({ item }) => (
    <View style={[styles.bikeCard, { backgroundColor: cardBg, borderColor: border, width: (width - 60) / 2 }]}>
      <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? '#334155' : '#F8FAFC' }]}>
        <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleFavorite(item)}>
          <Ionicons name="heart" size={18} color="#ef4444" />
        </TouchableOpacity>
        <View style={[styles.ratingBadge, { backgroundColor: cardBg }]}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.ratingBadgeText, { color: textMain }]}>{item.rating || '5.0'}</Text>
        </View>
        <TouchableOpacity style={styles.imageWrapper} onPress={() => onOpenProduct?.(item)}>
          <Image source={item.image} style={styles.bikeImage} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.bikeCategory}>{String(item.category).toUpperCase()}</Text>
        <Text style={[styles.bikeName, { color: textMain }]} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.bikePrice}>{item.price}</Text>
      </View>
    </View>
  );

  // === 3. RENDER GIAO DIỆN CHÍNH ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textMain }]}>Sản phẩm yêu thích</Text>
        <View style={{ width: 22 }} />
      </View>

      {favoriteItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color="#cbd5e1" />
          <Text style={[styles.emptyTitle, { color: textMain }]}>Chưa có sản phẩm nào</Text>
          <Text style={styles.emptyText}>Hãy thả tim các sản phẩm để lưu vào đây nhé.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listPadding}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
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
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155' 
  },

  // ==========================================
  // TRẠNG THÁI TRỐNG (EMPTY STATE)
  // ==========================================
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginTop: 15 
  },
  emptyText: { 
    fontSize: 14, 
    color: '#64748B', 
    marginTop: 8, 
    textAlign: 'center' 
  },

  // ==========================================
  // LƯỚI SẢN PHẨM YÊU THÍCH
  // ==========================================
  row: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 20 
  },
  listPadding: { 
    paddingVertical: 20, 
    paddingBottom: 100 
  },
  bikeCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    marginBottom: 20, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    elevation: 2 
  },
  imageContainer: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 15, 
    height: 120, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageWrapper: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  favoriteBtn: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    zIndex: 1, 
    padding: 4 
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
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
  bikeImage: { 
    width: '100%', 
    height: '100%' 
  },
  cardInfo: { 
    marginTop: 12, 
    paddingHorizontal: 5 
  },
  bikeCategory: { 
    fontSize: 10, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  bikeName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  bikePrice: { 
    fontSize: 14, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginTop: 6 
  },
});

export default FavoritesScreen;