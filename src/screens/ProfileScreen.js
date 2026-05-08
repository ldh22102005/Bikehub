import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({
  user,
  onLogout,
  onOpenSettings,
  onEditProfile,
  onOpenFavorites,
  onOpenOrders,
  onOpenAddresses,
  onOpenPayments,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
        <TouchableOpacity onPress={onOpenSettings}>
          <Feather name="settings" size={22} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <View style={styles.avatarSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: user?.avatar ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editBadge} onPress={onEditProfile}>
              <MaterialIcons name="edit" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Rider One'}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>Thành viên Pro</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={onOpenFavorites}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF1F2' }]}>
              <Feather name="heart" size={20} color="#e11d48" />
            </View>
            <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onOpenOrders}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
              <Feather name="shopping-bag" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.menuText}>Đơn hàng của tôi</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onOpenAddresses}>
            <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
              <Feather name="map-pin" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onOpenPayments}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Feather name="credit-card" size={20} color="#22c55e" />
            </View>
            <Text style={styles.menuText}>Phương thức thanh toán</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={onLogout}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="log-out" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Đăng xuất</Text>
          </TouchableOpacity>
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
  // KHU VỰC AVATAR & THÔNG TIN NGƯỜI DÙNG
  // ==========================================
  avatarSection: { 
    alignItems: 'center', 
    marginTop: 30 
  },
  imageWrapper: {
    position: 'relative',
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0ea5e9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginTop: 15 
  },
  memberBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  memberText: { 
    color: '#0ea5e9', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  // ==========================================
  // DANH SÁCH MENU CÁC CHỨC NĂNG
  // ==========================================
  menuContainer: { 
    paddingHorizontal: 20, 
    marginTop: 24 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#334155' 
  },
  logoutItem: { 
    borderWidth: 1, 
    borderColor: '#FEE2E2' 
  },
});

export default ProfileScreen;
