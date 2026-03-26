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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { apiPost } from '../src/services/api';
import { useApp } from '../src/contexts/AppContext';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setUser, refreshFromAPI } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Firebase
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = cred.user;

      // 2. Upsert user on backend
      try {
        await apiPost('/api/users', {
          name: firebaseUser.displayName || firebaseUser.email || 'User',
          email: firebaseUser.email,
          firebase_uid: firebaseUser.uid,
        });
      } catch {
        // User might already exist — that's fine
      }

      // 3. Sync data from API
      await refreshFromAPI();

      // 4. Navigate to main app
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: any) {
      let msg = 'Something went wrong. Please try again.';
      if (error?.code === 'auth/user-not-found') msg = 'No account found with this email.';
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
            onPress={() => Alert.alert('Coming soon', 'Google sign-in will be available soon!')}
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
              Don't have an account? <Text style={{fontFamily: "Urbanist-SemiBold" ,textDecorationLine: 'underline', fontWeight:'normal', color: "#7857e1"}}>
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
    fontWeight:'normal',
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
    fontWeight: "normal",
    color: '#000000',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;