import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const OrdersScreen = ({ onBack, orders = [], onCancelOrder, onEditOrder, isDarkMode }) => {
  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={[styles.orderCard, { backgroundColor: cardBg, borderColor: border }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: textMain }]}>Đơn hàng #{item.id}</Text>
        <Text style={[styles.orderStatus, { color: item.color }]}>{item.status}</Text>
      </View>
      <Text style={styles.orderDate}>{item.date}</Text>
      
      {/* Danh sách các sản phẩm đã mua */}
      {item.cartItems && item.cartItems.length > 0 && (
        <View style={[styles.productList, { borderTopColor: isDarkMode ? '#334155' : '#F8FAFC', borderBottomColor: isDarkMode ? '#334155' : '#F8FAFC' }]}>
          {item.cartItems.map((cartItem, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={[styles.productName, { color: isDarkMode ? '#CBD5E1' : '#475569' }]} numberOfLines={1}>
                {cartItem.quantity}x {cartItem.product?.name ?? 'Sản phẩm'}
                {cartItem.color ? ` (${cartItem.color})` : ''}
                {cartItem.size ? ` - Size ${cartItem.size}` : ''}
              </Text>
              <Text style={styles.productPrice}>
                ${((cartItem.unitPrice || 0) * (cartItem.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.orderFooter, { borderTopColor: border }]}>
        <View>
          <Text style={styles.orderItems}>{item.items} sản phẩm</Text>
          <Text style={styles.orderTotal}>{item.total}</Text>
        </View>
        
        {item.status === 'Đang xử lý' && (
          <View style={styles.actionGroup}>
            <TouchableOpacity 
              style={styles.editBtn} 
              onPress={() => {
                Alert.alert('Sửa đơn hàng', 'Đơn hàng hiện tại sẽ bị hủy và các sản phẩm sẽ được chuyển lại vào giỏ hàng để bạn chỉnh sửa. Tiếp tục?', [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Đồng ý', onPress: () => onEditOrder?.(item) }
                ]);
              }}
            >
              <Text style={styles.editBtnText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => {
                Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn hủy đơn hàng này không?', [
                  { text: 'Không', style: 'cancel' },
                  { text: 'Có, Hủy', onPress: () => onCancelOrder?.(item.id), style: 'destructive' }
                ]);
              }}
            >
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textMain }]}>Đơn hàng</Text>
        <View style={{ width: 22 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="package" size={60} color="#cbd5e1" />
          <Text style={[styles.emptyTitle, { color: textMain }]}>Chưa có đơn hàng nào</Text>
          <Text style={styles.emptyText}>Khi bạn đặt hàng, thông tin sẽ xuất hiện ở đây.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155' 
  },

  // ==========================================
  // TRẠNG THÁI KHI TRỐNG (CHƯA CÓ ĐƠN HÀNG)
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
  // DANH SÁCH ĐƠN HÀNG (CARD)
  // ==========================================
  listContent: { 
    padding: 20 
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  orderHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  orderId: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  orderStatus: { 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  orderDate: { 
    fontSize: 13, 
    color: '#94a3b8', 
    marginBottom: 15 
  },
  orderFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9' 
  },
  orderItems: { 
    fontSize: 14, 
    color: '#64748B' 
  },
  orderTotal: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0ea5e9' 
  },

  // ==========================================
  // NÚT THAO TÁC (SỬA / HỦY)
  // ==========================================
  actionGroup: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  editBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 6, 
    backgroundColor: '#f1f5f9', 
    marginRight: 8 
  },
  editBtnText: { 
    color: '#0ea5e9', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  cancelBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 6, 
    backgroundColor: '#fef2f2' 
  },
  cancelBtnText: { 
    color: '#ef4444', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  // ==========================================
  // DANH SÁCH CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG
  // ==========================================
  productList: { 
    marginTop: 10, 
    marginBottom: 5, 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#F8FAFC', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F8FAFC' 
  },
  productItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 6 
  },
  productName: { 
    fontSize: 13, 
    color: '#475569', 
    flex: 1, 
    paddingRight: 10 
  },
  productPrice: { 
    fontSize: 13, 
    color: '#334155', 
    fontWeight: '600' 
  },
});

export default OrdersScreen;
