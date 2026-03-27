import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';
import { Svg, Path, Rect } from 'react-native-svg';

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
  const route = useRoute<any>();
  const { user, addJournalEntry, updateJournalEntry, addMoodEntry, journalEntries, signOut } = useApp();
  const [selectedMood, setSelectedMood] = useState<string>('excellent');
  const [journalStep, setJournalStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [journalCompleted, setJournalCompleted] = useState<boolean>(false);
  const [mainThingText, setMainThingText] = useState<string>('');
  const [feelingText, setFeelingText] = useState<string>('');
  const [needFromAdamText, setNeedFromAdamText] = useState<string>('');
  const [todayEntryId, setTodayEntryId] = useState<string | null>(null);
  const nickname = route.params?.nickname || user?.name || 'Piyush';
  const journalEntryParts = [
    mainThingText.trim(),
    feelingText.trim(),
    needFromAdamText.trim(),
  ].filter(Boolean);
  const journalEntry = journalEntryParts.length
    ? journalEntryParts.join(' ')
    : 'Today I took time to reflect on my day and what I need next.';
  const totalSteps = 4;
  const progressPercent: `${number}%` = `${(completedSteps / totalSteps) * 100}%`;
  const profileInitial = useMemo(() => {
    const value = nickname.trim();
    return value ? value.charAt(0).toUpperCase() : 'U';
  }, [nickname]);

  const getMoodEmoji = () => {
    const moodMap: { [key: string]: string } = {
      excellent: '😊',
      neutral: '😐',
      awful: '😢',
    };
    return moodMap[selectedMood] || '😐';
  };

  const getTodayEntry = () => {
    const today = new Date().toDateString();
    return journalEntries.find((entry) => new Date(entry.timestamp).toDateString() === today);
  };

  const handleNext = () => {
    if (journalStep < totalSteps) {
      setCompletedSteps((prev) => Math.max(prev, journalStep));
      setJournalStep((prev) => prev + 1);
      return;
    }

    // Save journal entry to AppContext
    saveJournalEntry();
  };

  const saveJournalEntry = async () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = now.getFullYear().toString();

    const moodLabel =
      selectedMood === 'excellent' ? 'Excellent' : selectedMood === 'neutral' ? 'Neutral' : 'Awful';

    const title = mainThingText.trim() || 'Daily Reflection';
    const entryData = {
      title,
      content: journalEntry,
      mainThing: mainThingText,
      feeling: feelingText,
      needFromAdam: needFromAdamText,
      mood: moodLabel,
      moodEmoji: getMoodEmoji(),
      day,
      month,
      year,
    };

    try {
      const existingEntry = getTodayEntry();

      if (existingEntry && (todayEntryId || existingEntry.id)) {
        // Update existing entry if editing today's journal
        await updateJournalEntry(existingEntry.id, entryData);
      } else {
        // Create new entry
        await addJournalEntry(entryData);
        setTodayEntryId(existingEntry?.id || null);
      }

      setCompletedSteps(totalSteps);
      setJournalCompleted(true);

      // Persist mood to backend
      const moodMap = {
        excellent: { level: 'great' as const, intensity: 5 },
        neutral: { level: 'okay' as const, intensity: 3 },
        awful: { level: 'bad' as const, intensity: 1 },
      };
      const moodData = moodMap[selectedMood as keyof typeof moodMap] || moodMap.neutral;
      try {
        await addMoodEntry({
          level: moodData.level,
          intensity: moodData.intensity,
          note: mainThingText.trim() || undefined,
          triggers: [],
        });
      } catch (moodErr) {
        console.warn('Mood save failed (non-blocking):', moodErr);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleEdit = () => {
    setJournalCompleted(false);
    setJournalStep(totalSteps);
  };

  const handleBack = () => {
    if (journalStep > 1) {
      setCompletedSteps((prev) => Math.max(0, prev - 1));
      setJournalStep((prev) => prev - 1);
    }
  };

  const handleStartChat = () => {
    navigation.navigate('Chat');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.profileIcon}>
          <Text style={styles.profileInitial}>{profileInitial}</Text>
        </TouchableOpacity>

        <View style={styles.notificationContainer}>
          <View style={styles.notificationIcon}>
            <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
              <Path
                d="M22.5533 24.9642V25.9571C22.5533 27.6022 21.2197 28.9358 19.5746 28.9358C17.9295 28.9358 16.5959 27.6022 16.5959 25.9571V24.9642M22.5533 24.9642H16.5959M22.5533 24.9642H26.1184C26.4982 24.9642 26.689 24.9642 26.8428 24.9123C27.1366 24.8132 27.3664 24.5826 27.4655 24.2888C27.5176 24.1344 27.5176 23.943 27.5176 23.5602C27.5176 23.3926 27.5174 23.3089 27.5043 23.229C27.4795 23.0781 27.421 22.935 27.3318 22.8108C27.2846 22.7451 27.2247 22.6852 27.1066 22.5671L26.7199 22.1804C26.5951 22.0556 26.525 21.8863 26.525 21.7098V18.0138C26.525 14.1753 23.4132 11.0635 19.5746 11.0635C15.736 11.0635 12.6243 14.1753 12.6243 18.0138V21.7099C12.6243 21.8863 12.554 22.0556 12.4292 22.1804L12.0425 22.5671C11.924 22.6856 11.8647 22.7451 11.8175 22.8108C11.7283 22.9351 11.6692 23.0781 11.6445 23.229C11.6313 23.3089 11.6313 23.3926 11.6313 23.5602C11.6313 23.943 11.6313 24.1344 11.6834 24.2888C11.7825 24.5825 12.0134 24.8132 12.3072 24.9123C12.461 24.9642 12.6511 24.9642 13.0309 24.9642H16.5959"
                stroke="#302F2F"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Rect x={23} y={8} width={12} height={12} rx={6} fill="#7857E1" />
              <Path
                d="M28.96 17V12.665H28.3L28.5475 11.75H29.875V17H28.96Z"
                fill="white"
              />
            </Svg>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.greetingText}>Hi {nickname}</Text>
        <Text style={styles.encouragementText}>Take a deep breath. You're doing great today.</Text>

        {/* Journal Card */}
        <View style={styles.journalCard}>
          {journalCompleted ? (
            <>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>Journal Completed</Text>
                    <Image
                      source={require('../assets/Completed.png')}
                      style={styles.journalCardIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardSubtitle}>
                    Well done for taking this important step. Today you shared:
                  </Text>
                </View>
              </View>

              <View style={styles.entryContainer}>
                <Text style={styles.entryText}>{journalEntry}</Text>
              </View>

              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>How was your day?</Text>
                    <Image
                      source={require('../assets/Journal.png')}
                      style={styles.journalCardIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardSubtitle}>
                    Taking a moment to write down your thoughts helps Adam understand you better
                    before you chat.
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: progressPercent }]} />
              </View>

              {journalStep === 1 && (
                <>
                  <Text style={styles.moodQuestion}>How are you feeling today?</Text>

                  <View style={styles.moodContainer}>
                    {moodOptions.map((option) => (
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
                </>
              )}

              {journalStep === 2 && (
                <>
                  <Text style={styles.journalQuestionText}>
                    Tell me the story - what's the main thing that happened today? (Even if it's
                    small).
                  </Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. I had a long day at college..."
                      placeholderTextColor="#7857e166"
                      value={mainThingText}
                      onChangeText={setMainThingText}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </>
              )}

              {journalStep === 3 && (
                <>
                  <Text style={styles.journalQuestionText}>
                    How is that making you feel inside?
                  </Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. It's sitting heavy and I feel drained..."
                      placeholderTextColor="#7857e166"
                      value={feelingText}
                      onChangeText={setFeelingText}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </>
              )}

              {journalStep === 4 && (
                <>
                  <Text style={styles.journalQuestionText}>
                    How can I best support you with this right now?
                  </Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Just listen to me...."
                      placeholderTextColor="#7857e166"
                      value={needFromAdamText}
                      onChangeText={setNeedFromAdamText}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </>
              )}

              <View style={styles.actionRow}>
                {journalStep > 1 && (
                  <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>
                    {journalStep === totalSteps ? 'Finish' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {journalCompleted ? (
          <TouchableOpacity style={styles.adamCard} onPress={handleStartChat}>
            <View style={[styles.adamCardContent, styles.adamCardUnlockedContent]}>
              <Text style={styles.adamTitle}>Talk to Adam</Text>
              <Text style={styles.adamDescription}>
                You recently discussed [Last Topic] in your journal. Feel like diving deeper? Adam
                is ready.
              </Text>
              <View style={styles.startChatBadge}>
                <Text style={styles.startChatText}>Start Chat</Text>
              </View>
            </View>
            <View style={styles.adamImagePlaceholder}>
              <Image
                source={require('../assets/Lock_chat.png')}
                style={styles.bearImage2}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.adamCard, styles.adamCardLocked]}>
            <View style={[styles.adamCardContent, styles.adamCardLockedContent]}>
              <Text style={styles.adamTitle}>Adam is ready when you are.</Text>
              <Text style={styles.adamDescription}>
                Once you finish today's journaling, Step 2 will unlock. Adam is waiting to hear how
                your day went!
              </Text>
              <View style={styles.unlockBadge}>
                <Text style={styles.unlockText}>Unlock after Journaling</Text>
              </View>
            </View>
            <View style={styles.adamImagePlaceholder}>
              <Image
                source={require('../assets/Unlock_chat.png')}
                style={styles.bearImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
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
    marginBottom: 10,
  },
  profileIconInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  profileInitial: {
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '700',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
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

  cationBadge: {
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
    fontSize: 32,
    fontFamily: 'Urbanist-Medium',
    color: colors.textSecondary,
    fontWeight: '100',
    marginTop: -2,
    letterSpacing: -0.2,
  },
  encouragementText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    marginBottom: 30,
    letterSpacing: -0.1,
  },
  journalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
    display: 'flex',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 8,
    alignItems: 'flex-start',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    fontWeight: '600',
    letterSpacing: -0.7,
    flexShrink: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  cardSubtitle: {
    fontSize: 12,
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
  journalCardIcon: {
    width: 36,
    height: 36,
    marginLeft: 6,
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
    width: 0,
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  entryContainer: {
    height: 150,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  entryText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.primary,
    lineHeight: 16,
  },
  editButton: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
  },
  completionBanner: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.4)',
    padding: 12,
    marginBottom: 10,
  },
  completionText: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
  },
  journalQuestionText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 20,
  },
  textInputContainer: {
    height: 120,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 12,
    paddingTop:3,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    flex: 1,
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
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.white,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  backButton: {
    height: 44,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
  },
  adamCard: {
    backgroundColor: colors.primary,
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 20,
  },
  adamCardLocked: {
    alignItems: 'flex-start',
  },
  adamCardUnlocked: {
    backgroundColor: colors.primary,
  },
  startChatBadge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  adamCardContent: {
    flex: 1,
  },
  adamCardUnlockedContent: {
    alignItems: 'flex-start',
  },
  adamCardLockedContent: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unlockBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  unlockText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  startChatText: {
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
    width: 77.37,
    height: 154.75,
    marginLeft: 50,
  },
  bearImage2: {
    width: 164,
    height: 185,
    marginRight: 16,
    marginBottom: 25.5,
  },
});

export default HomeScreen;
