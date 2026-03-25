import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';

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
  const { user, addJournalEntry, updateJournalEntry, journalEntries } = useApp();
  const [selectedMood, setSelectedMood] = useState<string>('excellent');
  const [journalStep, setJournalStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [journalCompleted, setJournalCompleted] = useState<boolean>(false);
  const [mainThingText, setMainThingText] = useState<string>('');
  const [needFromAdamText, setNeedFromAdamText] = useState<string>('');
  const [todayEntryId, setTodayEntryId] = useState<string | null>(null);
  const nickname = route.params?.nickname || user?.name || 'Sudhir';
  const journalEntry =
    mainThingText.trim() || needFromAdamText.trim()
      ? `${mainThingText.trim()} ${needFromAdamText.trim()}`.trim()
      : 'Today I took time to reflect on my day and what I need next.';
  const totalSteps = 3;
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
    return journalEntries.find(entry => new Date(entry.timestamp).toDateString() === today);
  };

  const handleNext = () => {
    if (journalStep < totalSteps) {
      setCompletedSteps(prev => Math.max(prev, journalStep));
      setJournalStep(prev => prev + 1);
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
      selectedMood === 'excellent' ? 'Excellent' : 
      selectedMood === 'neutral' ? 'Neutral' : 
      'Awful';

    const title = mainThingText.trim() || 'Daily Reflection';
    const entryData = {
      title,
      content: journalEntry,
      mainThing: mainThingText,
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
      setCompletedSteps(prev => Math.max(0, prev - 1));
      setJournalStep(prev => prev - 1);
    }
  };

  const handleStartChat = () => {
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>{profileInitial}</Text>
        </View>

        <View style={styles.notificationContainer}>
          <Image
            source={require('../assets/Notification.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.greetingText}>Hi {nickname}</Text>
        <Text style={styles.encouragementText}>
          Take a deep breath. You're doing great today.
        </Text>

        {/* Journal Card */}
        <View style={styles.journalCard}>
          {journalCompleted ? (
            <>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>Journal Completed</Text>
                  <Text style={styles.cardSubtitle}>
                    Well done for taking this important step. Today you shared:
                  </Text>
                </View>
                <Image
                  source={require('../assets/Completed.png')}
                  style={styles.journalCardIcon}
                  resizeMode="contain"
                />
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
                <View>
                  <Text style={styles.cardTitle}>How was your day?</Text>
                  <Text style={styles.cardSubtitle}>
                    Taking a moment to write down your thoughts helps Adam understand
                    you better before you chat.
                  </Text>
                </View>
                <Image
                  source={require('../assets/Journal.png')}
                  style={styles.journalCardIcon}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: progressPercent }]} />
              </View>

              {journalStep === 1 && (
                <>
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
                </>
              )}

              {journalStep === 2 && (
                <>
                  <Text style={styles.journalQuestionText}>
                    What's the main thing that happened today? (Even if it's just
                    something small).
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
                    What do you need most from Adam right now?
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
            <View style={styles.adamCardContent}>
              <View style={styles.startChatBadge}>
                <Text style={styles.startChatText}>Start Chat</Text>
              </View>
              <Text style={styles.adamTitle}>Talk to Adam</Text>
              <Text style={styles.adamDescription}>
                You recently discussed [Last Topic] in your journal. Feel like
                diving deeper? Adam is ready.
              </Text>
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
          <View style={styles.adamCard}>
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
    width: 30,
    height: 30,
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
  journalCardIcon: {
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
    padding: 14,
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
    fontFamily: 'Urbanist',
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
    marginBottom: 8,
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
    marginBottom:25.5,

  },
});

export default HomeScreen;