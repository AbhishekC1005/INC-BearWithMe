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
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';
import { JournalEntry } from '../src/types';

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

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onDelete: (id: string) => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry, onPress, onDelete }: JournalCardProps) => {
  const handleLongPress = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDelete(entry.id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.journalCard}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{entry.day}</Text>
        <Text style={styles.monthText}>{entry.month}</Text>
      </View>
      <Text style={styles.titleText} numberOfLines={2}>
        {entry.title}
      </Text>
      <Text style={styles.chevronText}>›</Text>
    </TouchableOpacity>
  );
};

const JournalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { journalEntries, deleteJournalEntry } = useApp();
  const [searchText, setSearchText] = useState('');

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleJournalPress = (entry: JournalEntry) => {
    navigation.navigate('JournalDetail', { id: entry.id });
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteJournalEntry(id);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      Alert.alert('Error', 'Failed to delete journal entry');
    }
  };

  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <JournalCard 
      entry={item} 
      onPress={() => handleJournalPress(item)}
      onDelete={handleDeleteEntry}
    />
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
          <Image
            source={require('../assets/Search_icon.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="rgba(120, 87, 225, 0.4)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Journal List */}
        <FlatList
          data={filteredEntries}
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
    fontFamily: 'Urbanist-Medium',
    color: colors.primary,
    fontWeight: '100',
    paddingHorizontal: 16,
    marginTop: 25,
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  journalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    height: 68,
  },
  dateContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
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
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    paddingRight: 8,
  },
  chevronText: {
    fontSize: 40,
    fontFamily: 'Urbanist',
    color: colors.primary,
    marginLeft: 4,
    height: 68,
    textAlignVertical: 'center',
  },
});

export default JournalsScreen;