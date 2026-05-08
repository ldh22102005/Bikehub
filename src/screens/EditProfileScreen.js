import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Image, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ onBack, onSave, user, isDarkMode }) => {
  // === 1. KHỞI TẠO STATE VỚI DỮ LIỆU USER HIỆN TẠI ===
  const [name, setName] = useState(user?.name ?? 'Rider One');
  const [email, setEmail] = useState(user?.email ?? 'rider@example.com');
  const [phone, setPhone] = useState('+84 123 456 789');
  const [avatarUri, setAvatarUri] = useState(user?.avatar ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200');

  // === 2. XỬ LÝ CHỌN VÀ ĐỔI ẢNH ĐẠI DIỆN ===
  const handlePickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Thiếu quyền',
          'Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt để đổi ảnh đại diện.',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // Hỗ trợ cho cả bản mới (dùng assets) và bản cũ (dùng uri) của thư viện
      if (!result.canceled && !result.cancelled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        if (imageUri) setAvatarUri(imageUri);
      }
    } catch (error) {
      console.log('ImagePicker Error:', error);
      alert('Lỗi khi mở thư viện ảnh: ' + error.message);
    }
  };

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = isDarkMode ? '#1E293B' : '#FFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#334155';
  const border = isDarkMode ? '#334155' : '#F1F5F9';

  // === 3. RENDER FORM CHỈNH SỬA ===
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textMain }]}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
            <Feather name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>Họ và tên</Text>
          <TextInput style={[styles.input, { backgroundColor: cardBg, borderColor: border, color: textMain }]} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>Email</Text>
          <TextInput style={[styles.input, { backgroundColor: cardBg, borderColor: border, color: textMain }]} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>Số điện thoại</Text>
          <TextInput style={[styles.input, { backgroundColor: cardBg, borderColor: border, color: textMain }]} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={() => {
            const nameTrimmed = String(name || '').trim();
            const emailTrimmed = String(email || '').trim().toLowerCase();
            const phoneTrimmed = String(phone || '').trim();

            if (!nameTrimmed) {
              Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên.');
              return;
            }
            if (!emailTrimmed) {
              Alert.alert('Thiếu thông tin', 'Vui lòng nhập email.');
              return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailTrimmed)) {
              Alert.alert('Email không hợp lệ', 'Vui lòng nhập email hợp lệ (ví dụ: user@example.com).');
              return;
            }
            if (!phoneTrimmed) {
              Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại.');
              return;
            }

            if (onSave) onSave({ name: nameTrimmed, email: emailTrimmed, phone: phoneTrimmed, avatar: avatarUri });
          }}
        >
          <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
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
    padding: 20, 
    alignItems: 'center' 
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
  // KHU VỰC ẢNH ĐẠI DIỆN (AVATAR)
  // ==========================================
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 30 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#FFF' 
  },
  cameraBtn: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#0ea5e9', 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#FFF' 
  },

  // ==========================================
  // FORM NHẬP LIỆU
  // ==========================================
  inputGroup: { 
    width: '100%', 
    marginBottom: 15 
  },
  label: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#64748B', 
    marginBottom: 8 
  },
  input: { 
    width: '100%', 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 15, 
    color: '#334155' 
  },

  // ==========================================
  // NÚT LƯU THAY ĐỔI
  // ==========================================
  saveBtn: { 
    backgroundColor: '#0ea5e9', 
    width: '100%', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  saveBtnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default EditProfileScreen;
