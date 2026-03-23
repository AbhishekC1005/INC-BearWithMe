import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    navigation.navigate('OnboardingStep1');
  };

  const handleGoogleSignIn = () => {
    navigation.navigate('OnboardingStep1');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

      <View style={styles.heroPlaceholder} />

      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>BearWithMe</Text>
        <Text style={styles.taglineText}>Your Wiser Companion</Text>
      </View>

      <View style={styles.formGroup}>
        {/* Sign Up Title */}
        <Text style={styles.title}>Sign Up</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="rgba(120, 87, 225, 0.4)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <View style={styles.googleIcon}>
            <View style={styles.googleGContainer}>
              <View style={[styles.googleGSection, { backgroundColor: '#FBBB00' }]} />
              <View style={[styles.googleGSection, { backgroundColor: '#518EF8' }]} />
              <View style={[styles.googleGSection, { backgroundColor: '#28B446' }]} />
              <View style={[styles.googleGSection, { backgroundColor: '#F14336' }]} />
            </View>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}>Have an account? Login</Text>
        </TouchableOpacity>
      </View>
      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3eded',
  },
  heroPlaceholder: {
    position: 'absolute',
    top: 147,
    left: -181,
    width: 761,
    height: 358,
    borderRadius: 180,
    backgroundColor: 'rgba(120, 87, 225, 0.08)',
  },
  logoSection: {
    position: 'absolute',
    top: 71,
    left: 80,
    width: 242,
    height: 86,
    alignItems: 'center',
  },
  formGroup: {
    position: 'absolute',
    left: 16,
    top: 529,
    width: 370,
    height: 292,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: '700',
  },
  taglineText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    height: 48,
    backgroundColor: '#7857e11f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7857e1',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  continueButton: {
    height: 50,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    fontSize: 20,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: 'rgba(48, 47, 47, 0.39)',
    marginHorizontal: 12,
  },
  googleButton: {
    height: 50,
    backgroundColor: '#f3eded',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7857e1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 55,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleGContainer: {
    width: 21,
    height: 21,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  googleGSection: {
    width: 10,
    height: 10,
    borderRadius: 1,
    margin: 0.5,
  },
  googleButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 16,
    textAlign: 'center',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 402,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicatorBar: {
    width: 139,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 100,
  },
});

export default SignUpScreen;