// Plays a list of multiple-choice questions (Stage 2 profile and practice sessions).
// feedback="full": shows right/wrong and the correct answer (practice).
// feedback="gentle": always encourages, never says wrong (assessment, so feedback does not change the result).
// hints: shows the light bulb, which fades out one wrong answer (practice only, never in the assessments).
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors, optionColors } from '@/constants/dyscalculia/theme';
import type { Question, QuestionResult } from '@/types/dyscalculia';
import { pick } from '@/utils/dyscalculia/random';
import { Btn3D, Highlight, HintButton, PaperCard, Screen } from './kit';
import { QuestionVisualView } from './Stimuli';

type Feedback = { ok: boolean; text: string } | null;

function CountPill({ label }: { label: string }) {
  const { s } = useU();
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: s(26), paddingHorizontal: s(20), height: s(50), justifyContent: 'center' }}>
      <Txt size={22} weight="bold" color={colors.navy}>
        {label}
      </Txt>
    </View>
  );
}

export function QuestionPlayer({
  title,
  questions,
  feedback = 'full',
  hints = false,
  onFinish,
  headerFor,
}: {
  title: string;
  questions: Question[];
  feedback?: 'full' | 'gentle';
  hints?: boolean;
  onFinish: (results: QuestionResult[]) => void;
  /** Optional extra title per question (e.g. the skill area in Stage 2). */
  headerFor?: (q: Question) => string;
}) {
  const { s } = useU();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState<Feedback>(null);
  const [hidden, setHidden] = useState<(number | string)[]>([]);
  const results = useRef<QuestionResult[]>([]);
  const startedAt = useRef(Date.now());
  const q = questions[index];

  // A hint fades out one wrong answer; with only two choices that would give the answer away.
  const hintPossible = q.options.length > 2;
  const showHint = () => {
    const wrong = q.options.filter((o) => o !== q.answer && !hidden.includes(o));
    if (hintPossible && wrong.length) setHidden([...hidden, pick(wrong)]);
  };

  const answer = (option: number | string) => {
    if (shown) return;
    const correct = option === q.answer;
    results.current.push({ area: q.area, kind: q.kind, correct, rtMs: Date.now() - startedAt.current });
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
        setHidden([]);
        if (index + 1 >= questions.length) onFinish(results.current);
        else {
          setIndex(index + 1);
          startedAt.current = Date.now();
        }
      },
      fb.ok ? 900 : 1800,
    );
  };

  const header = headerFor ? `${title} • ${headerFor(q)}` : title;
  return (
    <Screen scene="boyQuestion" title={header} right={<CountPill label={`${index + 1} / ${questions.length}`} />}>
      <PaperCard style={{ alignItems: 'center', paddingVertical: s(20) }}>
        {hints ? <HintButton onPress={showHint} used={!hintPossible || hidden.length > 0 || !!shown} /> : null}
        {shown ? (
          <View style={{ backgroundColor: shown.ok ? colors.green : colors.amber, borderRadius: s(26), paddingHorizontal: s(30) }}>
            <Txt size={30} weight="black" color={colors.white} align="center">
              {shown.text}
            </Txt>
          </View>
        ) : (
          <Highlight tone="blue" size={30}>
            {q.prompt}
          </Highlight>
        )}
        <View style={{ minHeight: s(240), alignItems: 'center', justifyContent: 'center', marginVertical: s(12) }}>
          <QuestionVisualView visual={q.visual} seed={index} />
        </View>
        <View style={{ flexDirection: 'row', gap: s(24), alignSelf: 'stretch' }}>
          {q.options.map((opt, i) => {
            const [face, dark] = optionColors[i % optionColors.length];
            const faded = hidden.includes(opt);
            return (
              <Btn3D
                key={`${index}-${opt}`}
                label={String(opt)}
                onPress={() => answer(opt)}
                color={face}
                dark={dark}
                numeric={typeof opt === 'number' || opt.length <= 2}
                disabled={faded}
                style={{ flex: 1 }}
              />
            );
          })}
        </View>
      </PaperCard>
    </Screen>
  );
}
