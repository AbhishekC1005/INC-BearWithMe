// Mood Selector Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoodLevel } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants/theme';
import { getMoodEmoji, getMoodLabel, getMoodColor } from '../utils/helpers';

interface MoodSelectorProps {
  selected: MoodLevel | null;
  onSelect: (mood: MoodLevel) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function MoodSelector({ selected, onSelect, size = 'medium' }: MoodSelectorProps) {
  const moods: MoodLevel[] = ['great', 'good', 'okay', 'low', 'bad'];

  const dimensions = {
    small: 50,
    medium: 65,
    large: 80,
  };

  const emojiSizes = {
    small: 24,
    medium: 30,
    large: 40,
  };

  const dim = dimensions[size];
  const emojiSize = emojiSizes[size];

  return (
    <View style={styles.container}>
      {moods.map((mood) => {
        const isSelected = selected === mood;
        const moodColor = getMoodColor(mood);

        return (
          <TouchableOpacity
            key={mood}
            onPress={() => onSelect(mood)}
            style={[
              styles.moodButton,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
                borderColor: isSelected ? moodColor : 'transparent',
                backgroundColor: isSelected ? moodColor + '20' : COLORS.backgroundSecondary,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: emojiSize }}>{getMoodEmoji(mood)}</Text>
            <Text
              style={[
                styles.moodLabel,
                { fontSize: size === 'small' ? 10 : 12 },
                isSelected && { color: moodColor, fontWeight: '600' },
              ]}
            >
              {getMoodLabel(mood)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  moodLabel: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});