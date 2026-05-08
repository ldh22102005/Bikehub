import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AddressesScreen = ({ onBack, addresses = [], onAddAddress, onDeleteAddress, onSetDefaultAddress, isDarkMode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdd = () => {
    if (!newLabel || !newAddress || !newCity || !newPhone) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    onAddAddress?.({ label: newLabel, address: newAddress, city: newCity, phone: newPhone });
    setModalVisible(false);
    setNewLabel(''); setNewAddress(''); setNewCity(''); setNewPhone('');
  };

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
        <Text style={[styles.headerTitle, { color: textMain }]}>Địa chỉ giao hàng</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {addresses.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#94a3b8', marginTop: 20 }}>Bạn chưa có địa chỉ nào.</Text>
        ) : (
        addresses.map((item) => (
          <View key={item.id} style={[styles.addressCard, { backgroundColor: cardBg, borderColor: border }, item.isDefault && [styles.defaultCard, { backgroundColor: isDarkMode ? '#0f172a' : '#f0f9ff' }]]}>
            <View style={styles.cardHeader}>
              <View style={styles.labelRow}>
                <Feather name={item.label.toLowerCase().includes('nhà') ? 'home' : 'map-pin'} size={18} color={item.isDefault ? '#0ea5e9' : '#64748B'} />
                <Text style={[styles.addressLabel, { color: textMain }, item.isDefault && { color: '#0ea5e9' }]}>{item.label}</Text>
              </View>
              {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>Mặc định</Text></View>}
            </View>
            <Text style={[styles.addressText, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>{item.address}, {item.city}</Text>
            <Text style={styles.phoneText}>SĐT: {item.phone}</Text>
            
            <View style={[styles.actionRow, { borderTopColor: border }]}>
              {!item.isDefault ? (
                <TouchableOpacity onPress={() => onSetDefaultAddress?.(item.id)}>
                  <Text style={styles.actionText}>Đặt làm mặc định</Text>
                </TouchableOpacity>
              ) : <View />}
              {!item.isDefault && (
                <TouchableOpacity onPress={() => onDeleteAddress?.(item.id)}>
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Xóa</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )))}

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textMain }]}>Thêm địa chỉ mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <TextInput style={[styles.input, { backgroundColor: bg, borderColor: border, color: textMain }]} placeholder="Tên gợi nhớ" placeholderTextColor="#94a3b8" value={newLabel} onChangeText={setNewLabel} />
            <TextInput style={[styles.input, { backgroundColor: bg, borderColor: border, color: textMain }]} placeholder="Số điện thoại" placeholderTextColor="#94a3b8" keyboardType="phone-pad" value={newPhone} onChangeText={setNewPhone} />
            <TextInput style={[styles.input, { backgroundColor: bg, borderColor: border, color: textMain }]} placeholder="Địa chỉ (Số nhà, Đường)" placeholderTextColor="#94a3b8" value={newAddress} onChangeText={setNewAddress} />
            <TextInput style={[styles.input, { backgroundColor: bg, borderColor: border, color: textMain }]} placeholder="Thành phố / Tỉnh" placeholderTextColor="#94a3b8" value={newCity} onChangeText={setNewCity} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Lưu địa chỉ</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // PHẦN HEADER (THANH ĐIỀU HƯỚNG PHÍA TRÊN)
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
  // DANH SÁCH ĐỊA CHỈ (CARD ĐỊA CHỈ)
  // ==========================================
  addressCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    elevation: 1 
  },
  defaultCard: { 
    borderColor: '#bae6fd', 
    backgroundColor: '#f0f9ff' 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  labelRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  addressLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginLeft: 8 
  },

  // ==========================================
  // NHÃN "MẶC ĐỊNH"
  // ==========================================
  defaultBadge: { 
    backgroundColor: '#0ea5e9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  defaultText: { 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },

  // ==========================================
  // NỘI DUNG VĂN BẢN TRONG CARD
  // ==========================================
  addressText: { 
    fontSize: 14, 
    color: '#475569', 
    marginBottom: 6, 
    lineHeight: 20 
  },
  phoneText: { 
    fontSize: 14, 
    color: '#64748B', 
    marginBottom: 15 
  },

  // ==========================================
  // HÀNG NÚT THAO TÁC (ĐẶT LÀM MẶC ĐỊNH / XÓA)
  // ==========================================
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingTop: 12 
  },
  actionText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#0ea5e9' 
  },

  // ==========================================
  // NÚT "THÊM ĐỊA CHỈ MỚI" Ở CUỐI TRANG
  // ==========================================
  addBtn: { 
    backgroundColor: '#0ea5e9', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 10 
  },
  addBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: 8 
  },

  // ==========================================
  // MODAL (CỬA SỔ BẬT LÊN) ĐỂ NHẬP ĐỊA CHỈ
  // ==========================================
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 20, 
    paddingBottom: 40 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#334155' 
  },

  // ==========================================
  // FORM NHẬP LIỆU BÊN TRONG MODAL
  // ==========================================
  input: { 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    fontSize: 15, 
    color: '#334155', 
    backgroundColor: '#F8FAFC' 
  },
  saveBtn: { 
    backgroundColor: '#0ea5e9', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default AddressesScreen;
