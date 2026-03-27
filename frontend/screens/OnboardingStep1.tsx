import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Svg, Path, Rect, Line } from 'react-native-svg';

const OnboardingStep1: React.FC = () => {
  const genderOptions = ['Male', 'Female', 'Other'];
  const chatStyleOptions = [
    'Listen and Support Me',
    'Help me solve this',
    'Challenge my thinking',
    'Keep me calm',
    'Be direct',
  ];

  const [nickname, setNickname] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState('');
  const [chatStyle, setChatStyle] = useState('');
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showChatStyleOptions, setShowChatStyleOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation<any>();

  const handleContinue = () => {
    navigation.navigate('OnboardingStep2', {
      nickname,
      birthday: birthday ? birthday.toISOString().split('T')[0] : '',
      gender,
      chatStyle,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Your birthday!';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const nextDate = selectedDate || birthday || new Date();
    setBirthday(nextDate);

    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
  };

  const DropdownIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 9L12 16L5 9"
        stroke="#7857E1"
        strokeWidth={2}
        strokeOpacity={0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const CalendarIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="3"
        stroke="#7857E1"
        strokeOpacity={0.4}
        strokeWidth={2}
      />
      <Line
        x1="8"
        y1="2.5"
        x2="8"
        y2="6"
        stroke="#7857E1"
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line
        x1="16"
        y1="2.5"
        x2="16"
        y2="6"
        stroke="#7857E1"
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="#7857E1"
        strokeOpacity={0.4}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row (Back + Step Text) */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={require('../assets/Arrow_Left_LG.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Tell Adam your name and how you'd like to chat. It helps him feel like a real friend.
        </Text>

        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Nickname */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What should I call you ?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your Nickname"
                placeholderTextColor="#7857e166"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>
          </View>

          {/* Birthday */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What's your birth date?</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setShowDatePicker(true);
                setShowGenderOptions(false);
                setShowChatStyleOptions(false);
              }}
            >
              <Text style={[styles.input, !birthday && styles.placeholder]}>
                {formatDate(birthday)}
              </Text>
              <View style={styles.inputIcon}>
                <CalendarIcon />
              </View>
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setShowGenderOptions(!showGenderOptions);
                setShowChatStyleOptions(false);
              }}
            >
              <Text style={[styles.input, !gender && styles.placeholder]}>
                {gender || 'Select your gender'}
              </Text>
              <View style={styles.inputIcon}>
                <DropdownIcon />
              </View>
            </TouchableOpacity>

            {showGenderOptions && (
              <View style={styles.dropdownOptionsContainer}>
                <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setGender(option);
                        setShowGenderOptions(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Chat Style */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>How should I talk to you ?</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setShowChatStyleOptions(!showChatStyleOptions);
                setShowGenderOptions(false);
              }}
            >
              <Text style={[styles.input, !chatStyle && styles.placeholder]}>
                {chatStyle || 'Select a type'}
              </Text>
              <View style={styles.inputIcon}>
                <DropdownIcon />
              </View>
            </TouchableOpacity>

            {showChatStyleOptions && (
              <View style={styles.dropdownOptionsContainer}>
                <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                  {chatStyleOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setChatStyle(option);
                        setShowChatStyleOptions(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Continue */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerContent}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={birthday || new Date()}
              onChange={handleDateChange}
              mode="date"
              maximumDate={new Date()}
              display="spinner"
              style={styles.datePicker}
              textColor={Platform.OS === 'ios' ? '#7857e1' : undefined}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3eded',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* 🔥 NEW HEADER ROW */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },

  backIcon: {
    marginTop: 22,
    width: 24,
    height: 24,
    marginBottom: 15,
  },

  stepText: {
    marginLeft: 100,
    marginTop: 22,
    fontSize: 22,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
    marginBottom: 15,
  },

  progressBarContainer: {
    height: 6,
    backgroundColor: '#e6ddf6',
    borderRadius: 6,
    marginBottom: 18,
  },
  progressBarFill: {
    width: '33%',
    height: 6,
    backgroundColor: '#7857e1',
    borderRadius: 6,
  },

  description: {
    fontSize: 24,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    marginBottom: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
  },

  inputsContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginBottom: 8,
  },

  inputContainer: {
    height: 48,
    backgroundColor: '#e9e2f4',
    borderWidth: 1,
    borderColor: '#7857e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },

  placeholder: {
    color: '#b6a7d8',
  },

  inputIcon: {
    marginLeft: 8,
  },

  dropdownOptionsContainer: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d9cfee',
    maxHeight: 200,
    padding: 8,
  },

  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0eff5',
  },

  dropdownOptionText: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#4f3f77',
    lineHeight: 20,
  },

  continueButton: {
    height: 48,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
    fontWeight: '100',
  },

  /* Date Picker Styles */
  datePickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  datePickerContent: {
    backgroundColor: '#f3eded',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 12,
  },

  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ddf6',
  },

  datePickerTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
  },

  datePickerCancel: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#b6a7d8',
  },

  datePickerDone: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
  },

  datePicker: {
    backgroundColor: '#f3eded',
  },
});

export default OnboardingStep1;
