import React from 'react';
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

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />
      <View style={styles.content}>
        {/* Logo Section */}
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
          {/* Login Title */}
          <Text style={styles.loginTitle}>Login</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#7857e166"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Image
              source={require('../assets/google_icon.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>
              Don't have an account? <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold',}}>
               Sign up
            </Text>
            </Text>
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
    width: 300,
    height: 300,
    marginTop: 18,
    marginBottom: 10,
  },
  formGroup: {
    width: '100%',
    marginBottom: 6,
  },
  logoText: {
    fontSize: 34,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: 'bold',
  },
  taglineText: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 6,
  },
  loginTitle: {
    fontWeight:'bold',
    fontSize: 22,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#ede6fb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7857e1',
    height: 44,
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
    backgroundColor: '#7857e1',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#ffffff',
    fontWeight: '600',
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
    paddingVertical: 0,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  signupText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;