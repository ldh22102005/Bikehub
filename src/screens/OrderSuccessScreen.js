import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const OrderSuccessScreen = ({ onBackHome }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Biểu tượng Checkmark */}
        <View style={styles.successIconWrapper}>
          <Ionicons name="checkmark" size={50} color="#FFF" />
        </View>

        <Text style={styles.successTitle}>Order placed successfully</Text>
        <Text style={styles.successSubtitle}>
          Your high-performance ride is being prepared for the journey.
        </Text>

        {/* Thông tin đơn hàng */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ORDER NUMBER</Text>
            <Text style={styles.infoValue}>#BW-94281</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EST. DELIVERY</Text>
            <Text style={[styles.infoValue, { color: '#0ea5e9' }]}>Oct 24 - 26</Text>
          </View>
        </View>

        {/* Hình ảnh xe */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400' }} 
          style={styles.bikeImage} 
          resizeMode="contain"
        />

        {/* Nút điều hướng */}
        <TouchableOpacity style={styles.homeBtn} onPress={onBackHome}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackText}>Track Your Order</Text>
        </TouchableOpacity>
      </View>

      {/* Footer ghi chú bảo mật */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Feather name="shield" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>Secure Payment</Text>
        </View>
        <View style={styles.footerItem}>
          <Feather name="headphones" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>24/7 Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH VÀ CARD
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  card: { 
    backgroundColor: '#FFF', 
    width: '100%', 
    borderRadius: 30, 
    padding: 30, 
    alignItems: 'center', 
    elevation: 5 
  },

  // ==========================================
  // THÔNG TIN THÀNH CÔNG VÀ ICON
  // ==========================================
  successIconWrapper: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#0ea5e9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  successTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  successSubtitle: { 
    fontSize: 14, 
    color: '#64748B', 
    textAlign: 'center', 
    marginBottom: 30, 
    lineHeight: 20 
  },

  // ==========================================
  // KHUNG THÔNG TIN ĐƠN HÀNG
  // ==========================================
  infoBox: { 
    backgroundColor: '#F1F5F9', 
    width: '100%', 
    borderRadius: 16, 
    padding: 15, 
    marginBottom: 25 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  infoLabel: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#94a3b8' 
  },
  infoValue: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  bikeImage: { 
    width: '100%', 
    height: 150, 
    marginBottom: 30 
  },

  // ==========================================
  // NÚT ĐIỀU HƯỚNG
  // ==========================================
  homeBtn: { 
    backgroundColor: '#0ea5e9', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 15 
  },
  homeBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
  trackText: { 
    color: '#64748B', 
    fontWeight: 'bold', 
    fontSize: 14 
  },

  // ==========================================
  // FOOTER (BẢO MẬT & HỖ TRỢ)
  // ==========================================
  footer: { 
    flexDirection: 'row', 
    marginTop: 30 
  },
  footerItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 15 
  },
  footerText: { 
    color: '#94a3b8', 
    fontSize: 12, 
    marginLeft: 5 
  }
});

export default OrderSuccessScreen;