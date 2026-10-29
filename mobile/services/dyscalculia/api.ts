// Connection to the FastAPI backend (Backend/app/api/dyscalculia).
// The backend address is found the same way as in services/sinhala-slow/api.ts: EXPO_PUBLIC_API_URL if set,
// otherwise the computer running Expo (port 8000). If the backend cannot be reached, scoring falls back
// to the local demo scoring (utils/dyscalculia/scoring.ts) so the child is never left waiting.
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { ScreeningReport, TrialResult } from '@/types/dyscalculia';
import { demoReport } from '@/utils/dyscalculia/scoring';

const PORT = 8000;
const TIMEOUT_MS = 6000;

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (Platform.OS === 'web' && typeof location !== 'undefined') return `http://${location.hostname}:${PORT}`;
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return `http://${hostUri.split(':')[0]}:${PORT}`;
  return Platform.OS === 'android' ? `http://10.0.2.2:${PORT}` : `http://localhost:${PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();

export async function scoreScreening(childName: string, trials: TrialResult[]): Promise<ScreeningReport> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}/api/dyscalculia/screenings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child: { nickname: childName }, trials }),
      signal: controller.signal,
    });
    if (res.ok) return (await res.json()) as ScreeningReport;
    console.warn('[dyscalculia] backend returned', res.status);
  } catch (err) {
    console.warn('[dyscalculia] backend not reachable, using demo scoring', err);
  } finally {
    clearTimeout(timer);
  }
  return demoReport(trials);
}
