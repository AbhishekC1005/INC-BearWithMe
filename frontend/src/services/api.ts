// Centralised API client — attaches Firebase auth token to every request.

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Determine the right backend URL dynamically.
// Expo dev tools expose the host machine's LAN IP via debuggerHost,
// so any device on the same network can reach the backend automatically.
const getBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0]; // strip Metro port
    return `http://${host}:8000`;
  }

  // Fallback for emulators / production builds
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

// ── Helpers ──────────────────────────────────────────────────

/**
 * Wait for Firebase auth.currentUser to become available.
 * After signIn, the auth state listener fires asynchronously so
 * currentUser may not be set immediately.
 */
function waitForCurrentUser(timeoutMs = 5000): Promise<typeof auth.currentUser> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(auth.currentUser);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        clearTimeout(timer);
        unsubscribe();
        resolve(user);
      }
    });
  });
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  // First try direct access (fast path)
  let user = auth.currentUser;

  // If not available yet, wait for auth state to settle
  if (!user) {
    user = await waitForCurrentUser(5000);
  }

  if (!user) return {};

  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (e) {
    console.warn('Failed to get Firebase ID token:', e);
    return {};
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content (e.g. DELETE)
  if (res.status === 204) return undefined as unknown as T;

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ── Public API ───────────────────────────────────────────────

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<void> {
  return request<void>(path, { method: 'DELETE' });
}

export { API_BASE_URL };
