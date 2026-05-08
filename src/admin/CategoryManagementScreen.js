import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useProducts } from '../hooks/useProducts';

const normalize = (v) => String(v ?? '').trim();

export default function CategoryManagementScreen({ onBack }) {
  // === 1. KHỞI TẠO HOOKS & STATE FORM ===
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();
  const [newLabel, setNewLabel] = useState('');
  const [newImage, setNewImage] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [editingLabel, setEditingLabel] = useState('');
  const [editingImage, setEditingImage] = useState('');

  // === 2. ĐẾM SỐ LƯỢNG SẢN PHẨM TRONG MỖI DANH MỤC ===
  const productCountByCategoryKey = useMemo(() => {
    const map = new Map();
    for (const p of products || []) {
      const k = normalize(p?.categoryKey);
      if (!k) continue;
      map.set(k, (map.get(k) || 0) + 1);
    }
    return map;
  }, [products]);

  // === 3. HÀM CHỌN ẢNH TỪ THƯ VIỆN ===
  const pickImage = async (setImageCallback) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Thiếu quyền',
          'Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt của thiết bị.',
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
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageCallback(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh.');
    }
  };

  // === 4. CÁC HÀM THÊM / SỬA / XÓA ===
  // Thêm mới
  const onAdd = () => {
    const label = normalize(newLabel);
    if (!label) return;
    addCategory?.(label, newImage);
    setNewLabel('');
    setNewImage('');
  };

  // Bật chế độ sửa
  const beginEdit = (c) => {
    setEditingKey(String(c?.key || ''));
    setEditingLabel(String(c?.label || ''));
    setEditingImage(c?.image || '');
  };

  // Hủy chế độ sửa
  const cancelEdit = () => {
    setEditingKey('');
    setEditingLabel('');
    setEditingImage('');
  };

  // Lưu thay đổi danh mục
  const saveEdit = () => {
    const key = normalize(editingKey);
    const label = normalize(editingLabel);
    if (!key || !label) return;
    const res = updateCategory?.(key, label, editingImage);
    if (res && res.ok === false) {
      Alert.alert('Không thể lưu', res.message || 'Vui lòng kiểm tra lại.');
      return;
    }
    cancelEdit();
  };

  // Xác nhận xóa
  const confirmDelete = (c) => {
    const key = normalize(c?.key);
    if (!key) return;
    Alert.alert('Xoá danh mục?', 'Sản phẩm thuộc danh mục này sẽ bị bỏ danh mục.', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deleteCategory?.(key),
      },
    ]);
  };

  // === 5. RENDER GIAO DIỆN ===
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Danh mục</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Thêm danh mục</Text>
        <View style={styles.row}>
          <Pressable style={styles.imgBtn} onPress={() => pickImage(setNewImage)}>
            {newImage ? <Image source={{ uri: newImage }} style={styles.catImg} /> : <Text style={styles.imgBtnText}>📷</Text>}
          </Pressable>
          <TextInput value={newLabel} onChangeText={setNewLabel} placeholder="VD: Xe đua" style={[styles.input, { flex: 1 }]} />
          <Pressable style={styles.primaryBtn} onPress={onAdd}>
            <Text style={styles.primaryText}>Thêm</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Danh sách</Text>
        {(categories || []).map((c) => {
          const isEditing = normalize(editingKey) === normalize(c?.key);
          const count = productCountByCategoryKey.get(normalize(c?.key)) || 0;
          return (
            <View key={String(c.key)} style={styles.card}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {isEditing ? (
                  <>
                    <Pressable style={styles.imgBtn} onPress={() => pickImage(setEditingImage)}>
                      {editingImage ? <Image source={{ uri: editingImage }} style={styles.catImg} /> : <Text style={styles.imgBtnText}>📷</Text>}
                    </Pressable>
                    <TextInput value={editingLabel} onChangeText={setEditingLabel} style={[styles.input, { flex: 1 }]} />
                  </>
                ) : (
                  <>
                    {c.image ? (
                      <Image source={{ uri: c.image }} style={styles.catImgPlaceholder} />
                    ) : (
                      <View style={styles.catImgPlaceholder}><Text>🏷️</Text></View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{c.label}</Text>
                      <Text style={styles.cardSub}>{count} sản phẩm</Text>
                    </View>
                  </>
                )}
              </View>
              <View style={styles.actions}>
                {isEditing ? (
                  <>
                    <Pressable style={styles.actionBtn} onPress={saveEdit}>
                      <Text style={styles.actionText}>Lưu</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, styles.cancelBtn]} onPress={cancelEdit}>
                      <Text style={styles.actionText}>Huỷ</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={styles.actionBtn} onPress={() => beginEdit(c)}>
                      <Text style={styles.actionText}>Sửa</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => confirmDelete(c)}>
                      <Text style={styles.actionText}>Xoá</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 30,
  },
  content: {
    padding: 16,
  },

  // ==========================================
  // THANH ĐIỀU HƯỚNG TRÊN CÙNG
  // ==========================================
  topBar: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backText: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  // ==========================================
  // FORM NHẬP LIỆU
  // ==========================================
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  imgBtn: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imgBtnText: {
    fontSize: 18,
  },
  catImg: {
    width: '100%',
    height: '100%',
  },
  catImgPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  primaryBtn: {
    backgroundColor: '#00A8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
  },

  // ==========================================
  // THẺ QUẢN LÝ DANH MỤC
  // ==========================================
  card: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  deleteBtn: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
  },
  cancelBtn: {
    backgroundColor: '#E2E8F0',
  },
});
