import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const DEFAULT_USERS = {
  'demo@bikehub.com': { name: 'Demo User', password: '123456', role: 'user' },
  'admin@bikehub.com': { name: 'Admin', password: 'admin', role: 'admin' },
};

export const AuthProvider = ({ children }) => {
  // === 1. KHỞI TẠO STATE NGƯỜI DÙNG ===
  const [usersByEmail, setUsersByEmail] = useState(DEFAULT_USERS);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // === 2. LIFECYCLE: LẤY TRẠNG THÁI ĐĂNG NHẬP ===
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [storedUsers, storedUser] = await Promise.all([
          AsyncStorage.getItem('usersByEmail'),
          AsyncStorage.getItem('currentUser'),
        ]);

        if (!mounted) return;

        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          setUsersByEmail({ ...DEFAULT_USERS, ...(parsed || {}) });
        } else {
          setUsersByEmail(DEFAULT_USERS);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        if (!mounted) return;
        setUsersByEmail(DEFAULT_USERS);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Xóa cảnh báo lỗi hiển thị trên UI
  const clearError = useCallback(() => setError(''), []);

  // === 3. CÁC HÀM XỬ LÝ AUTH (XÁC THỰC) ===
  // Đăng nhập truyền thống
  const signIn = useCallback(
    async ({ email, password }) => {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedPassword = String(password || '');

      if (!normalizedEmail || !normalizedPassword) {
        setError('Vui long nhap email va mat khau.');
        return false;
      }

      const found = usersByEmail[normalizedEmail];
      if (!found || found.password !== normalizedPassword) {
        setError('Email hoac mat khau khong dung. (Demo: demo@bikehub.com / 123456)');
        return false;
      }

      setError('');

      const nextUser = { email: normalizedEmail, name: found.name, role: found.role || 'user' };
      setUser(nextUser);
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(nextUser));
      } catch {
        // ignore
      }
      return true;
    },
    [usersByEmail]
  );

  // Đăng ký tài khoản mới
  const signUp = useCallback(
    async ({ name, email, password, confirmPassword }) => {
      const normalizedName = String(name || '').trim();
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedPassword = String(password || '');
      const normalizedConfirm = String(confirmPassword || '');

      if (!normalizedName || !normalizedEmail || !normalizedPassword || !normalizedConfirm) {
        setError('Vui long nhap day du thong tin.');
        return false;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
      if (!emailOk) {
        setError('Email khong hop le.');
        return false;
      }

      if (normalizedPassword.length < 6) {
        setError('Mat khau phai co it nhat 6 ky tu.');
        return false;
      }

      if (normalizedPassword !== normalizedConfirm) {
        setError('Mat khau nhap lai khong khop.');
        return false;
      }

      if (usersByEmail[normalizedEmail]) {
        setError('Email da duoc dang ky.');
        return false;
      }

      if (normalizedEmail === 'admin@bikehub.com') {
        setError('Email nay da duoc danh rieng cho admin.');
        return false;
      }

      const nextUsers = {
        ...usersByEmail,
        [normalizedEmail]: { name: normalizedName, password: normalizedPassword, role: 'user' },
      };

      setUsersByEmail(nextUsers);
      try {
        await AsyncStorage.setItem('usersByEmail', JSON.stringify(nextUsers));
      } catch {
        // ignore
      }

      setError('');
      return true;
    },
    [usersByEmail]
  );

  // Đăng xuất khỏi hệ thống
  const signOut = useCallback(async () => {
    setUser(null);
    setError('');
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch {
      // ignore
    }
  }, []);

  // Cập nhật thông tin cá nhân (Tên, Ảnh đại diện, SĐT, Email)
  const updateProfile = useCallback(
    async ({ name, avatar, email, phone }) => {
      if (!user?.email) return false;

      const oldEmail = String(user.email).trim().toLowerCase();
      const newEmail = String(email ?? oldEmail).trim().toLowerCase();
      const newName = name != null ? String(name) : user.name;
      const newPhone = phone != null ? String(phone) : user.phone;

      if (!newEmail) return false;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
      if (!emailOk) {
        setError('Email khong hop le.');
        return false;
      }

      const existing = usersByEmail[oldEmail];
      if (!existing) return false;

      if (newEmail !== oldEmail && usersByEmail[newEmail]) {
        setError('Email da duoc dang ky.');
        return false;
      }

      const nextUsers = { ...usersByEmail };
      delete nextUsers[oldEmail];
      nextUsers[newEmail] = { ...existing, name: newName };

      const nextUser = { ...user, email: newEmail, name: newName, avatar, phone: newPhone };

      setUsersByEmail(nextUsers);
      setUser(nextUser);
      setError('');

      try {
        await Promise.all([
          AsyncStorage.setItem('usersByEmail', JSON.stringify(nextUsers)),
          AsyncStorage.setItem('currentUser', JSON.stringify(nextUser)),
        ]);
      } catch {
        // ignore
      }

      return true;
    },
    [user, usersByEmail]
  );

  // Đăng nhập nhanh qua Mạng xã hội (Mock giả lập)
  const socialSignIn = useCallback(
    async (provider) => {
      const email = `${provider.toLowerCase()}@bikehub.com`;
      const name = `${provider} User`;

      const nextUser = { email, name, role: 'user', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' };
      
      setUsersByEmail((prev) => {
        if (!prev[email]) {
          const nextUsers = { ...prev, [email]: { name, password: 'social_login', role: 'user' } };
          AsyncStorage.setItem('usersByEmail', JSON.stringify(nextUsers)).catch(() => {});
          return nextUsers;
        }
        return prev;
      });

      setUser(nextUser);
      setError('');
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(nextUser));
      } catch {
        // ignore
      }
      return true;
    },
    []
  );

  const value = useMemo(
    () => ({ user, usersByEmail, loading, error, clearError, signIn, signUp, signOut, updateProfile, socialSignIn }),
    [user, usersByEmail, loading, error, clearError, signIn, signUp, signOut, updateProfile, socialSignIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
