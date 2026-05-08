import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CartScreen = ({ cartItems = [], onNavigateToCheckout, onDecreaseQty, onIncreaseQty, onRemoveItem, isDarkMode }) => {
  // === 1. TÍNH TOÁN TỔNG TIỀN (MEMO) ===
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
    const ship = sub > 0 ? 0 : 0;
    const t = sub * 0.08;
    return { subtotal: sub, shipping: ship, tax: t, total: sub + ship + t };
  }, [cartItems]);

  const canCheckout = cartItems.length > 0;

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';
  const summaryBg = isDarkMode ? '#1E293B' : '#F1F5F9';

  // === 2. RENDER GIAO DIỆN ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bike World</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={[styles.pageTitle, { color: textMain }]}>Your Cart</Text>
          <Text style={styles.itemCount}>{cartItems.length} Items</Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor: border }]}>
            <Text style={[styles.emptyTitle, { color: textMain }]}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyText}>Hãy thêm sản phẩm từ trang Sản phẩm.</Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.key} style={[styles.cartCard, { backgroundColor: cardBg, borderColor: border }]}>
              <Image source={item.product?.image} style={[styles.productImage, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]} resizeMode="contain" />
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: textMain }]} numberOfLines={1}>
                  {item.product?.name ?? 'Product'}
                </Text>
                <Text style={styles.productMeta} numberOfLines={1}>
                  {item.color ? `Color ${item.color}` : ' '}
                  {item.size ? ` • Size ${item.size}` : ''}
                </Text>
                <Text style={styles.productPrice}>{formatMoney(item.unitPrice)}</Text>

                <View style={[styles.quantityContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecreaseQty?.(item.key)}>
                    <Feather name="minus" size={14} color={textMain} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { color: textMain }]}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncreaseQty?.(item.key)}>
                    <Feather name="plus" size={14} color={textMain} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemoveItem?.(item.key)}>
                <Feather name="trash-2" size={20} color="#fb7185" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={[styles.summaryCard, { backgroundColor: summaryBg }]}>
          <Text style={[styles.summaryTitle, { color: textMain }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: textMain }]}>{formatMoney(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: textMain }]}>{shipping === 0 ? 'Free' : formatMoney(shipping)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
            <Text style={[styles.summaryValue, { color: textMain }]}>{formatMoney(tax)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: textMain }]}>Total</Text>
            <Text style={styles.totalValue}>{formatMoney(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, !canCheckout && styles.checkoutBtnDisabled]}
          onPress={canCheckout ? onNavigateToCheckout : undefined}
          activeOpacity={canCheckout ? 0.9 : 1}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
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
  scrollBody: { 
    paddingHorizontal: 20, 
    paddingBottom: 120 
  },

  // ==========================================
  // HEADER & TIÊU ĐỀ CHÍNH
  // ==========================================
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginVertical: 20 
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  itemCount: { 
    color: '#0ea5e9', 
    fontWeight: 'bold' 
  },

  // ==========================================
  // KHU VỰC GIỎ HÀNG TRỐNG
  // ==========================================
  emptyCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 18, 
    borderWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  emptyTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  emptyText: { 
    marginTop: 6, 
    color: '#64748B' 
  },

  // ==========================================
  // CARD SẢN PHẨM TRONG GIỎ
  // ==========================================
  cartCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center', 
    elevation: 2 
  },
  productImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    backgroundColor: '#F1F5F9' 
  },
  productInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  productName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  productMeta: { 
    fontSize: 11, 
    color: '#94a3b8', 
    marginTop: 4 
  },
  productPrice: { 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginVertical: 6 
  },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    alignSelf: 'flex-start', 
    borderRadius: 8, 
    padding: 4 
  },
  qtyBtn: { 
    paddingHorizontal: 8 
  },
  qtyText: { 
    fontWeight: 'bold', 
    marginHorizontal: 10, 
    color: '#334155' 
  },
  deleteBtn: { 
    padding: 8 
  },

  // ==========================================
  // TÓM TẮT ĐƠN HÀNG & NÚT ĐẶT HÀNG
  // ==========================================
  summaryCard: { 
    backgroundColor: '#F1F5F9', 
    borderRadius: 20, 
    padding: 20, 
    marginTop: 10 
  },
  summaryTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginBottom: 15 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  summaryLabel: { 
    color: '#64748B' 
  },
  summaryValue: { 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#E2E8F0', 
    marginVertical: 15 
  },
  totalLabel: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  totalValue: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },
  checkoutBtn: { 
    backgroundColor: '#0ea5e9', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 25 
  },
  checkoutBtnDisabled: { 
    backgroundColor: '#94a3b8' 
  },
  checkoutText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
});

export default CartScreen;
