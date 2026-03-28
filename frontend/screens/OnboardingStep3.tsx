import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';
import { apiPatch } from '../src/services/api';

interface Option {
  id: string;
  label: string;
  selected: boolean;
}

const OnboardingStep3: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { setIsOnboarded, refreshFromAPI } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState<Option[]>([
    { id: 'academic', label: 'Academic Pressure', selected: true },
    { id: 'social', label: 'Social Anxiety', selected: false },
    { id: 'family', label: 'Family Dynamics', selected: false },
    { id: 'career', label: 'Career Uncertainty', selected: false },
    { id: 'loneliness', label: 'Loneliness', selected: false },
    { id: 'relationships', label: 'Relationships', selected: false },
    { id: 'other', label: 'Other', selected: false },
  ]);

  const handleToggle = (id: string) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  };

  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const selectedStressors = options
      .filter(o => o.selected)
      .map(o => o.label);

    // Collect all onboarding data from Steps 1 + 2 + 3
    const profileData: Record<string, any> = {};

    // Step 1 params
    if (route.params?.nickname) profileData.nickname = route.params.nickname;
    if (route.params?.birthday) profileData.birthday = route.params.birthday;
    if (route.params?.gender) profileData.gender = route.params.gender;
    if (route.params?.chatStyle) profileData.chat_style = route.params.chatStyle;

    // Step 2 params
    if (route.params?.occupation) profileData.occupation = route.params.occupation;
    if (route.params?.sleepTime) profileData.sleep_time = route.params.sleepTime;
    if (route.params?.wakeUpTime) profileData.wake_time = route.params.wakeUpTime;

    // Step 3 — stressors
    profileData.stressors = selectedStressors;

    // Mark onboarding complete on the backend too
    profileData.is_onboarded = true;

    try {
      await apiPatch('/api/users/me', profileData);
      await refreshFromAPI();
      await setIsOnboarded(true);
      navigation.navigate('OnboardingComplete');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      // Still allow proceeding — data can be re-synced later
      await setIsOnboarded(true);
      navigation.navigate('OnboardingComplete');
    } finally {
      setIsSaving(false);
    }
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
      
                <Text style={styles.stepText}>Step 3 of 3</Text>
              </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: '100%' }]} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        What usually brings you down? Telling Adam helps him understand your bad days.
      </Text>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              option.selected && styles.optionItemSelected,
            ]}
            onPress={() => handleToggle(option.id)}
          >
            <Text
              style={[
                styles.optionText,
                option.selected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
            <View
              style={[
                styles.checkbox,
                option.selected && styles.checkboxSelected,
              ]}
            >
              {option.selected && (
                <View style={styles.checkmark}>
                  <View style={styles.checkmarkLine1} />
                  <View style={styles.checkmarkLine2} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Finish Button */}
      <TouchableOpacity
        style={[styles.finishButton, isSaving && { opacity: 0.6 }]}
        onPress={handleFinish}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.finishButtonText}>Finish</Text>
        )}
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
  backButton: {
    width: 28,
    height: 28,
    marginTop: 12,
    marginBottom: 6,
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
    width: '75%',
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
  optionsContainer: {
    flex: 1,
  },
  optionItem: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8d1e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: '#e9e2f4',
    borderColor: '#7857e1',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7857e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7857e1',
    borderColor: '#7857e1',
  },
  checkmark: {
    marginTop:5,
    width: 10,
    height: 8,
  },
  checkmarkLine1: {
    width: 5,
    height: 2,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 2,
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkLine2: {
    width: 9,
    height: 2,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 2,
    transform: [{ rotate: '-45deg' }],
  },
  finishButton: {
    height: 48,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  finishButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default OnboardingStep3;