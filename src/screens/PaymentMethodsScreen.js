import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

const mockCards = [
  { id: '1', type: 'Visa', number: '**** **** **** 4242', expiry: '12/25', isDefault: true },
  { id: '2', type: 'Mastercard', number: '**** **** **** 8888', expiry: '08/24', isDefault: false },
];

const PaymentMethodsScreen = ({ onBack, isDarkMode }) => {
  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textMain }]}>Thanh toán</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {mockCards.map((card) => (
          <View key={card.id} style={[styles.cardContainer, { backgroundColor: cardBg, borderColor: border }]}>
            <View style={styles.cardHeader}>
              <FontAwesome name={card.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'} size={32} color={card.type === 'Visa' ? '#1a1f71' : '#eb001b'} />
              {card.isDefault && <Text style={styles.defaultText}>Mặc định</Text>}
            </View>
            <Text style={[styles.cardNumber, { color: textMain }]}>{card.number}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardExpiry}>Hết hạn: {card.expiry}</Text>
              <TouchableOpacity>
                <Feather name="trash-2" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={20} color="#0ea5e9" />
          <Text style={styles.addBtnText}>Thêm thẻ tín dụng mới</Text>
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
  body: { 
    padding: 20 
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
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155' 
  },

  // ==========================================
  // CARD THẺ THANH TOÁN
  // ==========================================
  cardContainer: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    elevation: 2 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  defaultText: { 
    color: '#0ea5e9', 
    fontSize: 12, 
    fontWeight: 'bold', 
    backgroundColor: '#e0f2fe', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  cardNumber: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#334155', 
    letterSpacing: 2, 
    marginBottom: 20 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  cardExpiry: { 
    fontSize: 14, 
    color: '#64748B', 
    fontWeight: '500' 
  },

  // ==========================================
  // NÚT THÊM THẺ MỚI
  // ==========================================
  addBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#0ea5e9', 
    borderStyle: 'dashed', 
    marginTop: 10 
  },
  addBtnText: { 
    color: '#0ea5e9', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: 8 
  },
});

export default PaymentMethodsScreen;
