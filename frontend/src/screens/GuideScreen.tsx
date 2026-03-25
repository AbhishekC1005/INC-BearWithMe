// Guide Screen - Human support escalation

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { Card, Button } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';

export default function GuideScreen() {
  const router = useRouter();
  const { user } = useApp();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const REASONS = [
    { id: 'crisis', label: 'Emotional Crisis', emoji: '🆘', description: 'Feeling overwhelmed or in crisis' },
    { id: 'therapy', label: 'Talk to a Therapist', emoji: '🧠', description: 'Professional mental health support' },
    { id: 'peer', label: 'Peer Support', emoji: '🤝', description: 'Connect with someone who understands' },
    { id: 'resources', label: 'Resources', emoji: '📚', description: 'Self-help materials and guides' },
  ];

  const handleContactGuide = () => {
    // In a real app, this would connect to actual support services
    // For demo, we'll show a message
    alert('Thank you for reaching out. A Guide will be in touch with you soon. Remember, you are not alone.');
  };

  const handleCallHelpline = () => {
    Linking.openURL('tel:988'); // Suicide & Crisis Lifeline
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Guide</Text>
          <Text style={styles.subtitle}>Human support when you need it</Text>
        </View>

        {/* Adam's Message */}
        <Card style={styles.adamCard}>
          <View style={styles.adamContent}>
            <Text style={styles.adamEmoji}>🐻</Text>
            <View style={styles.adamTextContainer}>
              <Text style={styles.adamName}>Adam says:</Text>
              <Text style={styles.adamText}>
                Sometimes talking to a real person can help. That's what Guides are here for - trained
                humans who specialize in emotional support. No waiting rooms, no judgment.
              </Text>
            </View>
          </View>
        </Card>

        {/* Crisis Banner */}
        <TouchableOpacity style={styles.crisisBanner} onPress={handleCallHelpline}>
          <Text style={styles.crisisEmoji}>🆘</Text>
          <View style={styles.crisisTextContainer}>
            <Text style={styles.crisisTitle}>In Crisis?</Text>
            <Text style={styles.crisisSubtitle}>Call or text 988 for immediate help</Text>
          </View>
          <Text style={styles.crisisArrow}>→</Text>
        </TouchableOpacity>

        {/* Support Options */}
        <Text style={styles.sectionTitle}>How can we help?</Text>

        {REASONS.map(reason => (
          <TouchableOpacity
            key={reason.id}
            style={[
              styles.optionCard,
              selectedReason === reason.id && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedReason(reason.id)}
          >
            <Text style={styles.optionEmoji}>{reason.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{reason.label}</Text>
              <Text style={styles.optionDesc}>{reason.description}</Text>
            </View>
            <View style={[
              styles.optionCheck,
              selectedReason === reason.id && styles.optionCheckSelected,
            ]}>
              {selectedReason === reason.id && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue Button */}
        {selectedReason && (
          <View style={styles.buttonContainer}>
            <Button title="Request Support" onPress={handleContactGuide} />
            <Text style={styles.disclaimer}>
              A trained Guide will respond within 24 hours. Your information is kept confidential.
            </Text>
          </View>
        )}

        {/* Info Cards */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>What is a Guide?</Text>
          <Text style={styles.infoText}>
            Guides are trained volunteers who provide emotional support through active listening.
            They're not therapists, but they're great at helping you work through things.
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            All conversations with Guides are confidential. We never share your data with third parties.
            Your emotional safety is our priority.
          </Text>
        </Card>

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Quick Resources</Text>
        <View style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/journal')}>
            <Text style={styles.quickLinkEmoji}>📝</Text>
            <Text style={styles.quickLinkText}>Journaling Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/insights')}>
            <Text style={styles.quickLinkEmoji}>🧘</Text>
            <Text style={styles.quickLinkText}>Breathing Exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/insights')}>
            <Text style={styles.quickLinkEmoji}>📖</Text>
            <Text style={styles.quickLinkText}>Daily Affirmations</Text>
          </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  adamCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primaryLight + '30',
  },
  adamContent: {
    flexDirection: 'row',
  },
  adamEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  adamTextContainer: {
    flex: 1,
  },
  adamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.primaryDark,
    marginBottom: SPACING.xs,
  },
  adamText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  crisisBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  crisisEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  crisisTextContainer: {
    flex: 1,
  },
  crisisTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.error,
  },
  crisisSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    opacity: 0.8,
  },
  crisisArrow: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.error,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
  },
  optionDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  disclaimer: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickLink: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  quickLinkEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  quickLinkText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
});