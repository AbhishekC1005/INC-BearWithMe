import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#302f2f',
  textSecondary: '#7857e1',
};

const JournalStep3Screen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [journalEntry, setJournalEntry] = useState('');

  const handleFinish = () => {
    navigation.navigate('JournalCompleted');
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
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
            <Image
              source={require('../assets/Journal.png')}
              style={styles.journalCardIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>

          <Text style={styles.questionText}>
            What do you need most from Adam right now?
          </Text>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Just listen to me...."
              placeholderTextColor="#7857e166"
              value={journalEntry}
              onChangeText={setJournalEntry}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>

        {/* Adam Card (Locked) */}
        <View style={styles.adamCard}>
          <View style={styles.adamCardContent}>
            <View style={styles.startChatBadge}>
              <Text style={styles.startChatText}>Unlock after Journaling</Text>
            </View>
            <Text style={styles.adamTitle}>Adam is ready when you are.</Text>
            <Text style={styles.adamDescription}>
              Once you finish today's journaling, Step 2 will unlock. Adam is
              waiting to hear how your day went!
            </Text>
          </View>
          <View style={styles.adamImagePlaceholder}>
            <Image
              source={require('../assets/Lock_chat.png')}
              style={styles.bearImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>

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
    paddingTop: 4,
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
  notificationIcon: {
    width: 30,
    height: 30,
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 30,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 8,
  },
  encouragementText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  journalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    maxWidth: 220,
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
    marginTop: 12,
    marginBottom: 16,
  },
  progressBarFill: {
    width: '25%',
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  textInputContainer: {
    height: 143,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    flex: 1,
  },
  finishButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
  },
  adamCard: {
    backgroundColor: colors.primary,
    borderRadius: 19,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adamCardContent: {
    flex: 1,
  },
  startChatBadge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  startChatText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  adamTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  adamDescription: {
    fontSize: 10,
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
    width: 184,
    height: 185,
    marginRight: 20,
    marginBottom: 32.5,
  },
});

export default JournalStep3Screen;