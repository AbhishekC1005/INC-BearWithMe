// Profile Screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { Card, AdamAvatar, Button } from '../components';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, setUser, moodEntries, journalEntries, chatMessages, setIsOnboarded } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Reset App',
      'This will delete all your data and restart the onboarding process. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await setUser(null);
            await setIsOnboarded(false);
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // In a full app, this would open an edit modal
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <AdamAvatar size="large" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userNickname}>
                Called "{user?.nickname}" by Adam
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Card>

        {/* Routine Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Your Routine</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sleep Time</Text>
            <Text style={styles.infoValue}>{user?.sleepTime || '10:00 PM'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wake Time</Text>
            <Text style={styles.infoValue}>{user?.wakeTime || '7:00 AM'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stressors</Text>
            <Text style={styles.infoValue}>
              {user?.stressors?.length ? user.stressors.join(', ') : 'Not set'}
            </Text>
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moodEntries.length}</Text>
              <Text style={styles.statLabel}>Mood Check-ins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{journalEntries.length}</Text>
              <Text style={styles.statLabel}>Journal Entries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{chatMessages.length}</Text>
              <Text style={styles.statLabel}>Chat Messages</Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🌙</Text>
            <Text style={styles.settingLabel}>Reminders</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingLabel}>Privacy</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Card style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About BearWithMe</Text>
          <Text style={styles.aboutText}>
            BearWithMe is your AI-powered emotional companion, designed to provide
            support while respecting that professional help is always available when needed.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </Card>

        {/* Logout Button */}
        <Button
          title="Reset App"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  userNickname: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editButton: {
    padding: SPACING.sm,
  },
  editButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHT.medium,
    maxWidth: '60%',
    textAlign: 'right',
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  settingsCard: {
    marginBottom: SPACING.md,
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  settingArrow: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  aboutCard: {
    marginBottom: SPACING.lg,
  },
  aboutTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  version: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.error,
  },
});