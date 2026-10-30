// Sends a photo of one handwritten line to the backend and returns the baseline (guide line) result.
import { File } from 'expo-file-system';
import { API_URL } from './spacingApi';

export type WordStatus = 'on_line' | 'above' | 'below';

export interface BaselineWord {
  index: number;
  gap: number;
  status: WordStatus;
  message: string;
}

export interface BaselineResult {
  is_correct: boolean;
  verdict: 'CORRECT' | 'WRONG';
  message: string;
  probability_wrong: number;
  confidence: number;
  guide_line_found: boolean;
  words_found: number;
  measurements: {
    drift_slope: number | null;
    mean_gap: number | null;
    max_abs_gap: number | null;
    waviness: number | null;
  };
  words: BaselineWord[];
  annotated_image: string | null; // data:image/jpeg;base64,... — use directly as <Image source={{ uri }} />
  model: string;
}

const TIMEOUT_MS = 30000;

export async function checkBaseline(imageUri: string): Promise<BaselineResult> {
  const form = new FormData();
  // Expo's fetch needs a File object (it reads the bytes itself)
  form.append('file', new File(imageUri) as any);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/sinhala-writing/baseline/predict`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
  } catch (e) {
    console.log('checkBaseline failed', API_URL, imageUri, e);
    throw new Error('සේවාදායකයට සම්බන්ධ විය නොහැක. අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.');
  } finally {
    clearTimeout(timer);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(typeof body?.detail === 'string' ? body.detail : 'දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.');
  }
  return body as BaselineResult;
}