import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type OnboardingStep2RouteParams = {
  nickname?: string;
  birthday?: string;
  gender?: string;
  chatStyle?: string;
};

const OnboardingStep2: React.FC = () => {
  const [occupation, setOccupation] = useState('');
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null);
  const [habit, setHabit] = useState('');
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    navigation.navigate('OnboardingStep3', {
      nickname: undefined,
      birthday: undefined,
      gender: undefined,
      chatStyle: undefined,
      occupation,
      sleepTime: sleepTime ? formatTime(sleepTime) : '',
      wakeUpTime: wakeUpTime ? formatTime(wakeUpTime) : '',
      habit,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const handleSleepChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowSleepPicker(false);
      return;
    }

    const nextTime = selectedDate || sleepTime || new Date();
    setSleepTime(nextTime);

    if (Platform.OS !== 'ios') {
      setShowSleepPicker(false);
    }
  };

  const handleWakeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowWakePicker(false);
      return;
    }

    const nextTime = selectedDate || wakeUpTime || new Date();
    setWakeUpTime(nextTime);

    if (Platform.OS !== 'ios') {
      setShowWakePicker(false);
    }
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
              <View style={styles.timeInputIcon}>
                <Svg width={25} height={18} viewBox="0 0 25 18" fill="none">
                  <Path
                    d="M6.81818 9.6C7.49244 9.6 8.15155 9.38886 8.71217 8.99329C9.27279 8.59772 9.70975 8.03547 9.96777 7.37766C10.2258 6.71985 10.2933 5.99601 10.1618 5.29768C10.0302 4.59934 9.70554 3.95789 9.22877 3.45442C8.752 2.95095 8.14456 2.60808 7.48326 2.46917C6.82196 2.33027 6.13651 2.40156 5.51358 2.67403C4.89065 2.94651 4.35822 3.40793 3.98363 3.99995C3.60903 4.59196 3.40909 5.28799 3.40909 6C3.40909 6.95478 3.76826 7.87045 4.40759 8.54559C5.04692 9.22072 5.91403 9.6 6.81818 9.6ZM6.81818 4.8C7.04293 4.8 7.26264 4.87038 7.44951 5.00224C7.63639 5.13409 7.78204 5.32151 7.86804 5.54078C7.95405 5.76005 7.97656 6.00133 7.93271 6.23411C7.88886 6.46689 7.78064 6.68071 7.62171 6.84853C7.46279 7.01635 7.26031 7.13064 7.03988 7.17694C6.81944 7.22325 6.59096 7.19948 6.38331 7.10866C6.17567 7.01783 5.9982 6.86402 5.87333 6.66669C5.74846 6.46935 5.68182 6.23734 5.68182 6C5.68182 5.68174 5.80154 5.37652 6.01465 5.15147C6.22776 4.92643 6.5168 4.8 6.81818 4.8ZM21.5909 2.4H12.5C12.1986 2.4 11.9096 2.52643 11.6965 2.75147C11.4834 2.97652 11.3636 3.28174 11.3636 3.6V10.8H2.27273V1.2C2.27273 0.88174 2.153 0.576516 1.93989 0.351472C1.72678 0.126428 1.43775 0 1.13636 0C0.834981 0 0.545943 0.126428 0.332833 0.351472C0.119724 0.576516 0 0.88174 0 1.2V16.8C0 17.1183 0.119724 17.4235 0.332833 17.6485C0.545943 17.8736 0.834981 18 1.13636 18C1.43775 18 1.72678 17.8736 1.93989 17.6485C2.153 17.4235 2.27273 17.1183 2.27273 16.8V13.2H22.7273V16.8C22.7273 17.1183 22.847 17.4235 23.0601 17.6485C23.2732 17.8736 23.5623 18 23.8636 18C24.165 18 24.4541 17.8736 24.6672 17.6485C24.8803 17.4235 25 17.1183 25 16.8V6C25 5.04522 24.6408 4.12955 24.0015 3.45442C23.3622 2.77928 22.4951 2.4 21.5909 2.4ZM22.7273 10.8H13.6364V4.8H21.5909C21.8923 4.8 22.1813 4.92643 22.3944 5.15147C22.6075 5.37652 22.7273 5.68174 22.7273 6V10.8Z"
                    fill="#7857E1"
                    fillOpacity={0.4}
                  />
                </Svg>
              </View>
              <TouchableOpacity
                style={styles.timeInputButton}
                onPress={() => {
                  setShowSleepPicker(true);
                  setShowWakePicker(false);
                }}
              >
                <Text style={[styles.timeInput, !sleepTime && styles.timePlaceholder]}>
                  {sleepTime ? formatTime(sleepTime) : 'Sleep Time'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Wake Up Time */}
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputIcon}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 7V12H17M21.0036 4.57115L17.9395 2M6.06418 2L3 4.57115M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"
                    stroke="#7857E1"
                    strokeOpacity={0.4}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <TouchableOpacity
                style={styles.timeInputButton}
                onPress={() => {
                  setShowWakePicker(true);
                  setShowSleepPicker(false);
                }}
              >
                <Text style={[styles.timeInput, !wakeUpTime && styles.timePlaceholder]}>
                  {wakeUpTime ? formatTime(wakeUpTime) : 'Wake Up Time'}
                </Text>
              </TouchableOpacity>
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

      {/* Sleep Time Picker Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showSleepPicker}
        onRequestClose={() => setShowSleepPicker(false)}
      >
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerContent}>
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={() => setShowSleepPicker(false)}>
                <Text style={styles.timePickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>Sleep Time</Text>
              <TouchableOpacity onPress={() => setShowSleepPicker(false)}>
                <Text style={styles.timePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={sleepTime || new Date()}
              onChange={handleSleepChange}
              mode="time"
              display="spinner"
              style={styles.timePicker}
              textColor={Platform.OS === 'ios' ? '#7857e1' : undefined}
            />
          </View>
        </View>
      </Modal>

      {/* Wake Time Picker Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showWakePicker}
        onRequestClose={() => setShowWakePicker(false)}
      >
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerContent}>
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={() => setShowWakePicker(false)}>
                <Text style={styles.timePickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>Wake Up Time</Text>
              <TouchableOpacity onPress={() => setShowWakePicker(false)}>
                <Text style={styles.timePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={wakeUpTime || new Date()}
              onChange={handleWakeChange}
              mode="time"
              display="spinner"
              style={styles.timePicker}
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
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    width: '48%',
    height: 50,
    backgroundColor: '#e9e2f4',
    borderWidth: 1,
    borderColor: '#7857e1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  timeInput: {
    paddingLeft: 1,
    paddingTop: 14,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  timePlaceholder: {
    color: '#b6a7d8',
    fontSize: 15,
    letterSpacing: -0.5,
    marginLeft: 0,
  },
  timeInputIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInputButton: {
    flex: 1,
    marginLeft: 5,
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
  timePickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timePickerContent: {
    backgroundColor: '#f3eded',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 12,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ddf6',
  },
  timePickerTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
  },
  timePickerCancel: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#b6a7d8',
  },
  timePickerDone: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '600',
  },
  timePicker: {
    backgroundColor: '#f3eded',
  },
});

export default OnboardingStep2;
