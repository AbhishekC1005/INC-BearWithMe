import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/contexts/AppContext';

const OnboardingComplete: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useApp();

  const handleContinue = () => {
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: { nickname: user?.name },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7857e1" />

      {/* Confetti - Top */}
      <View style={styles.confettiContainerTop}>
        <View style={[styles.confetti, styles.confetti1]} />
        <View style={[styles.confetti, styles.confetti2]} />
        <View style={[styles.confetti, styles.confetti3]} />
        <View style={[styles.confetti, styles.confetti4]} />
        <View style={[styles.confetti, styles.confetti5]} />
        <View style={[styles.confetti, styles.confetti6]} />
        <View style={[styles.confetti, styles.confetti7]} />
        <View style={[styles.confetti, styles.confetti8]} />
        <View style={[styles.confetti, styles.confetti9]} />
        <View style={[styles.confetti, styles.confetti10]} />
      </View>

      {/* Success Content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/bear_thumb.png')}
          style={styles.bearImage}
          resizeMode="contain"
        />

        <Text style={styles.titleText}>You're all set!</Text>

        <Text style={styles.descriptionText}>
          Nice work completing your profile. Adam is ready and waiting to chat
          whenever you need a friend.
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Confetti - Bottom */}
      <View style={styles.confettiContainerBottom}>
        <View style={[styles.confetti, styles.confetti11]} />
        <View style={[styles.confetti, styles.confetti12]} />
        <View style={[styles.confetti, styles.confetti13]} />
        <View style={[styles.confetti, styles.confetti14]} />
        <View style={[styles.confetti, styles.confetti15]} />
        <View style={[styles.confetti, styles.confetti16]} />
        <View style={[styles.confetti, styles.confetti17]} />
        <View style={[styles.confetti, styles.confetti18]} />
        <View style={[styles.confetti, styles.confetti19]} />
        <View style={[styles.confetti, styles.confetti20]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7857e1',
  },
  confettiContainerTop: {
    position: 'absolute',
    top: 22,
    left: -56,
    right: -56,
    height: 536,
    overflow: 'hidden',
  },
  confettiContainerBottom: {
    position: 'absolute',
    bottom: 558,
    left: -56,
    right: -56,
    height: 536,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
  },
  confetti1: {
    width: 14,
    height: 18,
    backgroundColor: '#dd3c8c',
    top: 293,
    left: 100,
  },
  confetti2: {
    width: 30,
    height: 11,
    borderWidth: 2,
    borderColor: '#ee7c2b',
    top: 422,
    left: 250,
  },
  confetti3: {
    width: 17,
    height: 37,
    borderWidth: 2,
    borderColor: '#dd3c8c',
    top: 145,
    left: 200,
  },
  confetti4: {
    width: 47,
    height: 13,
    borderWidth: 2,
    borderColor: '#f2675a',
    top: 339,
    left: 120,
  },
  confetti5: {
    width: 20,
    height: 18,
    backgroundColor: '#f2675a',
    top: 25,
    left: 350,
  },
  confetti6: {
    width: 18,
    height: 19,
    backgroundColor: '#dd3c8c',
    top: 528,
    left: 279,
  },
  confetti7: {
    width: 20,
    height: 8,
    borderWidth: 2,
    borderColor: '#ffe14c',
    top: 261,
    left: 300,
  },
  confetti8: {
    width: 9,
    height: 26,
    borderWidth: 2,
    borderColor: '#dd3c8c',
    top: 170,
    left: 300,
  },
  confetti9: {
    width: 46,
    height: 20,
    borderWidth: 2,
    borderColor: '#ee7c2b',
    top: 173,
    left: 404,
  },
  confetti10: {
    width: 13,
    height: 44,
    borderWidth: 2,
    borderColor: '#ff6633',
    top: 28,
    left: 260,
  },
  confetti11: {
    width: 14,
    height: 18,
    backgroundColor: '#dd3c8c',
    top: 829,
    left: 97,
  },
  confetti12: {
    width: 30,
    height: 11,
    borderWidth: 2,
    borderColor: '#ee7c2b',
    top: 958,
    left: 300,
  },
  confetti13: {
    width: 17,
    height: 37,
    borderWidth: 2,
    borderColor: '#dd3c8c',
    top: 681,
    left: 200,
  },
  confetti14: {
    width: 47,
    height: 13,
    borderWidth: 2,
    borderColor: '#f2675a',
    top: 875,
    left: 120,
  },
  confetti15: {
    width: 20,
    height: 18,
    backgroundColor: '#f2675a',
    top: 561,
    left: 372,
  },
  confetti16: {
    width: 18,
    height: 19,
    backgroundColor: '#dd3c8c',
    top: 1064,
    left: 279,
  },
  confetti17: {
    width: 20,
    height: 8,
    borderWidth: 2,
    borderColor: '#ffe14c',
    top: 797,
    left: 403,
  },
  confetti18: {
    width: 9,
    height: 26,
    borderWidth: 2,
    borderColor: '#dd3c8c',
    top: 729,
    left: 232,
  },
  confetti19: {
    width: 46,
    height: 20,
    borderWidth: 2,
    borderColor: '#ee7c2b',
    top: 709,
    left: 404,
  },
  confetti20: {
    width: 13,
    height: 44,
    borderWidth: 2,
    borderColor: '#ff6633',
    top: 564,
    left: 260,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  bearImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 40,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  continueButton: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 28,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: 'bold',
  },
});

export default OnboardingComplete;