import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Switch, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SettingsScreen = ({ onBack }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const getModalTitle = () => {
    return modalType === 'privacy' ? 'Chính sách bảo mật' : 'Điều khoản sử dụng';
  };

  const getModalText = () => {
    if (modalType === 'privacy') {
      return 'Bike World cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi chỉ thu thập các thông tin cần thiết cho việc giao hàng, thanh toán và cải thiện trải nghiệm người dùng. Dữ liệu của bạn sẽ được bảo mật tuyệt đối và không bao giờ bị chia sẻ cho bất kỳ bên thứ ba nào mà không có sự đồng ý rõ ràng từ bạn.';
    }
    return 'Bằng việc tải xuống và sử dụng ứng dụng Bike World, bạn đồng ý tuân thủ các quy định và điều kiện mua bán, đổi trả, cũng như chính sách bảo hành của chúng tôi. Nghiêm cấm mọi hành vi gian lận, lạm dụng khuyến mãi hoặc cố tình gây thiệt hại cho hệ thống của Bike World.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Thông báo</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Thông báo đẩy</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: '#0ea5e9' }} />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Thông báo qua Email</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ true: '#0ea5e9' }} />
        </View>

        <Text style={styles.sectionTitle}>Khác</Text>
        <TouchableOpacity style={styles.linkItem} onPress={() => openModal('privacy')}>
          <Text style={styles.linkLabel}>Chính sách bảo mật</Text>
          <Feather name="chevron-right" size={20} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => openModal('terms')}>
          <Text style={styles.linkLabel}>Điều khoản sử dụng</Text>
          <Feather name="chevron-right" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>{getModalText()}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  // DANH SÁCH CÀI ĐẶT
  // ==========================================
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#94a3b8', 
    marginTop: 15, 
    marginBottom: 10, 
    textTransform: 'uppercase' 
  },
  settingItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  settingLabel: { 
    fontSize: 16, 
    color: '#334155', 
    fontWeight: '500' 
  },
  linkItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  linkLabel: { 
    fontSize: 16, 
    color: '#334155', 
    fontWeight: '500' 
  },

  // ==========================================
  // MODAL ĐIỀU KHOẢN & CHÍNH SÁCH
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
    padding: 24, 
    maxHeight: '70%' 
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
  modalText: { 
    fontSize: 15, 
    color: '#475569', 
    lineHeight: 24, 
    marginBottom: 20, 
    textAlign: 'justify' 
  },
  closeBtn: { 
    backgroundColor: '#F1F5F9', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 10 
  },
  closeBtnText: { 
    color: '#334155', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default SettingsScreen;
