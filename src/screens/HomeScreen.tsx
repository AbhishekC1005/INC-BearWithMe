// Home Screen - Main Dashboard

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { AdamAvatar, Card, Button } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';
import { getMoodEmoji, getMoodLabel, getMoodColor, detectPatterns, getContextualGreeting, getProactiveInsight } from '../utils/helpers';

export default function HomeScreen() {
  const router = useRouter();
  const { user, moodEntries, getTodayMood, journalEntries } = useApp();
  const todayMood = getTodayMood();
  const patterns = detectPatterns(moodEntries, journalEntries);

  const greeting = getContextualGreeting(user);
  const proactiveMessage = getProactiveInsight(user, moodEntries, patterns, todayMood);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting}
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <AdamAvatar size="small" />
          </TouchableOpacity>
        </View>

        {/* Adam's Message Card */}
        <Card style={styles.adamCard}>
          <View style={styles.adamCardContent}>
            <Text style={styles.adamEmoji}>🐻</Text>
            <View style={styles.adamMessage}>
              <Text style={styles.adamName}>Adam says:</Text>
              <Text style={styles.adamText}>
                {proactiveMessage}
              </Text>
            </View>
          </View>
        </Card>

        {/* Today's Mood Status */}
        {todayMood ? (
          <Card style={styles.moodCard}>
            <View style={styles.moodHeader}>
              <Text style={styles.sectionTitle}>Today's Mood</Text>
              <Text style={styles.moodTime}>
                {new Date(todayMood.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmojiLarge}>{getMoodEmoji(todayMood.level)}</Text>
              <View>
                <Text style={[styles.moodStatus, { color: getMoodColor(todayMood.level) }]}>
                  Feeling {getMoodLabel(todayMood.level)}
                </Text>
                {todayMood.note && (
                  <Text style={styles.moodNote} numberOfLines={2}>
                    "{todayMood.note}"
                  </Text>
                )}
              </View>
            </View>
          </Card>
        ) : (
          <Card style={styles.checkInCard}>
            <Text style={styles.checkInTitle}>How are you feeling?</Text>
            <Text style={styles.checkInSubtitle}>
              Take a moment to check in with yourself
            </Text>
            <Button
              title="Check In Now"
              onPress={() => router.push('/mood')}
              style={styles.checkInButton}
            />
          </Card>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/journal')}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Journal</Text>
            <Text style={styles.actionCount}>
              {journalEntries.length} entries
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Chat with Adam</Text>
            <Text style={styles.actionCount}>AI companion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/insights')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>Insights</Text>
            <Text style={styles.actionCount}>View patterns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/guide')}
          >
            <Text style={styles.actionIcon}>🧑‍🏫</Text>
            <Text style={styles.actionLabel}>Guide</Text>
            <Text style={styles.actionCount}>Get help</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <Card style={styles.quoteCard}>
          <Text style={styles.quoteEmoji}>💚</Text>
          <Text style={styles.quoteText}>
            "You don't have to be perfect to be progress. Every small step counts."
          </Text>
          <Text style={styles.quoteAuthor}>— Adam</Text>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  adamCard: {
    backgroundColor: COLORS.primaryLight + '30',
    marginBottom: SPACING.lg,
  },
  adamCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  adamEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  adamMessage: {
    flex: 1,
  },
  adamName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.primaryDark,
    marginBottom: SPACING.xs,
  },
  adamText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  moodCard: {
    marginBottom: SPACING.lg,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  moodTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmojiLarge: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  moodStatus: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  moodNote: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  checkInCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  checkInTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  checkInSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  checkInButton: {
    minWidth: 160,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  actionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text,
  },
  actionCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  quoteCard: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  quoteEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  quoteText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semiBold,
    marginTop: SPACING.sm,
  },
});