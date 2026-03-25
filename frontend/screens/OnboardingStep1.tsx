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
            </TouchableOpacity>

            {showGenderOptions && (
              <View style={styles.dropdownOptionsContainer}>
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
            </TouchableOpacity>

            {showChatStyleOptions && (
              <View style={styles.dropdownOptionsContainer}>
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
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Continue */}
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

  /* 🔥 NEW HEADER ROW */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },

  backIcon: {
    marginTop:22,
    width: 24,
    height: 24,
    marginBottom:15,
  },

  stepText: {
    marginLeft: 100,
    marginTop:22,
    fontSize: 22,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
    marginBottom:15,
  },

  progressBarContainer: {
    height: 6,
    backgroundColor: '#e6ddf6',
    borderRadius: 6,
    marginBottom: 18,
  },
  progressBarFill: {
    width: '2%',
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
    letterSpacing:-0.5,
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  input: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },

  placeholder: {
    color: '#b6a7d8',
  },

  dropdownOptionsContainer: {
    marginTop: 8,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d9cfee',
  },

  dropdownOption: {
    padding: 12,
  },

  dropdownOptionText: {
    fontSize: 15,
    height: 48,
    fontFamily: 'Urbanist',
    color: '#4f3f77',
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
});

export default OnboardingStep1;