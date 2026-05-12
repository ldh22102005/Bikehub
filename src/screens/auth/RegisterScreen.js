import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, AntDesign, FontAwesome, Feather } from '@expo/vector-icons';

const RegisterScreen = ({ onRegister, onNavigateToLogin, errorText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
              <Text style={styles.headerTitle}>Tạo tài khoản</Text>
              <Text style={styles.headerSubtitle}>
                Tham gia cộng đồng để bắt đầu những hành trình mới cùng Bike World
              </Text>

              <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton} onPress={onNavigateToLogin}>
                  <Text style={styles.tabText}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <View style={[styles.tabButton, styles.activeTab]}>
                  <Text style={[styles.tabText, styles.activeTabText]}>ĐĂNG KÝ</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>HỌ VÀ TÊN</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Nguyễn Văn A" 
                    placeholderTextColor="#b0b0b0" 
                    value={name} 
                    onChangeText={setName} 
                  />
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>EMAIL</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="email@vi-du.com"
                    placeholderTextColor="#b0b0b0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>MẬT KHẨU</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>NHẬP LẠI MẬT KHẨU</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="shield" size={18} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                    <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}

                <TouchableOpacity 
                  style={styles.mainButton} 
                  activeOpacity={0.9} 
                  onPress={() => onRegister?.({ name, email, password, confirmPassword })}
                >
                  <Text style={styles.mainButtonText}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>HOẶC ĐĂNG KÝ VỚI</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialIconBox}>
                  <AntDesign name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconBox}>
                  <FontAwesome name="apple" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconBox}>
                  <FontAwesome name="facebook" size={26} color="#4267B2" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.footerLink} onPress={onNavigateToLogin}>
                <Text style={styles.footerLinkText}>Đã có tài khoản? Đăng nhập tại đây</Text>
              </TouchableOpacity>
            </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? content : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
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
    backgroundColor: '#E5E5E5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  card: {
    width: '88%',
    backgroundColor: '#FDFDFD',
    borderRadius: 40,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },

  // ==========================================
  // TIÊU ĐỀ
  // ==========================================
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0ea5e9',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  // ==========================================
  // TAB CHUYỂN ĐỔI (ĐĂNG NHẬP / ĐĂNG KÝ)
  // ==========================================
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    padding: 5,
    marginBottom: 35,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },

  // ==========================================
  // FORM NHẬP LIỆU (INPUTS)
  // ==========================================
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    marginTop: 12,
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },

  // ==========================================
  // NÚT CHÍNH (ĐĂNG KÝ)
  // ==========================================
  mainButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    elevation: 5,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ==========================================
  // PHẦN HOẶC (DIVIDER)
  // ==========================================
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 10,
    color: '#BDBDBD',
    fontWeight: 'bold',
  },

  // ==========================================
  // MẠNG XÃ HỘI & FOOTER
  // ==========================================
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  socialIconBox: {
    width: 70,
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    elevation: 2,
  },
  footerLink: {
    marginTop: 25,
  },
  footerLinkText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;