// Connection to the FastAPI backend (Backend/app/api/dyscalculia).
// The backend address is found the same way as in services/sinhala-slow/api.ts: EXPO_PUBLIC_API_URL if set,
// otherwise the computer running Expo (port 8000). If the backend cannot be reached, scoring falls back
// to the local demo scoring (utils/dyscalculia/scoring.ts) so the child is never left waiting.
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { AREA_GROUP, type ProfileReport, type QuestionResult, type ScreeningReport, type TrialResult } from '@/types/dyscalculia';
import { demoReport, localProfile } from '@/utils/dyscalculia/scoring';

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

/** POST to the backend; null if it fails or takes longer than TIMEOUT_MS. */
async function post<T>(path: string, body: unknown): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.ok) return (await res.json()) as T;
    console.warn('[dyscalculia] backend returned', res.status, path);
  } catch (err) {
    console.warn('[dyscalculia] backend not reachable, using local scoring', path, err);
  } finally {
    clearTimeout(timer);
  }
  return null;
}

/** Stage 1: trained model on the backend, demo scoring as fallback. */
export async function scoreScreening(childName: string, trials: TrialResult[]): Promise<ScreeningReport> {
  return (await post<ScreeningReport>('/api/dyscalculia/screenings', { child: { nickname: childName }, trials })) ?? demoReport(trials);
}

/** Stage 2: rule-based profile on the backend, the same rules in the app as fallback. */
export async function scoreProfile(childName: string, results: QuestionResult[]): Promise<ProfileReport> {
  const answers = results.map((r) => ({ group: AREA_GROUP[r.area], kind: r.kind, correct: r.correct, rtMs: r.rtMs }));
  return (await post<ProfileReport>('/api/dyscalculia/profiles', { child: { nickname: childName }, answers })) ?? localProfile(results);
}
