import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Option {
  id: string;
  label: string;
  selected: boolean;
}

const OnboardingStep3: React.FC = () => {
  const navigation = useNavigation<any>();
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

  const handleFinish = () => {
    navigation.navigate('OnboardingComplete');
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
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
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
    marginBottom: 47,
    lineHeight: 28,
  },
  optionsContainer: {
    flex: 1,
  },
  optionItem: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(120, 87, 225, 0.12)',
    borderWidth: 1,
    borderColor: '#7857e1',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  optionTextSelected: {
    fontWeight: '500',
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
    height: 50,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 23,
  },
  finishButtonText: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default OnboardingStep3;