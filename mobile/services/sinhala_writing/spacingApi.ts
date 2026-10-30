// Sends a photo of one handwritten line to the backend and returns the spacing result.
//
// Set the backend address in mobile/.env:
//   EXPO_PUBLIC_API_URL=http://192.168.1.25:8000      (your computer's Wi-Fi IP while testing)
import { File } from 'expo-file-system';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.25:8000';

export type GapStatus = 'ok' | 'too_wide' | 'too_narrow';

export interface SpacingGap {
  index: number;
  between_words: [number, number];
  width: number;
  status: GapStatus;
  message: string;
}

export interface SpacingResult {
  is_correct: boolean;
  verdict: 'GOOD' | 'BAD';
  message: string;
  probability_bad: number;
  confidence: number;
  words_found: number;
  letter_height_px: number;
  normal_gap_range: [number, number];
  gaps: SpacingGap[];
  annotated_image: string | null; // data:image/jpeg;base64,... — use directly as <Image source={{ uri }} />
  model: string;
}

const TIMEOUT_MS = 30000;

export async function checkSpacing(imageUri: string): Promise<SpacingResult> {
  const form = new FormData();
  // Expo's fetch needs a File object (it reads the bytes itself); the old { uri, name, type } object is not supported
  form.append('file', new File(imageUri) as any);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/sinhala-writing/spacing/predict`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
  } catch (e) {
    console.log('checkSpacing failed', API_URL, imageUri, e);
    throw new Error('සේවාදායකයට සම්බන්ධ විය නොහැක. අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.');
  } finally {
    clearTimeout(timer);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // The backend sends a Sinhala message in "detail" (e.g. no handwriting found)
    throw new Error(typeof body?.detail === 'string' ? body.detail : 'දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.');
  }
  return body as SpacingResult;
}