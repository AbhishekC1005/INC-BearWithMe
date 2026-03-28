import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { auth } from '../src/services/firebaseConfig';
import { apiGet } from '../src/services/api';
import { useApp } from '../src/contexts/AppContext';

// Configure Google Sign-In with the Web Client ID (needed for Firebase)
GoogleSignin.configure({
  webClientId: '585485707727-flc0u1r1h7oldsq94r7pu94emalp2hvs.apps.googleusercontent.com',
});

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { refreshFromAPI } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * After Firebase auth succeeds, validate the user exists in our DB.
   * Retries up to 3 times with increasing delays to handle the race
   * condition where Firebase currentUser isn't set yet when the API
   * helper tries to read the token.
   */
  const validateUserExists = async (): Promise<{
    exists: boolean;
    is_onboarded: boolean;
  }> => {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Small increasing delay to let Firebase auth state settle
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 500 * attempt));
        }
        const check = await apiGet<{ exists: boolean; is_onboarded: boolean }>(
          '/api/users/check',
        );
        return check;
      } catch (err) {
        lastError = err;
        // If it's a 401, the token may not be ready yet — retry
        const errMsg = String(err);
        if (errMsg.includes('401') && attempt < maxRetries - 1) {
          continue;
        }
        // For other errors, don't retry
        break;
      }
    }
    // Re-throw so the caller can distinguish between
    // "user doesn't exist" and "API call failed"
    throw lastError;
  };

  /**
   * Sign out of both Firebase and Google (cleanup on validation failure).
   */
  const cleanupAuth = async () => {
    try {
      await GoogleSignin.signOut();
    } catch {}
    try {
      await firebaseSignOut(auth);
    } catch {}
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google');

      // Sign in to Firebase with the Google credential
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);

      // Validate user exists in our database
      let check: { exists: boolean; is_onboarded: boolean };
      try {
        check = await validateUserExists();
      } catch (apiErr) {
        // API call itself failed (network/server error) — NOT "user doesn't exist"
        Alert.alert(
          'Connection error',
          'Could not reach the server. Please check that the backend is running and try again.',
        );
        await cleanupAuth();
        return;
      }

      if (!check.exists) {
        // User not registered in our DB — block access
        await cleanupAuth();
        Alert.alert(
          'Account not found',
          'No account found with this Google account. Please register first.',
          [
            { text: 'OK' },
            {
              text: 'Go to Sign Up',
              onPress: () => navigation.navigate('SignUp'),
            },
          ],
        );
        return;
      }

      // User exists — check onboarding
      await refreshFromAPI();
      if (check.is_onboarded) {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'OnboardingStep1' }] });
      }
    } catch (error: any) {
      // Don't show alert if user cancelled the Google sign-in
      if (error?.code === 'SIGN_IN_CANCELLED') return;
      Alert.alert('Google Sign-In failed', error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // 2. Validate user exists in our database
      let check: { exists: boolean; is_onboarded: boolean };
      try {
        check = await validateUserExists();
      } catch (apiErr) {
        // API call itself failed (network/server error) — NOT "user doesn't exist"
        Alert.alert(
          'Connection error',
          'Could not reach the server. Please check that the backend is running and try again.',
        );
        return;
      }

      if (!check.exists) {
        // Firebase account exists but no DB record — block access
        await cleanupAuth();
        Alert.alert(
          'Account not found',
          'No account found. Please register first.',
          [
            { text: 'OK' },
            {
              text: 'Go to Sign Up',
              onPress: () => navigation.navigate('SignUp'),
            },
          ],
        );
        return;
      }

      // 3. User exists — sync data and navigate
      await refreshFromAPI();
      if (check.is_onboarded) {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'OnboardingStep1' }] });
      }
    } catch (error: any) {
      let msg = 'Something went wrong. Please try again.';
      if (error?.code === 'auth/user-not-found') msg = 'No account found with this email. Please register first.';
      else if (error?.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (error?.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (error?.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3eded" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#7857e166"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[styles.continueButton, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
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
                onPress={handleGoogleSignIn}
                disabled={loading}
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
                  Don't have an account?{' '}
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      textDecorationLine: 'underline',
                      fontWeight: 'normal',
                      color: '#7857e1',
                    }}
                  >
                    Sign up
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 40,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    fontWeight: '100',
  },
  taglineText: {
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: '#7857e1',
    marginTop: 0,
  },
  loginTitle: {
    fontWeight: 'normal',
    fontSize: 28,
    fontFamily: 'Urbanist-SemiBold',
    color: '#7857e1',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#ede6fb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7857e1',
    height: 48,
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
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
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
    height: 48,
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
    fontSize: 18,
    fontFamily: 'Urbanist-Medium',
    color: '#7857e1',
  },
  signupText: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;
