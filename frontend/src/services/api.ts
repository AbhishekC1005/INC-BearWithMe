// Centralised API client — attaches Firebase auth token to every request.

import { auth } from './firebaseConfig';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Determine the right backend URL:
// - Android emulator: 10.0.2.2 maps to host machine's localhost
// - iOS simulator: localhost works directly
// - Physical device (Expo Go): use your machine's LAN IP
const getBaseUrl = () => {
  // Expo Go on a physical device — use LAN IP
  const isExpoGo = Constants.appOwnership === 'expo';
  if (isExpoGo) {
    return 'http://192.168.1.10:8000';
  }
  // Emulators
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

// ── Helpers ──────────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};

  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
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
