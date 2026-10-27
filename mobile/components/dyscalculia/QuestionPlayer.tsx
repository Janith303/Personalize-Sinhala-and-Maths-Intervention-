// Plays a list of multiple-choice questions (Stage 2 profile and practice sessions).
// feedback="full": shows right/wrong and the correct answer (practice).
// feedback="gentle": always encourages, never says wrong (assessment, so feedback does not change the result).
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { si } from '../../constants/dyscalculia/strings.si';
import { colors, optionColors } from '../../constants/dyscalculia/theme';
import type { Question, QuestionResult } from '../../types/dyscalculia';
import { pick } from '../../utils/dyscalculia/random';
import { MathBackground } from './MathBackground';
import { QuestionVisualView } from './Stimuli';
import { BigButton, SiText, StarPill, TopBar } from './ui';

type Feedback = { ok: boolean; text: string } | null;

export function QuestionPlayer({
  title,
  questions,
  feedback = 'full',
  onFinish,
  headerFor,
}: {
  title: string;
  questions: Question[];
  feedback?: 'full' | 'gentle';
  onFinish: (results: QuestionResult[]) => void;
  /** Optional extra title per question (e.g. the skill area in Stage 2). */
  headerFor?: (q: Question) => string;
}) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState<Feedback>(null);
  const results = useRef<QuestionResult[]>([]);
  const startedAt = useRef(Date.now());
  const q = questions[index];

  const answer = (option: number | string) => {
    if (shown) return;
    const correct = option === q.answer;
    results.current.push({ area: q.area, correct, rtMs: Date.now() - startedAt.current });
    const fb: Feedback =
      feedback === 'gentle'
        ? { ok: true, text: si.common.keepGoing }
        : correct
          ? { ok: true, text: pick(si.common.praise) }
          : { ok: false, text: `${si.common.tryAgain}  ${si.common.correctAnswerIs(q.answer)}` };
    setShown(fb);
    setTimeout(
      () => {
        setShown(null);
        if (index + 1 >= questions.length) onFinish(results.current);
        else {
          setIndex(index + 1);
          startedAt.current = Date.now();
        }
      },
      fb.ok ? 900 : 1800,
    );
  };

  const header = headerFor ? `${title} · ${headerFor(q)}` : title;
  return (
    <View className="flex-1">
      <TopBar title={header} right={<StarPill label={`${index + 1} / ${questions.length}`} />} />
      <MathBackground>
        <View className="flex-1 items-center justify-evenly px-6 py-2">
          {shown ? (
            <View className="rounded-2xl px-6 py-1" style={{ backgroundColor: shown.ok ? colors.green : colors.amber }}>
              <SiText weight="bold" style={{ color: colors.white, fontSize: 19 }}>
                {shown.text}
              </SiText>
            </View>
          ) : (
            <SiText weight="medium" style={{ fontSize: 20, color: colors.primary }}>
              {q.prompt}
            </SiText>
          )}
          <QuestionVisualView visual={q.visual} seed={index} />
          <View className="flex-row">
            {q.options.map((opt, i) => (
              <BigButton
                key={`${index}-${opt}`}
                label={String(opt)}
                onPress={() => answer(opt)}
                color={optionColors[i % optionColors.length]}
                size="lg"
                style={{ marginHorizontal: 10, minWidth: 96 }}
                numeric={typeof opt === 'number' || opt.length <= 2}
              />
            ))}
          </View>
        </View>
      </MathBackground>
    </View>
  );
}
