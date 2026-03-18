// Mood Check-in Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { AdamAvatar, Button, Card } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';
import { MoodLevel } from '../types';
const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string; color: string }[] = [
  { level: 'great', emoji: '😊', label: 'Great', color: '#00B894' },
  { level: 'good', emoji: '🙂', label: 'Good', color: '#8FAE8B' },
  { level: 'okay', emoji: '😐', label: 'Okay', color: '#FDCB6E' },
  { level: 'low', emoji: '😔', label: 'Low', color: '#E17055' },
  { level: 'bad', emoji: '😢', label: 'Bad', color: '#D63031' },
];

const TRIGGERS = [
  'Work',
  'School',
  'Relationships',
  'Health',
  'Sleep',
  'Finances',
  'Family',
  'Social Media',
  'News',
  'Other',
];

export default function MoodScreen() {
  const router = useRouter();
  const { addMoodEntry, user } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    await addMoodEntry({
      level: selectedMood,
      intensity,
      note,
      triggers: selectedTriggers,
    });

    router.back();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            {getGreeting()}, {user?.nickname || user?.name || 'there'}. Take a moment for yourself.
          </Text>
        </View>

        {/* Adam Avatar */}
        <View style={styles.avatarContainer}>
          <AdamAvatar size="medium" showGreeting greeting="I'm here for you" />
        </View>

        {/* Mood Selection */}
        <Card style={styles.moodCard}>
          <Text style={styles.sectionTitle}>Select your mood</Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map(option => (
              <View
                key={option.level}
                style={[
                  styles.moodOption,
                  selectedMood === option.level && { borderColor: option.color, backgroundColor: option.color + '20' },
                ]}
              >
                <Text
                  style={styles.moodEmoji}
                  onPress={() => setSelectedMood(option.level)}
                >
                  {option.emoji}
                </Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === option.level && { color: option.color, fontWeight: '600' },
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Intensity Slider */}
        {selectedMood && (
          <Card style={styles.intensityCard}>
            <Text style={styles.sectionTitle}>Intensity level</Text>
            <Text style={styles.intensityValue}>{intensity}/10</Text>
            <View style={styles.intensityButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <Text
                  key={num}
                  style={[
                    styles.intensityButton,
                    intensity === num && styles.intensityButtonSelected,
                  ]}
                  onPress={() => setIntensity(num)}
                >
                  {num}
                </Text>
              ))}
            </View>
          </Card>
        )}

        {/* Triggers */}
        {selectedMood && (
          <Card style={styles.triggersCard}>
            <Text style={styles.sectionTitle}>What's contributing to this? (optional)</Text>
            <View style={styles.triggersGrid}>
              {TRIGGERS.map(trigger => (
                <Text
                  key={trigger}
                  style={[
                    styles.triggerChip,
                    selectedTriggers.includes(trigger) && styles.triggerChipSelected,
                  ]}
                  onPress={() => toggleTrigger(trigger)}
                >
                  {trigger}
                </Text>
              ))}
            </View>
          </Card>
        )}

        {/* Note */}
        {selectedMood && (
          <Card style={styles.noteCard}>
            <Text style={styles.sectionTitle}>Want to add more? (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="What's on your mind?"
              placeholderTextColor={COLORS.textLight}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Card>
        )}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Check-in"
            onPress={handleSubmit}
            disabled={!selectedMood}
          />
          <Button
            title="Cancel"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  moodCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  intensityCard: {
    marginBottom: SPACING.md,
  },
  intensityValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  intensityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundSecondary,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  intensityButtonSelected: {
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
  },
  triggersCard: {
    marginBottom: SPACING.md,
  },
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  triggerChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  triggerChipSelected: {
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
  },
  noteCard: {
    marginBottom: SPACING.md,
  },
  noteInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 100,
  },
  buttonContainer: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
});