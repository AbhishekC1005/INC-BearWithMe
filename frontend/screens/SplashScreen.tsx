import React from 'react';
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { apiGet } from '../src/services/api';
import type { RootStackParamList } from '../src/types';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SPLASH_BG = '#f3eded';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashNavigationProp>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const logoOpacity = React.useRef(new Animated.Value(1)).current;
  const transitionProgress = React.useRef(new Animated.Value(0)).current;
  const hasNavigated = React.useRef(false);

  const navigateWithTransition = React.useCallback(
    (screen: keyof RootStackParamList) => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(transitionProgress, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => {
        navigation.replace(screen as any);
      });
    },
    [logoOpacity, navigation, transitionProgress],
  );

  React.useEffect(() => {
    // Wait a moment for the splash visual, then check auth state
    const timer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          // No Firebase session → go to Login
          navigateWithTransition('Login');
          return;
        }

        // Firebase session exists → check if user is registered in our DB
        try {
          const check = await apiGet<{ exists: boolean; is_onboarded: boolean }>(
            '/api/users/check',
          );

          if (check.exists && check.is_onboarded) {
            // Fully registered + onboarded → straight to home
            navigateWithTransition('MainTabs');
          } else if (check.exists && !check.is_onboarded) {
            // Registered but didn't finish onboarding
            navigateWithTransition('OnboardingStep1');
          } else {
            // Firebase session exists but no DB record (stale) → sign out & login
            try {
              await auth.signOut();
            } catch {}
            navigateWithTransition('Login');
          }
        } catch {
          // API unreachable → fallback to login
          navigateWithTransition('Login');
        }

        // We only need the first emission
        unsubscribe();
      });
    }, 900);

    return () => clearTimeout(timer);
  }, [navigateWithTransition]);

  const wipeHeight = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenHeight],
  });

  const wipeOpacity = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const logoSize = Math.min(screenWidth * 0.62, 270);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={SPLASH_BG} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image
          source={require('../assets/bear_logo.png')}
          style={[
            styles.logo,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize * 0.2,
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.wipeOverlay,
          {
            height: wipeHeight,
            opacity: wipeOpacity,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -36,
  },
  logo: {
    width: 210,
    height: 210,
  },
  wipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: SPLASH_BG,
  },
});

export default SplashScreen;
