// Onboarding Screen - Welcome to BearWithMe

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { AdamAvatar, Button, Input } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';
import { User, MoodLevel } from '../types';
import { getGreeting } from '../utils/helpers';

const { width } = Dimensions.get('window');

const STRESSOR_OPTIONS = [
  'Academic',
  'Work',
  'Relationships',
  'Health',
  'Financial',
  'Family',
  'Social',
  'None',
];

const TIME_OPTIONS = [
  { label: '9:00 PM', value: '21:00' },
  { label: '10:00 PM', value: '22:00' },
  { label: '11:00 PM', value: '23:00' },
  { label: '12:00 AM', value: '00:00' },
  { label: '1:00 AM', value: '01:00' },
];

const WAKE_OPTIONS = [
  { label: '6:00 AM', value: '06:00' },
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
];

type OnboardingStep = 'welcome' | 'name' | 'routine' | 'stressors' | 'mood';

export default function OnboardingScreen() {
  const { setUser, setIsOnboarded } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [stressors, setStressors] = useState<string[]>([]);
  const [initialMood, setInitialMood] = useState<MoodLevel | null>(null);

  const handleComplete = async () => {
    const user: User = {
      id: Date.now().toString(),
      name,
      nickname: nickname || name,
      sleepTime: sleepTime || '22:00',
      wakeTime: wakeTime || '07:00',
      workStartTime: '09:00',
      workEndTime: '17:00',
      stressors,
      createdAt: new Date().toISOString(),
    };
    await setUser(user);
    await setIsOnboarded(true);
    router.replace('/');
  };

  const toggleStressor = (stressor: string) => {
    if (stressor === 'None') {
      setStressors(['None']);
    } else {
      const newStressors = stressors.includes(stressor)
        ? stressors.filter(s => s !== stressor)
        : [...stressors.filter(s => s !== 'None'), stressor];
      setStressors(newStressors);
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <AdamAvatar size="large" />
      <Text style={styles.title}>Welcome to BearWithMe</Text>
      <Text style={styles.subtitle}>
        I'm Adam, your supportive companion. Think of me as a wiser big brother who's always here to listen, never to judge.
      </Text>
      <Text style={styles.description}>
        This is your safe space. A place to check in with yourself, journal your thoughts, and get personalized support when life gets tough.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Let's get started" onPress={() => setStep('name')} />
      </View>
    </View>
  );

  const renderName = () => (
    <View style={styles.stepContainer}>
      <AdamAvatar size="medium" />
      <Text style={styles.title}>What should I call you?</Text>
      <Text style={styles.subtitle}>
        Let's personalize your experience. You can use your nickname or whatever feels comfortable.
      </Text>
      <View style={styles.formContainer}>
        <Input
          label="Your name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Nickname (optional)"
          placeholder="Something you prefer being called"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => setStep('routine')}
          disabled={!name.trim()}
        />
      </View>
    </View>
  );

  const renderRoutine = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepNumber}>1 of 3</Text>
      <Text style={styles.title}>Your Daily Routine</Text>
      <Text style={styles.subtitle}>
        This helps me understand your patterns and provide better support at the right times.
      </Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionLabel}>When do you usually go to sleep?</Text>
        <View style={styles.optionsRow}>
          {TIME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                sleepTime === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSleepTime(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  sleepTime === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionLabel}>When do you usually wake up?</Text>
        <View style={styles.optionsRow}>
          {WAKE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                wakeTime === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setWakeTime(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  wakeTime === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={() => setStep('stressors')} />
      </View>
    </View>
  );

  const renderStressors = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepNumber}>2 of 3</Text>
      <Text style={styles.title}>What stresses you out?</Text>
      <Text style={styles.subtitle}>
        Select what applies to you. This helps me provide more relevant support.
      </Text>

      <View style={styles.stressorGrid}>
        {STRESSOR_OPTIONS.map((stressor) => (
          <TouchableOpacity
            key={stressor}
            style={[
              styles.stressorButton,
              stressors.includes(stressor) && styles.stressorButtonSelected,
            ]}
            onPress={() => toggleStressor(stressor)}
          >
            <Text
              style={[
                styles.stressorText,
                stressors.includes(stressor) && styles.stressorTextSelected,
              ]}
            >
              {stressor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={() => setStep('mood')} />
      </View>
    </View>
  );

  const renderMood = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepNumber}>3 of 3</Text>
      <Text style={styles.title}>How are you feeling right now?</Text>
      <Text style={styles.subtitle}>
        {getGreeting()}, {nickname || name}! Take a moment to check in with yourself.
      </Text>

      <View style={styles.moodContainer}>
        {(['great', 'good', 'okay', 'low', 'bad'] as MoodLevel[]).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodOption,
              initialMood === mood && styles.moodOptionSelected,
            ]}
            onPress={() => setInitialMood(mood)}
          >
            <Text style={styles.moodEmoji}>
              {mood === 'great' ? '😊' : mood === 'good' ? '🙂' : mood === 'okay' ? '😐' : mood === 'low' ? '😔' : '😢'}
            </Text>
            <Text
              style={[
                styles.moodLabel,
                initialMood === mood && styles.moodLabelSelected,
              ]}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          disabled={!initialMood}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'welcome' && renderWelcome()}
        {step === 'name' && renderName()}
        {step === 'routine' && renderRoutine()}
        {step === 'stressors' && renderStressors()}
        {step === 'mood' && renderMood()}
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
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  formContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: SPACING.lg,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  optionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.semiBold,
  },
  stressorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  stressorButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: width * 0.35,
    alignItems: 'center',
  },
  stressorButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stressorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  stressorTextSelected: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.semiBold,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  moodOption: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary,
    minWidth: 60,
  },
  moodOptionSelected: {
    backgroundColor: COLORS.primaryLight + '40',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  moodLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  moodLabelSelected: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semiBold,
  },
});