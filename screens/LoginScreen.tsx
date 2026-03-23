import React from 'react';
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

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />

      <View style={styles.heroPlaceholder} />

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BearWithMe</Text>
          <Text style={styles.taglineText}>Your Wiser Companion</Text>
        </View>

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
            <View style={styles.googleIcon}>
              <View style={styles.googleIconInner} />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>
              Don't have an account? Sign up
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  heroPlaceholder: {
    position: 'absolute',
    top: 140,
    left: -120,
    right: -120,
    height: 330,
    borderRadius: 165,
    backgroundColor: 'rgba(120, 87, 225, 0.08)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  formGroup: {
    width: '100%',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    fontWeight: 'bold',
  },
  taglineText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 10,
  },
  loginTitle: {
    fontSize: 28,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    textAlign: 'center',
    marginBottom: 22,
  },
  inputContainer: {
    backgroundColor: '#7857e11f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7857e1',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    padding: 0,
  },
  continueButton: {
    backgroundColor: '#7857e1',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
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
    color: '#302f2f',
    opacity: 0.39,
    marginHorizontal: 12,
  },
  googleButton: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7857e1',
    paddingVertical: 0,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  googleIconInner: {
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  googleButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist',
    color: '#7857e1',
  },
  signupText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;