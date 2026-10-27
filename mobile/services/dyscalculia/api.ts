// Connection to the FastAPI backend.
// Until the backend endpoint exists, scoring falls back to the local demo scoring (utils/dyscalculia/scoring.ts).
// To connect later, set EXPO_PUBLIC_API_URL (e.g. http://192.168.1.10:8000) in mobile/.env.
import type { ScreeningReport, TrialResult } from '../../types/dyscalculia';
import { demoReport } from '../../utils/dyscalculia/scoring';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function scoreScreening(childName: string, trials: TrialResult[]): Promise<ScreeningReport> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/dyscalculia/screenings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child: { nickname: childName }, trials }),
      });
      if (res.ok) return { ...(await res.json()), source: 'model' } as ScreeningReport;
    } catch {
      // backend unreachable -> demo scoring below
    }
  }
  return demoReport(trials);
}
