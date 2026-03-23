import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Design tokens from Figma
const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#302f2f',
  textSecondary: '#7857e1',
  inputBackground: 'rgba(120, 87, 225, 0.12)',
  border: '#7857e1',
};

// Journal entry type
interface JournalEntry {
  id: string;
  day: string;
  month: string;
  title: string;
  date: Date;
}

const mockJournals: JournalEntry[] = [
  {
    id: '1',
    day: '12',
    month: 'MAR',
    title: 'Today I felt overwhelmed at college but managed to complete my tasks.',
    date: new Date(2024, 2, 12),
  },
  {
    id: '2',
    day: '11',
    month: 'MAR',
    title: 'I had a calm evening walk and it helped reduce my stress a lot.',
    date: new Date(2024, 2, 11),
  },
  {
    id: '3',
    day: '10',
    month: 'MAR',
    title: 'I argued with a friend, then reflected and resolved it respectfully.',
    date: new Date(2024, 2, 10),
  },
];

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry, onPress }: JournalCardProps) => {
  return (
    <TouchableOpacity style={styles.journalCard} onPress={onPress}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{entry.day}</Text>
        <Text style={styles.monthText}>{entry.month}</Text>
      </View>
      <Text style={styles.titleText} numberOfLines={2}>
        {entry.title}
      </Text>
      <View style={styles.chevron}>
        <View style={styles.chevronLine} />
        <View style={styles.chevronHead} />
      </View>
    </TouchableOpacity>
  );
};

const JournalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');

  const handleJournalPress = (entry: JournalEntry) => {
    navigation.navigate('JournalCompleted');
  };

  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <JournalCard entry={item} onPress={() => handleJournalPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Title */}
      <Text style={styles.headerTitle}>Journals</Text>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search "
            placeholderTextColor="rgba(120, 87, 225, 0.4)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Journal List */}
        <FlatList
          data={mockJournals}
          renderItem={renderJournalItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled
        />
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 44,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 49,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 4,
    height: 48,
    paddingHorizontal: 20,
  },
  searchIcon: {
    width: 26,
    height: 26,
    marginRight: 9,
  },
  searchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  searchHandle: {
    width: 8,
    height: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 2,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  journalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    marginBottom: 8,
    height: 70,
  },
  dateContainer: {
    width: 52,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayText: {
    fontSize: 28,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
    lineHeight: 30,
  },
  monthText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.white,
    marginTop: -2,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    paddingRight: 8,
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLine: {
    width: 2,
    height: 14,
    backgroundColor: colors.primary,
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  chevronHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: colors.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    right: 2,
    top: 7,
    transform: [{ rotate: '90deg' }],
  },
});

export default JournalsScreen;