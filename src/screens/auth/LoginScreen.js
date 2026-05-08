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
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';

const LoginScreen = ({ onNavigateToRegister, onLogin, onSocialLogin, errorText }) => {
  // === 1. KHỞI TẠO STATE LƯU FORM ĐĂNG NHẬP ===
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // === 2. RENDER GIAO DIỆN FORM ĐĂNG NHẬP ===
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.headerTitle}>Chào mừng</Text>
              <Text style={styles.headerSubtitle}>
                Bắt đầu hành trình chinh phục những cung đường mới
              </Text>

              <View style={styles.tabContainer}>
                <View style={[styles.tabButton, styles.activeTab]}>
                  <Text style={[styles.tabText, styles.activeTabText]}>ĐĂNG NHẬP</Text>
                </View>
                <TouchableOpacity style={styles.tabButton} onPress={onNavigateToRegister}>
                  <Text style={styles.tabText}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@vi-du.com"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={[styles.inputLabel, { marginTop: 20 }]}>MẬT KHẨU</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>

                {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}

                <TouchableOpacity 
                  style={styles.mainButton} 
                  onPress={() => onLogin?.({ email, password })}
                >
                  <Text style={styles.mainButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialIconBox} onPress={() => onSocialLogin?.('Google')}>
                  <AntDesign name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconBox} onPress={() => onSocialLogin?.('Apple')}>
                  <FontAwesome name="apple" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconBox} onPress={() => onSocialLogin?.('Facebook')}>
                  <FontAwesome name="facebook" size={26} color="#4267B2" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.footerLink} onPress={onNavigateToRegister}>
                <Text style={styles.footerLinkText}>Chưa có tài khoản? Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E5E5E5' 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 40 
  },
  card: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 40,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#06261B',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#444', 
    marginVertical: 10,
    lineHeight: 20 
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F2F2F2', 
    borderRadius: 25, 
    padding: 5, 
    marginVertical: 20, 
    width: '100%' 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 20 
  },
  activeTab: { 
    backgroundColor: '#06261B' 
  },
  tabText: { 
    color: '#666', 
    fontWeight: 'bold',
    fontSize: 13
  },
  activeTabText: { 
    color: '#FFF' 
  },
  inputContainer: { 
    width: '100%' 
  },
  inputLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#06261B' 
  },
  input: { 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 10,
    fontSize: 15,
    color: '#333'
  },
  passwordWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    paddingHorizontal: 15 
  },
  passwordInput: { 
    flex: 1, 
    paddingVertical: 15,
    fontSize: 15,
    color: '#333'
  },
  errorText: { 
    marginTop: 12, 
    color: '#ef4444', 
    fontWeight: '600',
    fontSize: 13 
  },
  mainButton: { 
    backgroundColor: '#06261B', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 25 
  },
  mainButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25, 
    width: '100%' 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#DDD' 
  },
  dividerText: { 
    paddingHorizontal: 10, 
    fontSize: 12, 
    color: '#999',
    fontWeight: '500' 
  },
  socialRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  socialIconBox: { 
    width: '30%', 
    height: 60, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFF' 
  },
  footerLink: { 
    marginTop: 25 
  },
  footerLinkText: { 
    fontSize: 14, 
    color: '#06261B', 
    textDecorationLine: 'underline',
    fontWeight: '500' 
  },
});

export default LoginScreen;