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

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BearWithMe</Text>
          <Text style={styles.taglineText}>Your Wiser Companion</Text>
        </View>

        <Image
          source={require('../assets/login_bear.png')}
          style={styles.bearImage}
          resizeMode="contain"
        />

        <View style={styles.formGroup}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#b4a8d6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image
              source={require('../assets/google_icon.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Have an account? <Text style={{fontFamily: "Urbanist-SemiBold" ,textDecorationLine: 'underline', fontWeight: 'normal', color: "#7857e1"}}>
          Login
          </Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3eded',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  bearImage: {
    width: 360,
    height: 360,
    marginTop: 18,
    marginBottom: 10,
  },
  formGroup: {
    width: '100%',
    marginBottom: 6,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: 'normal',
  },
  taglineText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 0,
  },
  title: {
    fontWeight:'normal',
    fontSize: 28,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    height: 48,
    backgroundColor: '#ede6fb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7857e1',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    padding: 0,
  },
  continueButton: {
    height: 48,
    backgroundColor: '#7857e1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
    fontWeight: '100',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#d8d1e6',
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#a59abf',
    marginHorizontal: 12,
  },
  googleButton: {
    height: 46,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7857e1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  loginLink: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#000000',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default SignUpScreen;
  
