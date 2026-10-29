import type { MathsOperation } from "./questionGenerator";

/** One answered question = one row of input for the ML model. */
export type MathsAttemptPayload = {
  student_id: string | null;
  session_id: string;
  question_no: number;
  question_type: MathsOperation;
  question: string; // e.g. "18 + 13"
  operand_a: number;
  operand_b: number;
  correct_answer: number;
  student_answer: number;
  is_correct: boolean;
  total_time: number; // seconds spent on this question
  erase_count: number;
  hint_count: number;
  has_carry: boolean; // carry (addition) / borrow (subtraction)
  carry_over_time: number; // seconds between ones digit and tens digit (0 if no carry)
  created_at: string;
};

// Put EXPO_PUBLIC_API_URL=http://<your-pc-ip>:5000 in mobile/.env
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.5:5000";

export async function sendMathsAttempt(payload: MathsAttemptPayload) {
  console.log("[maths-slow] attempt →", JSON.stringify(payload));

  try {
    const res = await fetch(`${API_BASE_URL}/api/maths-slow/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn("[maths-slow] backend returned", res.status);
      return null;
    }
    return await res.json().catch(() => null);
  } catch (err) {
    // Backend not running yet – the screen keeps working.
    console.warn("[maths-slow] could not send attempt", err);
    return null;
  }
}