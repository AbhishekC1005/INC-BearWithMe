// Insights Screen - Mood trends and patterns

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';
import { getMoodEmoji, getMoodLabel, getMoodColor, detectPatterns } from '../utils/helpers';
import { MoodLevel } from '../types';

export default function InsightsScreen() {
  const { moodEntries, journalEntries, user } = useApp();

  const stats = useMemo(() => {
    if (moodEntries.length === 0) return null;

    const moodCounts: Record<MoodLevel, number> = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      bad: 0,
    };

    let totalIntensity = 0;

    moodEntries.forEach(entry => {
      moodCounts[entry.level]++;
      totalIntensity += entry.intensity;
    });

    const averageIntensity = totalIntensity / moodEntries.length;

    // Get most common mood
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0][0] as MoodLevel;

    // Get recent streak (consecutive days with entries)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntry = moodEntries.some(
        entry => new Date(entry.timestamp).toDateString() === checkDate.toDateString()
      );
      if (hasEntry) streak++;
      else if (i > 0) break;
    }

    return {
      totalEntries: moodEntries.length,
      averageIntensity: averageIntensity.toFixed(1),
      mostCommonMood,
      moodCounts,
      streak,
    };
  }, [moodEntries]);

  const patterns = useMemo(() => detectPatterns(moodEntries, journalEntries), [moodEntries, journalEntries]);

  const last7DaysMoods = useMemo(() => {
    const days: { day: string; mood: MoodLevel | null }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayEntry = moodEntries.find(
        entry => new Date(entry.timestamp).toDateString() === date.toDateString()
      );

      days.push({
        day: dayName,
        mood: dayEntry?.level || null,
      });
    }

    return days;
  }, [moodEntries]);

  if (!stats) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Your emotional patterns</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptySubtitle}>
            Start checking in to see your mood patterns and insights
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>
            Hey {user?.nickname || user?.name || 'there'}, here's your emotional overview
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageIntensity}</Text>
            <Text style={styles.statLabel}>Avg Intensity</Text>
          </Card>
        </View>

        {/* Last 7 Days */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.weekView}>
            {last7DaysMoods.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayDot,
                    day.mood
                      ? { backgroundColor: getMoodColor(day.mood) }
                      : { backgroundColor: COLORS.border },
                  ]}
                >
                  {day.mood && <Text style={styles.dayEmoji}>{getMoodEmoji(day.mood)}</Text>}
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Mood Distribution */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mood Distribution</Text>
          <View style={styles.distributionContainer}>
            {(['great', 'good', 'okay', 'low', 'bad'] as MoodLevel[]).map(mood => {
              const count = stats.moodCounts[mood];
              const percentage = stats.totalEntries > 0
                ? Math.round((count / stats.totalEntries) * 100)
                : 0;

              return (
                <View key={mood} style={styles.distributionRow}>
                  <View style={styles.distributionLabel}>
                    <Text style={styles.distributionEmoji}>{getMoodEmoji(mood)}</Text>
                    <Text style={styles.distributionText}>{getMoodLabel(mood)}</Text>
                  </View>
                  <View style={styles.distributionBar}>
                    <View
                      style={[
                        styles.distributionFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getMoodColor(mood),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.distributionPercent}>{percentage}%</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Common Mood */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Most Common Mood</Text>
          <View style={styles.commonMoodContainer}>
            <Text style={styles.commonMoodEmoji}>{getMoodEmoji(stats.mostCommonMood)}</Text>
            <View>
              <Text style={[styles.commonMoodLabel, { color: getMoodColor(stats.mostCommonMood) }]}>
                {getMoodLabel(stats.mostCommonMood)}
              </Text>
              <Text style={styles.commonMoodDesc}>
                You've been feeling {stats.mostCommonMood} most often
              </Text>
            </View>
          </View>
        </Card>

        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <Card style={styles.patternCard}>
            <Text style={styles.sectionTitle}>🎯 Detected Patterns</Text>
            {patterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <Text style={styles.patternType}>{pattern.type.toUpperCase()}</Text>
                <Text style={styles.patternDesc}>{pattern.description}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Journal Stats */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Journal Stats</Text>
          <View style={styles.journalStats}>
            <View style={styles.journalStat}>
              <Text style={styles.journalStatValue}>{journalEntries.length}</Text>
              <Text style={styles.journalStatLabel}>Total Entries</Text>
            </View>
            <View style={styles.journalStat}>
              <Text style={styles.journalStatValue}>
                {journalEntries.length > 0
                  ? Math.round(journalEntries.reduce((acc, e) => acc + e.content.length, 0) / journalEntries.length)
                  : 0}
              </Text>
              <Text style={styles.journalStatLabel}>Avg. Words</Text>
            </View>
          </View>
        </Card>

        {/* Encouragement */}
        <Card style={styles.encouragementCard}>
          <Text style={styles.encouragementEmoji}>💚</Text>
          <Text style={styles.encouragementText}>
            Remember, tracking your mood is a powerful step towards self-awareness.
            You're doing great, {user?.nickname || user?.name || 'friend'}!
          </Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dayEmoji: {
    fontSize: 18,
  },
  dayLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  distributionContainer: {
    gap: SPACING.sm,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  distributionEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  distributionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  distributionBar: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 6,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 6,
  },
  distributionPercent: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  commonMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonMoodEmoji: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  commonMoodLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  commonMoodDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  patternCard: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primaryLight + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  patternItem: {
    marginBottom: SPACING.sm,
  },
  patternType: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  patternDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  journalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journalStat: {
    alignItems: 'center',
  },
  journalStatValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  journalStatLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  encouragementCard: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  encouragementEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  encouragementText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});