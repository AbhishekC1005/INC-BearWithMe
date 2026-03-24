import React from 'react';
import {
  View,
  Text,
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

const JournalCompletedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const journalEntry =
    'The complex project I\'m leading felt like an impossible mountain this morning, and I was honestly starting to panic, feeling really stuck and overwhelmed by all the moving pieces. After taking a short coffee break, I tried a new approach: meticulously listing every single tiny step required. A coworker noticed my list and suggested a different software tool for.....';

  const handleEdit = () => {
    navigation.navigate('JournalWriting');
  };

  const handleStartChat = () => {
    navigation.navigate('MainTabs', { screen: 'Chat' });
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

        {/* Journal Completed Card */}
        <View style={styles.journalCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Journal Completed</Text>
              <Text style={styles.cardSubtitle}>
                Well done for taking this important step. Today you shared:
              </Text>
            </View>
            <Image
              source={require('../assets/Completed.png')}
              style={styles.checkmarkIcon}
              resizeMode="contain"
            />
          </View>

          {/* Journal Entry */}
          <View style={styles.entryContainer}>
            <Text style={styles.entryText}>{journalEntry}</Text>
          </View>

          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Adam Card (Unlocked) */}
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
              style={styles.bearImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
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
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    opacity: 0.6,
    marginTop: 4,
    maxWidth: 220,
  },
  checkmarkIcon: {
    width: 36,
    height: 36,
  },
  checkmarkCircle: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    borderWidth: 3,
    borderColor: colors.primary,
    position: 'absolute',
  },
  checkmarkLine1: {
    width: 8,
    height: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 17,
    left: 6,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkLine2: {
    width: 14,
    height: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 14,
    left: 11,
    transform: [{ rotate: '-45deg' }],
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
    marginBottom:32.5,

  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 402,
    height: 84,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
    width: 59,
    height: 64,
  },
  navIconContainer: {
    width: 39,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconContainerActive: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
  },
  navIconActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  navIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  navLabelActive: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.primary,
    marginTop: 4,
  },
  navLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    marginTop: 4,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 402,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicatorBar: {
    width: 139,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 100,
  },
});

export default JournalCompletedScreen;