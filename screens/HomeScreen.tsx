import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Design tokens
const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#302f2f',
  textSecondary: '#7857e1',
};

// Mood options
interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

const moodOptions: MoodOption[] = [
  { id: 'excellent', label: 'Excellent', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'awful', label: 'Awful', emoji: '😢' },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedMood, setSelectedMood] = useState<string>('excellent');

  const handleNext = () => {
    navigation.navigate('Journals', { screen: 'JournalWriting' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <View style={styles.profileIconInner} />
        </View>

        <View style={styles.notificationContainer}>
          <View style={styles.bellIcon}>
            <View style={styles.bellBody} />
            <View style={styles.bellClapper} />
          </View>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.greetingText}>Hi Sudhir</Text>
        <Text style={styles.encouragementText}>
          Take a deep breath. You're doing great today.
        </Text>

        {/* Journal Card */}
        <View style={styles.journalCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>How was your day?</Text>
              <Text style={styles.cardSubtitle}>
                Taking a moment to write down your thoughts helps Adam understand
                you better before you chat.
              </Text>
            </View>
            <View style={styles.notesIcon}>
              <View style={styles.notesLine1} />
              <View style={styles.notesLine2} />
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          <Text style={styles.moodQuestion}>How are you feeling today?</Text>

          <View style={styles.moodContainer}>
            {moodOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.moodOption,
                  selectedMood === option.id && styles.moodOptionSelected,
                ]}
                onPress={() => setSelectedMood(option.id)}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === option.id && styles.moodLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Adam Card (Locked) */}
        <TouchableOpacity style={styles.adamCard} onPress={() => navigation.navigate('Chat')}>
          <View style={styles.adamCardContent}>
            <View style={styles.unlockBadge}>
              <Text style={styles.unlockText}>Unlock after Journaling</Text>
            </View>
            <Text style={styles.adamTitle}>Adam is ready when you are.</Text>
            <Text style={styles.adamDescription}>
              Once you finish today's journaling, Step 2 will unlock. Adam is
              waiting to hear how your day went!
            </Text>
          </View>
          <View style={styles.adamImagePlaceholder}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.bearImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 8,
  },
  profileIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  notificationContainer: {
    position: 'relative',
  },
  bellIcon: {
    width: 24,
    height: 24,
  },
  bellBody: {
    width: 18,
    height: 20,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  bellClapper: {
    width: 4,
    height: 4,
    backgroundColor: colors.textPrimary,
    position: 'absolute',
    bottom: 0,
    left: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  greetingText: {
    fontSize: 28,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 4,
  },
  encouragementText: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  journalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 10,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    opacity: 0.6,
    marginTop: 4,
    maxWidth: '84%',
  },
  notesIcon: {
    width: 36,
    height: 36,
  },
  notesLine1: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#35236d',
    position: 'absolute',
  },
  notesLine2: {
    width: 22,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'absolute',
    top: 4,
    left: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  progressBarFill: {
    width: 11,
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  moodQuestion: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  moodContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  moodOption: {
    width: '100%',
    height: 42,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    paddingHorizontal: 21,
  },
  moodOptionSelected: {
    backgroundColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  moodLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
  },
  moodLabelSelected: {
    color: colors.white,
  },
  nextButton: {
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
  },
  adamCard: {
    backgroundColor: colors.primary,
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  adamCardContent: {
    flex: 1,
  },
  unlockBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  unlockText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  adamTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  adamDescription: {
    fontSize: 9,
    fontFamily: 'Urbanist',
    color: colors.background,
    opacity: 0.6,
  },
  adamImagePlaceholder: {
    width: 104,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bearImage: {
    width: 96,
    height: 116,
  },
});

export default HomeScreen;