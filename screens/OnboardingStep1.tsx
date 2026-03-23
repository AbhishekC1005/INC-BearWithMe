import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingStep1: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [chatStyle, setChatStyle] = useState('');
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    navigation.navigate('OnboardingStep2');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View style={styles.arrowLeft}>
          <View style={styles.arrowLine} />
        </View>
      </TouchableOpacity>

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

        {/* Chat Style Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>How should I talk to you ?</Text>
          <TouchableOpacity style={styles.inputContainer}>
            <Text style={[styles.input, !chatStyle && styles.placeholder]}>
              {chatStyle || 'Select a type'}
            </Text>
            <View style={styles.chevron}>
              <View style={styles.chevronLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingHorizontal: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    marginTop: 60,
    marginBottom: 13,
  },
  arrowLeft: {
    width: 15,
    height: 10,
  },
  arrowLine: {
    width: 15,
    height: 2,
    backgroundColor: '#7857e1',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    top: 4,
    left: 0,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  stepText: {
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderRadius: 10,
    marginBottom: 24,
  },
  progressBarFill: {
    width: '33%',
    height: 8,
    backgroundColor: '#7857e1',
    borderRadius: 10,
  },
  description: {
    fontSize: 24,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginBottom: 46,
    lineHeight: 28,
  },
  inputsContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginBottom: 8,
  },
  inputContainer: {
    height: 48,
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
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
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  placeholder: {
    color: '#7857e1',
    opacity: 0.4,
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronLine: {
    width: 14,
    height: 2,
    backgroundColor: '#7857e1',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  continueButton: {
    height: 50,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 23,
  },
  continueButtonText: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default OnboardingStep1;