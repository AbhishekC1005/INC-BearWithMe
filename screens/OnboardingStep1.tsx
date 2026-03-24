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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';

const OnboardingStep1: React.FC = () => {
  const genderOptions = ['Male', 'Female', 'Other'];
  const chatStyleOptions = [
    'Listen & support me',
    'Help me solve this',
    'Challenge my thinking',
    'Keep me calm',
    'Be direct',
  ];

  const [nickname, setNickname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [chatStyle, setChatStyle] = useState('');
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showChatStyleOptions, setShowChatStyleOptions] = useState(false);
  const navigation = useNavigation<any>();
  const { setUser } = useApp();

  const handleContinue = () => {
    setUser({ name: nickname });
    navigation.navigate('OnboardingStep2', {
      nickname,
      birthday,
      gender,
      chatStyle,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require('../assets/Arrow_Left_LG.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
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

        {/* Input Fields */}
        <View style={styles.inputsContainer}>
          {/* Nickname Input */}
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

          {/* Birthday Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What's your birth date?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your birthday!"
                placeholderTextColor="#7857e166"
                value={birthday}
                onChangeText={setBirthday}
              />
            </View>
          </View>

          {/* Gender Dropdown */}
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
              <View style={styles.chevron}>
                <View style={styles.chevronLineLeft} />
                <View style={styles.chevronLineRight} />
              </View>
            </TouchableOpacity>
            {showGenderOptions && (
              <View style={styles.dropdownOptionsContainer}>
                {genderOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setGender(option);
                      setShowGenderOptions(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                    {index < genderOptions.length - 1 && (
                      <View style={styles.dropdownDivider} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Chat Style Dropdown */}
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
              <View style={styles.chevron}>
                <View style={styles.chevronLineLeft} />
                <View style={styles.chevronLineRight} />
              </View>
            </TouchableOpacity>
            {showChatStyleOptions && (
              <View style={styles.dropdownOptionsContainer}>
                {chatStyleOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setChatStyle(option);
                      setShowChatStyleOptions(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                    {index < chatStyleOptions.length - 1 && (
                      <View style={styles.dropdownDivider} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  backButton: {
    width: 28,
    height: 28,
    marginTop: 12,
    marginBottom: 6,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e6ddf6',
    borderRadius: 6,
    marginBottom: 18,
  },
  progressBarFill: {
    width: '18%',
    height: 6,
    backgroundColor: '#7857e1',
    borderRadius: 6,
  },
  description: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginBottom: 24,
    lineHeight: 26,
  },
  inputsContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  dropdownOptionsContainer: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d9cfee',
    overflow: 'hidden',
    shadowColor: '#2b1b4d',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionText: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#4f3f77',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#efe9fb',
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginBottom: 8,
  },
  inputContainer: {
    height: 44,
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
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLineLeft: {
    width: 10,
    height: 2,
    backgroundColor: '#7857e1',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 5,
  },
  chevronLineRight: {
    width: 10,
    height: 2,
    backgroundColor: '#7857e1',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    right: 5,
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
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default OnboardingStep1;