import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Linking } from 'react-native';

import { useProducts } from '../hooks/useProducts';

export default function AddProductScreen({ onBack }) {
  // === 1. KHỞI TẠO STATE ===
  const { categories, addCategory, addProduct } = useProducts();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQty, setStockQty] = useState('10');
  const [imageUris, setImageUris] = useState([]);

  const suggestedCategories = useMemo(() => categories || [], [categories]);

  // === 2. XỬ LÝ CHỌN NHIỀU ẢNH ===
  const pickImages = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Thiếu quyền',
          'Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt để chọn ảnh sản phẩm.',
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
        quality: 0.85,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (result.canceled) return;
      const picked = (result.assets || []).map((a) => a?.uri).filter(Boolean);
      if (!picked.length) return;
      setImageUris((prev) => Array.from(new Set([...(prev || []), ...picked])));
    } catch {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    }
  };

  // === 3. XỬ LÝ LƯU SẢN PHẨM MỚI ===
  const onSave = () => {
    const categoryLabel = String(category || '').trim();
    if (!categoryLabel) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn/nhập Danh mục.');
      return;
    }

    const ensured = addCategory?.(categoryLabel);
    const res = addProduct?.({
      name,
      price,
      categoryLabel: ensured?.label ?? categoryLabel,
      images: (imageUris || []).map((uri) => ({ uri })),
      stockQty: Number(stockQty || 0),
    });

    if (!res?.ok) {
      Alert.alert('Không thể lưu', res?.message || 'Vui lòng kiểm tra lại thông tin.');
      return;
    }

    Alert.alert('Thành công', 'Đã thêm sản phẩm.');
    onBack?.();
  };

  // === 4. RENDER GIAO DIỆN THÊM SẢN PHẨM ===
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Thêm sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput value={name} onChangeText={setName} placeholder="VD: Summit Pro 1" style={styles.input} />

        <Text style={styles.label}>Giá</Text>
        <TextInput value={price} onChangeText={setPrice} placeholder="VD: $1999.00" style={styles.input} />

        <Text style={styles.label}>Số lượng tồn kho</Text>
        <TextInput value={stockQty} onChangeText={setStockQty} keyboardType="numeric" placeholder="VD: 10" style={styles.input} />

        <Text style={styles.label}>Danh mục</Text>
        <TextInput value={category} onChangeText={setCategory} placeholder="VD: Xe đua" style={styles.input} />
        <View style={styles.categoryChips}>
          {suggestedCategories.map((c) => (
            <Pressable key={c.key} style={styles.chip} onPress={() => setCategory(c.label)}>
              <Text style={styles.chipText}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Ảnh sản phẩm</Text>
        <Pressable style={styles.pickBtn} onPress={pickImages}>
          <Text style={styles.pickBtnText}>{imageUris.length ? 'Thêm/đổi ảnh' : 'Chọn ảnh từ thư viện'}</Text>
        </Pressable>
        {!!imageUris.length && (
          <View style={styles.thumbs}>
            {imageUris.map((uri) => (
              <View key={uri} style={styles.thumbWrap}>
                <Image source={{ uri }} style={styles.thumb} />
                <Pressable style={styles.removeBtn} onPress={() => setImageUris((prev) => (prev || []).filter((u) => u !== uri))} hitSlop={10}>
                  <Text style={styles.removeText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 30 },
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
  backText: { fontSize: 22, color: '#111827', fontWeight: '700' },
  title: { fontSize: 16, fontWeight: '800', color: '#111827' },
  form: { padding: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  categoryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  chipText: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  pickBtn: { marginTop: 6, backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  pickBtnText: { color: '#fff', fontWeight: '800' },
  thumbs: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: { width: 92, height: 92, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff' },
  thumb: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(15, 23, 42, 0.85)', alignItems: 'center', justifyContent: 'center' },
  removeText: { color: '#fff', fontWeight: '900', fontSize: 16, marginTop: -1 },
  saveBtn: { marginTop: 18, backgroundColor: '#00A8E8', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '800' },
});
