import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  left,
  right,
  variant = 'primary', // primary | secondary | danger
  disabled = false,
  style,
  textStyle,
}) {
  const baseStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'danger'
        ? styles.danger
        : styles.primary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        baseStyle,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {left ? <View style={styles.side}>{left}</View> : null}
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary, textStyle]} numberOfLines={1}>
          {title}
        </Text>
        {right ? <View style={styles.side}>{right}</View> : <View style={styles.side} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  side: { minWidth: 22, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#0ea5e9' },
  secondary: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0' },
  danger: { backgroundColor: '#ef4444' },
  text: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  textSecondary: { color: '#0f172a' },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.5 },
});
