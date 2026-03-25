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

      <View style={styles.confettiBackground} pointerEvents="none">
        <Image
          source={require('../assets/Confetti.png')}
          style={styles.confettiImage}
          resizeMode="cover"
        />
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7857e1',
  },
  confettiBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    transform: [{ translateY: -40 }],
  },
  confettiImage: {
    width: '110%',
    height: '110%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  bearImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 46,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing:-1,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 15,
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
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: 'normal',
  },
});

export default OnboardingComplete;