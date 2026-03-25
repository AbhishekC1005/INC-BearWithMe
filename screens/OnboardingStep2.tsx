import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OnboardingStep2RouteParams = {
  nickname?: string;
  birthday?: string;
  gender?: string;
  chatStyle?: string;
};

const OnboardingStep2: React.FC = () => {
  const [occupation, setOccupation] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [habit, setHabit] = useState('');
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    navigation.navigate('OnboardingStep3', {
      nickname: undefined,
      birthday: undefined,
      gender: undefined,
      chatStyle: undefined,
      occupation,
      sleepTime,
      wakeUpTime,
      habit,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

       {/* Header Row (Back + Step Text) */}
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={handleBack}>
                  <Image
                    source={require('../assets/Arrow_Left_LG.png')}
                    style={styles.backIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
      
                <Text style={styles.stepText}>Step 2 of 3</Text>
              </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: '67%' }]} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Share your daily schedule. This helps Adam know when you might be busy or tired.
      </Text>

      {/* Input Fields */}
      <View style={styles.inputsContainer}>
        {/* Occupation Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>What's your primary occupation ?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your Nickname"
              placeholderTextColor="#7857e166"
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>
        </View>

        {/* Sleep Schedule */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter your sleep schedule</Text>
          <View style={styles.timeInputsRow}>
            {/* Sleep Time */}
            <View style={styles.timeInputContainer}>
              <View style={styles.moonIcon}>
                <View style={styles.moonBody} />
              </View>
              <TextInput
                style={styles.timeInput}
                placeholder="Sleep Time"
                placeholderTextColor="#7857e166"
                value={sleepTime}
                onChangeText={setSleepTime}
              />
            </View>
            {/* Wake Up Time */}
            <View style={styles.timeInputContainer}>
              <View style={styles.alarmIcon}>
                <View style={styles.alarmBell} />
              </View>
              <TextInput
                style={styles.timeInput}
                placeholder="Wake Up Time"
                placeholderTextColor="#7857e166"
                value={wakeUpTime}
                onChangeText={setWakeUpTime}
              />
            </View>
          </View>
        </View>

        {/* Habit Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>What's the one habit you value the most ?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="eg. Playing Badminton"
              placeholderTextColor="#7857e166"
              value={habit}
              onChangeText={setHabit}
            />
          </View>
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
    paddingHorizontal: 20,
  },
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
    width: '33.33%',
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
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    width: '48%',
    height: 48,
    backgroundColor: '#e9e2f4',
    borderWidth: 1,
    borderColor: '#7857e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  timeInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginLeft: 8,
  },
  moonIcon: {
    width: 25,
    height: 18,
  },
  moonBody: {
    width: 20,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#b6a7d8',
  },
  alarmIcon: {
    width: 24,
    height: 24,
  },
  alarmBell: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#b6a7d8',
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

export default OnboardingStep2;