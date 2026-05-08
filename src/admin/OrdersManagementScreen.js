import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput, Modal, Alert } from 'react-native';

const normalize = (v) => String(v ?? '').toLowerCase();

const statusMeta = (status) => {
  const s = normalize(status);
  if (s.includes('pending') || s.includes('xử') || s.includes('xu ly')) return { label: 'pending', badge: 'PENDING', color: '#F59E0B' };
  if (s.includes('ship') || s.includes('giao')) return { label: 'shipped', badge: 'SHIPPED', color: '#22C55E' };
  if (s.includes('deliver') || s.includes('hoàn') || s.includes('hoan')) return { label: 'delivered', badge: 'DELIVERED', color: '#0EA5E9' };
  if (s.includes('cancel') || s.includes('hủy') || s.includes('huy')) return { label: 'cancelled', badge: 'CANCELLED', color: '#EF4444' };
  return { label: 'unknown', badge: String(status || 'UNKNOWN').toUpperCase(), color: '#64748B' };
};

export default function OrdersManagementScreen({ orders = [], onLogout, onUpdateOrderStatus }) {
  // === 1. KHỞI TẠO STATE QUẢN LÝ TÌM KIẾM & MODAL ===
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // === 2. XỬ LÝ LỌC ĐƠN HÀNG (THEO TÊN/MÃ/TRẠNG THÁI) ===
  const rows = useMemo(() => {
    const q = normalize(searchText).trim();
    return (orders || [])
      .map((o) => {
        const meta = statusMeta(o.status);
        return {
          id: o.id ?? '',
          customer: o.customer ?? 'Khách hàng',
          amount: o.total ?? '',
          statusKey: meta.label,
          status: meta.badge,
          statusColor: meta.color,
        };
      })
      .filter((o) => {
        if (!q) return true;
        return normalize(o.id).includes(q) || normalize(o.customer).includes(q);
      })
      .filter((o) => (activeFilter === 'all' ? true : o.statusKey === activeFilter));
  }, [orders, searchText, activeFilter]);

  // === 3. RENDER GIAO DIỆN ===
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarIcon}>☰</Text>
        <Text style={styles.topBarTitle}>BIKE WORLD</Text>
        <Pressable onPress={onLogout} hitSlop={8}>
          <Text style={[styles.topBarIcon, { color: '#ef4444' }]}>Đăng xuất</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.headerLabel}>ORDER MANAGEMENT</Text>
            <Text style={styles.headerTitle}>Đơn hàng</Text>
          </View>
          <Pressable style={styles.exportButton}>
            <Text style={styles.exportIcon}>⤓</Text>
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput value={searchText} onChangeText={setSearchText} placeholder="Tìm theo mã đơn / khách hàng..." placeholderTextColor="#94a3b8" style={styles.searchInput} />
        </View>

        <View style={styles.filterSection}>
          <FilterBtn label="Tất cả" active={activeFilter === 'all'} onPress={() => setActiveFilter('all')} />
          <FilterBtn label="Pending" active={activeFilter === 'pending'} onPress={() => setActiveFilter('pending')} />
          <FilterBtn label="Shipped" active={activeFilter === 'shipped'} onPress={() => setActiveFilter('shipped')} />
          <FilterBtn label="Delivered" active={activeFilter === 'delivered'} onPress={() => setActiveFilter('delivered')} />
        </View>

        {rows.map((o) => (
          <Pressable 
            key={String(o.id)} 
            style={styles.orderCard}
            onPress={() => {
              const fullOrder = orders.find((order) => order.id === o.id);
              setSelectedOrder(fullOrder);
              setModalVisible(true);
            }}
          >
            <View style={styles.orderLeft}>
              <View style={styles.orderIcon}>
                <Text style={styles.orderIconText}>📦</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>{o.id}</Text>
                <Text style={styles.customerName}>{o.customer}</Text>
                <Text style={styles.orderAmount}>{o.amount}</Text>
              </View>
            </View>
            <View style={styles.orderRight}>
              <View style={[styles.statusBadge, { backgroundColor: o.statusColor }]}>
                <Text style={styles.statusText}>{o.status}</Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={styles.spacer} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>

            {selectedOrder && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Mã đơn hàng</Text>
                  <Text style={styles.modalValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Khách hàng</Text>
                  <Text style={styles.modalValue}>{selectedOrder.customer}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Số điện thoại</Text>
                  <Text style={styles.modalValue}>{selectedOrder.phone || 'N/A'}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Địa chỉ</Text>
                  <Text style={styles.modalValue}>{selectedOrder.street}, {selectedOrder.city} {selectedOrder.postalCode}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Tổng tiền</Text>
                  <Text style={styles.modalValue}>{selectedOrder.total}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Trạng thái</Text>
                  <View style={styles.statusOptions}>
                    {['Đang xử lý', 'Đang giao', 'Đã giao'].map((status) => (
                      <Pressable
                        key={status}
                        style={[styles.statusBtn, selectedOrder.status === status && styles.statusBtnActive]}
                        onPress={() => {
                          onUpdateOrderStatus?.(selectedOrder.id, status);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={[styles.statusBtnText, selectedOrder.status === status && styles.statusBtnTextActive]}>
                          {status}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}

            <Pressable style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// === 4. COMPONENT NÚT LỌC TRẠNG THÁI ===
function FilterBtn({ label, active, onPress }) {
  return (
    <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  spacer: {
    height: 120,
  },

  // ==========================================
  // THANH ĐIỀU HƯỚNG TRÊN (TOP BAR)
  // ==========================================
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 30,
  },
  topBarIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
  },

  // ==========================================
  // TIÊU ĐỀ TRANG (HEADER SECTION)
  // ==========================================
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  exportButton: {
    backgroundColor: '#00A8E8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportIcon: {
    fontSize: 14,
  },
  exportText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // TÌM KIẾM (SEARCH)
  // ==========================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
  },

  // ==========================================
  // BỘ LỌC ĐƠN HÀNG (FILTER)
  // ==========================================
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#00A8E8',
    borderColor: '#00A8E8',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ==========================================
  // THẺ ĐƠN HÀNG (ORDER CARD)
  // ==========================================
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderIconText: {
    fontSize: 24,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00A8E8',
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // MODAL CHI TIẾT ĐƠN HÀNG
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeBtn: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: '#00A8E8',
    borderColor: '#00A8E8',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
