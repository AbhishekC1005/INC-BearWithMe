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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../src/services/firebaseConfig';
import { apiPost } from '../src/services/api';
import { useApp } from '../src/contexts/AppContext';

// Complete any in-progress auth sessions on app start
WebBrowser.maybeCompleteAuthSession();

// ── Replace with your real Web Client ID from Firebase Console ──
// Firebase Console → Authentication → Sign-in method → Google → Web client ID
const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { setUser } = useApp();

  // Google OAuth via expo-auth-session (useIdTokenAuthRequest only needs web client ID)
  const [_request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
  });

  // Handle Google auth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleCredential(id_token);
    }
  }, [response]);

  const handleGoogleCredential = async (idToken: string) => {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const cred = await signInWithCredential(auth, credential);
      const firebaseUser = cred.user;

      // Create user on backend
      try {
        await apiPost('/api/users', {
          name: firebaseUser.displayName || firebaseUser.email || 'User',
          email: firebaseUser.email,
          firebase_uid: firebaseUser.uid,
        });
      } catch {
        // User might already exist
      }

      // Navigate to onboarding (new Google user)
      navigation.navigate('OnboardingStep1');
    } catch (error: any) {
      Alert.alert('Google Sign-In failed', error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase account
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = cred.user;

      // 2. Create user on backend
      try {
        await apiPost('/api/users', {
          name: firebaseUser.email || 'User',
          email: firebaseUser.email,
          firebase_uid: firebaseUser.uid,
        });
      } catch {
        // okay if it fails — will be created later
      }

      // 3. Navigate to onboarding
      navigation.navigate('OnboardingStep1');
    } catch (error: any) {
      let msg = 'Something went wrong. Please try again.';
      if (error?.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
      else if (error?.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (error?.code === 'auth/weak-password') msg = 'Password is too weak. Use at least 6 characters.';
      Alert.alert('Sign up failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#b4a8d6"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.continueButton, loading && { opacity: 0.7 }]}
                onPress={handleContinue}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                // @ts-ignore – useProxy is deprecated in types but still works at runtime
                onPress={() => promptAsync({ useProxy: true })}
                disabled={loading}
              >
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
