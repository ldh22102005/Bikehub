import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CheckoutScreen = ({ onBack, onPlaceOrder, cartItems = [], isDarkMode }) => {
  // === 1. KHỞI TẠO STATE FORM ĐIỀN THÔNG TIN ===
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');

  // === 2. TÍNH TOÁN TỔNG TIỀN (MEMO) ===
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
    const ship = sub > 0 ? 0 : 0;
    const t = sub * 0.08;
    return { subtotal: sub, shipping: ship, tax: t, total: sub + ship + t };
  }, [cartItems]);

  const canPlaceOrder = cartItems.length > 0;

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';
  const inputBg = isDarkMode ? '#0F172A' : '#FFF';

  // === 3. RENDER GIAO DIỆN ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="menu" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bike World</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.pageTitle, { color: textMain }]}>Checkout</Text>
        <Text style={styles.pageSubtitle}>Complete your purchase to start your next adventure.</Text>

        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={18} color="#0ea5e9" />
            <Text style={[styles.sectionTitle, { color: textMain }]}>Customer Information</Text>
          </View>
          <Text style={[styles.inputLabel, { color: textMain }]}>Full Name</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textMain }]} placeholder="Enter your full name" placeholderTextColor="#94a3b8" value={fullName} onChangeText={setFullName} />

          <Text style={[styles.inputLabel, { marginTop: 15, color: textMain }]}>Phone Number</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textMain }]} placeholder="+1 (555) 000-0000" keyboardType="phone-pad" placeholderTextColor="#94a3b8" value={phone} onChangeText={setPhone} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="#0ea5e9" />
            <Text style={[styles.sectionTitle, { color: textMain }]}>Shipping Address</Text>
          </View>
          <Text style={[styles.inputLabel, { color: textMain }]}>Street Address</Text>
          <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textMain }]} placeholder="123 Cycling Way" placeholderTextColor="#94a3b8" value={street} onChangeText={setStreet} />

          <View style={styles.rowInput}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.inputLabel, { color: textMain }]}>City</Text>
              <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textMain }]} placeholder="Boulder" placeholderTextColor="#94a3b8" value={city} onChangeText={setCity} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: textMain }]}>Postal Code</Text>
              <TextInput style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textMain }]} placeholder="80302" keyboardType="numeric" placeholderTextColor="#94a3b8" value={postalCode} onChangeText={setPostalCode} />
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}>
          <View style={styles.sectionHeader}>
            <Feather name="credit-card" size={20} color="#0ea5e9" />
            <Text style={[styles.sectionTitle, { color: textMain }]}>Payment Method</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.paymentOption, { borderColor: border }, paymentMethod === 'Card' && styles.paymentOptionActive]} 
            onPress={() => setPaymentMethod('Card')}
          >
            <View style={styles.paymentOptionLeft}>
              <FontAwesome name="cc-visa" size={24} color="#1a1f71" />
              <Text style={[styles.paymentOptionText, { color: textMain }]}>•••• 4242</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'Card' && styles.radioActive]}>
              {paymentMethod === 'Card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, { borderColor: border }, paymentMethod === 'COD' && styles.paymentOptionActive]} 
            onPress={() => setPaymentMethod('COD')}
          >
            <View style={styles.paymentOptionLeft}>
              <Feather name="dollar-sign" size={24} color="#22c55e" />
              <Text style={[styles.paymentOptionText, { color: textMain }]}>Cash on Delivery</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'COD' && styles.radioActive]}>
              {paymentMethod === 'COD' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}>
          <Text style={[styles.summaryHeading, { color: textMain }]}>Order Summary</Text>

          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>Giỏ hàng trống.</Text>
          ) : (
            cartItems.map((item) => (
              <View key={item.key} style={[styles.productBrief, { borderBottomColor: border }]}>
                <Image source={item.product?.image} style={[styles.briefImage, { backgroundColor: isDarkMode ? '#334155' : '#F8FAFC' }]} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.briefName, { color: textMain }]} numberOfLines={1}>
                    {item.product?.name ?? 'Product'}
                  </Text>
                  <Text style={styles.briefMeta} numberOfLines={1}>
                    {item.color ? `Color ${item.color}` : ' '}
                    {item.size ? ` • Size ${item.size}` : ''}
                    {item.quantity ? ` • x${item.quantity}` : ''}
                  </Text>
                  <Text style={styles.briefPrice}>{formatMoney((item.unitPrice || 0) * (item.quantity || 0))}</Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Subtotal</Text>
            <Text style={styles.sumVal}>{formatMoney(subtotal)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Shipping</Text>
            <Text style={[styles.sumVal, { color: shipping === 0 ? '#22c55e' : '#334155' }]}>{shipping === 0 ? 'Free' : formatMoney(shipping)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Estimated Tax (8%)</Text>
            <Text style={styles.sumVal}>{formatMoney(tax)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{formatMoney(total)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderBtn, !canPlaceOrder && styles.placeOrderBtnDisabled]}
            // === 4. XỬ LÝ ĐẶT HÀNG VÀ KIỂM TRA LỖI (VALIDATION) ===
            onPress={canPlaceOrder ? () => {
              const fullNameTrimmed = String(fullName || '').trim();
              const phoneTrimmed = String(phone || '').trim();
              const streetTrimmed = String(street || '').trim();
              const cityTrimmed = String(city || '').trim();
              const postalCodeTrimmed = String(postalCode || '').trim();

              if (!fullNameTrimmed) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên.');
                return;
              }
              if (!phoneTrimmed) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại.');
                return;
              }
              if (!streetTrimmed) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ đường.');
                return;
              }
              if (!cityTrimmed) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên thành phố.');
                return;
              }
              if (!postalCodeTrimmed) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập mã bưu điện.');
                return;
              }

              onPlaceOrder?.({ fullName: fullNameTrimmed, phone: phoneTrimmed, street: streetTrimmed, city: cityTrimmed, postalCode: postalCodeTrimmed, paymentMethod });
            } : undefined}
            activeOpacity={canPlaceOrder ? 0.9 : 1}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By placing your order, you agree to Bike World's {'\n'}
            <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>
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
  // PHẦN HEADER & TIÊU ĐỀ TRANG
  // ==========================================
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#FFF' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },
  pageTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginTop: 20 
  },
  pageSubtitle: { 
    fontSize: 14, 
    color: '#64748B', 
    marginBottom: 20 
  },

  // ==========================================
  // CARD THÔNG TIN (SECTION)
  // ==========================================
  sectionCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 1 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginLeft: 10 
  },

  // ==========================================
  // INPUT FORM & NHẬP LIỆU
  // ==========================================
  inputLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 10, 
    padding: 12, 
    color: '#1e293b' 
  },
  rowInput: { 
    flexDirection: 'row', 
    marginTop: 15 
  },

  // ==========================================
  // PHƯƠNG THỨC THANH TOÁN
  // ==========================================
  paymentOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    marginBottom: 10 
  },
  paymentOptionActive: { 
    borderColor: '#0ea5e9', 
    backgroundColor: '#F0F9FF' 
  },
  paymentOptionLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  paymentOptionText: { 
    marginLeft: 15, 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#334155' 
  },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#CBD5E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioActive: { 
    borderColor: '#0ea5e9' 
  },
  radioInner: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#0ea5e9' 
  },

  // ==========================================
  // TÓM TẮT ĐƠN HÀNG (SẢN PHẨM & TỔNG TIỀN)
  // ==========================================
  summaryHeading: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginBottom: 15 
  },
  emptyText: { 
    color: '#64748B' 
  },
  moreText: { 
    marginTop: -6, 
    marginBottom: 10, 
    color: '#94a3b8', 
    fontSize: 12 
  },
  productBrief: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9', 
    marginBottom: 15 
  },
  briefImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 15, 
    backgroundColor: '#F8FAFC' 
  },
  briefName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  briefMeta: { 
    fontSize: 12, 
    color: '#94a3b8', 
    marginTop: 3 
  },
  briefPrice: { 
    fontSize: 14, 
    color: '#0ea5e9', 
    fontWeight: 'bold', 
    marginTop: 6 
  },
  sumRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  sumLabel: { 
    color: '#64748B' 
  },
  sumVal: { 
    fontWeight: '600', 
    color: '#334155' 
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9' 
  },
  totalLabel: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  totalPrice: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },

  // ==========================================
  // NÚT ĐẶT HÀNG CHÍNH & ĐIỀU KHOẢN
  // ==========================================
  placeOrderBtn: { 
    backgroundColor: '#0ea5e9', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 12, 
    marginTop: 20 
  },
  placeOrderBtnDisabled: { 
    backgroundColor: '#94a3b8' 
  },
  placeOrderText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
  termsText: { 
    fontSize: 10, 
    textAlign: 'center', 
    color: '#94a3b8', 
    marginTop: 15, 
    lineHeight: 16 
  },
  linkText: { 
    color: '#0ea5e9', 
    textDecorationLine: 'underline' 
  },
});

export default CheckoutScreen;
