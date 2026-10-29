import Constants from "expo-constants";
import { File } from "expo-file-system";
import { fetch as expoFetch } from "expo/fetch";
import { Platform } from "react-native";

const PORT = 8000;

// expo/fetch is for native; on web the browser fetch is the one that works with blob: URLs
const doFetch: typeof expoFetch =
  Platform.OS === "web" ? (globalThis.fetch as unknown as typeof expoFetch) : expoFetch;


function resolveBaseUrl(): string {
  if (Platform.OS === "web" && typeof location !== "undefined") return `http://${location.hostname}:${PORT}`;

  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return `http://${hostUri.split(":")[0]}:${PORT}`;

  return Platform.OS === "android" ? `http://10.0.2.2:${PORT}` : `http://localhost:${PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();

export type Verdict = "correct" | "wrong" | "wrong_letter" | "try_again";

export type PredictionResult = {
  verdict: Verdict;
  asked_letter: string | null;
  predicted_letter: string;
  predicted_state: "correct" | "wrong";
  pred_class: string;
  confidence: number;
};

export class ApiError extends Error {
  kind: "unclear" | "network" | "server";
  detail: string;
  constructor(kind: "unclear" | "network" | "server", message: string, detail = "") {
    super(message);
    this.kind = kind;
    this.detail = detail;
  }
}

/** Upload one photo; the model checks it against the letter the page asked for. */
export async function checkLetter(uri: string, letterId: string): Promise<PredictionResult> {
  const form = new FormData();
  if (Platform.OS === "web") {
    const blob = await (await doFetch(uri)).blob();
    form.append("file", blob, "letter.jpg");
  } else {
    // expo/fetch needs a Blob-like File, not the old { uri, name, type } object
    form.append("file", new File(uri) as unknown as Blob, "letter.jpg");
  }
  form.append("subject", "sinhala");
  form.append("asked_letter", letterId);
  form.append("question_id", letterId);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    res = await doFetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
  } catch (e) {
    throw new ApiError("network", "Cannot reach the server", String(e));
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 422 || res.status === 400 || res.status === 415) {
    throw new ApiError("unclear", "Image could not be read");
  }
  if (!res.ok) throw new ApiError("server", `Server error ${res.status}`, `HTTP ${res.status}`);
  return (await res.json()) as PredictionResult;
}
