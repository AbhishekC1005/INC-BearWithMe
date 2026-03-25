import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  lightGray: '#f0f0f0',
};

const JournalDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getJournalEntryById, updateJournalEntry } = useApp();
  
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStory, setEditedStory] = useState('');
  const [journalData, setJournalData] = useState<JournalEntry | null>(null);

  // Get journal ID from route params
  const journalId = route.params?.id;

  useEffect(() => {
    if (journalId) {
      const entry = getJournalEntryById(journalId);
      setJournalData(entry || null);
    }
  }, [journalId, getJournalEntryById]);

  const handleEditPress = () => {
    if (journalData) {
      setEditedStory(journalData.content);
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedStory('');
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (journalData && journalId) {
      await updateJournalEntry(journalId, { 
        content: editedStory,
        mainThing: editedStory.split('\n')[0] || editedStory,
      });
      setJournalData({ ...journalData, content: editedStory });
      setEditedStory('');
      setIsEditMode(false);
    }
  };

  const handleContinueChat = () => {
    // Navigate to chat screen
    navigation.navigate('Chat');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const generateTitleFromContent = (content: string) => {
    if (!content || content.trim() === '') {
      return 'Daily Reflection...';
    }
    const words = content.trim().split(/\s+/);
    const firstFiveWords = words.slice(0, 5).join(' ');
    return firstFiveWords + (words.length > 5 ? '...' : '');
  };

  if (!journalData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.dateHeader}>Journal</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading journal entry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.dateHeader}>
          {journalData.day} {journalData.month} {journalData.year}
        </Text>
        <TouchableOpacity onPress={handleEditPress}>
          <Image
            source={require('../assets/Edit_icon.png')}
            style={styles.editIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>{generateTitleFromContent(journalData.content)}</Text>

        {/* Mood Selector */}
        <View style={styles.moodContainer}>
          <View style={styles.moodBadge}>
            <Text style={styles.moodEmoji}>{journalData.moodEmoji}</Text>
            <Text style={styles.moodText}>{journalData.mood}</Text>
          </View>
        </View>

        {/* Your Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Story</Text>
          <Text style={styles.storyText}>{journalData.content}</Text>
        </View>

        {/* AI Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights ✨</Text>
          <View style={styles.adamCard}>
            <Text style={styles.adamInsightText}>
              Share your thoughts with Adam to get personalized insights. Start a chat to begin!
            </Text>
          </View>
        </View>

        {/* Continue Chat Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueChat}>
          <Text style={styles.continueButtonText}>Continue Chat</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={isEditMode} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.editContainer}>
            <Text style={styles.editTitle}>Edit Your Story</Text>
            
            <TextInput
              style={styles.editTextInput}
              multiline
              numberOfLines={10}
              placeholder="Edit your story..."
              placeholderTextColor="#999"
              value={editedStory}
              onChangeText={setEditedStory}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.background,
    height: 56,
  },
  backButton: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: '600',
    lineHeight: 36,
  },
  dateHeader: {
    marginTop:10,
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  editIcon: {
    marginTop:10,
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 40,
  },
  moodContainer: {
    marginBottom: 24,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 19,
    marginRight: 8,
  },
  moodText: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  storyText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  adamCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  adamInsightText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 32,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  editContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  editTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 16,
  },
  editTextInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    fontFamily: 'Urbanist',
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.white,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default JournalDetailScreen;
