import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProductCard({ product, onPress, right, style }) {
  if (!product) return null;

  return (
    <Pressable onPress={() => onPress?.(product)} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>
      <View style={styles.imgWrap}>
        {product.image ? <Image source={product.image} style={styles.img} resizeMode="contain" /> : <Text style={styles.fallback}>🚲</Text>}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        {product.category ? (
          <Text style={styles.category} numberOfLines={1}>
            {product.category}
          </Text>
        ) : null}
        {product.price ? <Text style={styles.price}>{product.price}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
  },
  pressed: { opacity: 0.92 },
  imgWrap: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  img: { width: 56, height: 56 },
  fallback: { fontSize: 28, opacity: 0.8 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  category: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 6 },
  price: { fontSize: 13, color: '#0ea5e9', fontWeight: '800' },
  right: { marginLeft: 10, alignItems: 'center', justifyContent: 'center' },
});
