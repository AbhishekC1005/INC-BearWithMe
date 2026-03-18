// Custom Button Component

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const base: ViewStyle = {
      ...styles.base,
      ...getSizeStyle(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: disabled ? COLORS.textLight : COLORS.primary,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: disabled ? COLORS.textLight : COLORS.backgroundSecondary,
          borderWidth: 1,
          borderColor: COLORS.primary,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? COLORS.textLight : COLORS.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...styles.text,
      ...getTextSizeStyle(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          color: disabled ? COLORS.textSecondary : '#FFFFFF',
        };
      case 'secondary':
      case 'outline':
      case 'ghost':
        return {
          ...base,
          color: disabled ? COLORS.textLight : COLORS.primary,
        };
      default:
        return base;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
        };
      case 'large':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
        };
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
        };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: FONT_SIZE.sm };
      case 'large':
        return { fontSize: FONT_SIZE.lg };
      default:
        return { fontSize: FONT_SIZE.md };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : COLORS.primary} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: FONT_WEIGHT.semiBold,
    textAlign: 'center',
  },
});