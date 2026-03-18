// Adam Avatar Component - The friendly bear mascot

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface AdamAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showGreeting?: boolean;
  greeting?: string;
}

export default function AdamAvatar({ size = 'medium', showGreeting = false, greeting }: AdamAvatarProps) {
  const dimensions = {
    small: 40,
    medium: 60,
    large: 100,
  };

  const fontSizes = {
    small: 20,
    medium: 30,
    large: 50,
  };

  const dim = dimensions[size];
  const fontSize = fontSizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bearContainer,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
          },
        ]}
      >
        <Text style={{ fontSize }}>🐻</Text>
        <View
          style={[
            styles.hoodie,
            {
              width: dim * 0.8,
              height: dim * 0.4,
              bottom: dim * 0.1,
              borderBottomLeftRadius: dim / 4,
              borderBottomRightRadius: dim / 4,
            },
          ]}
        />
      </View>
      {showGreeting && (
        <Text style={styles.greeting}>{greeting || "Hey there! I'm Adam"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bearContainer: {
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  hoodie: {
    backgroundColor: COLORS.primary,
    position: 'absolute',
  },
  greeting: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});