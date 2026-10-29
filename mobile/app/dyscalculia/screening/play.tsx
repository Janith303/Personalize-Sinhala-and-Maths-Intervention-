// Stage 1: runs the 7 screening games. Each trial is a timed yes/no decision; accuracy and
// reaction times are sent for scoring at the end. No right/wrong feedback and no hints during the games.
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Btn3D, DotsPill, Highlight, InfoBox, PaperCard, Screen, StarPill } from '@/components/dyscalculia/kit';
import { DotBox, Equation, Face, MemoryGrid, NumberBox, PictureBox, Shape } from '@/components/dyscalculia/Stimuli';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import { scoreScreening } from '@/services/dyscalculia/api';
import type { TrialResult, TrialSpec } from '@/types/dyscalculia';
import { buildTrials, DEADLINE_MS, TASK_ORDER } from '@/utils/dyscalculia/screeningTrials';

type Phase = 'instruction' | 'gap' | 'memoryShow' | 'stimulus' | 'calculating';

const GAP_MS = 400;
const MEMORY_SHOW_MS = 1800;

function Stimulus({ trial, showStars }: { trial: TrialSpec; showStars?: boolean }) {
  const { s } = useU();
  switch (trial.kind) {
    case 'verify':
      return <Equation parts={[trial.a, '+', trial.b, '=', trial.shown]} />;
    case 'numberMatch':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(30) }}>
          <NumberBox width={230} height={210}>
            <Text style={{ fontSize: s(140), lineHeight: s(160), fontWeight: '900', color: colors.navy }}>{trial.digit}</Text>
          </NumberBox>
          <DotBox count={trial.dots} seed={trial.digit * 31 + trial.dots} />
        </View>
      );
    case 'shapeMatch':
      return (
        <View style={{ flexDirection: 'row', gap: s(30) }}>
          <PictureBox>
            <Shape name={trial.left} />
          </PictureBox>
          <PictureBox>
            <Shape name={trial.right} />
          </PictureBox>
        </View>
      );
    case 'faceMatch':
      return (
        <View style={{ flexDirection: 'row', gap: s(30) }}>
          <PictureBox>
            <Face spec={trial.left} />
          </PictureBox>
          <PictureBox>
            <Face spec={trial.right} />
          </PictureBox>
        </View>
      );
    case 'memory':
      return showStars ? <MemoryGrid stars={trial.cells} cell={46} /> : <MemoryGrid probe={trial.probe} cell={46} />;
  }
}

export default function ScreeningPlay() {
  const { s } = useU();
  const { childName, stars, saveScreening, addStars } = useDyscalculia();
  const [block, setBlock] = useState(0);
  const [trialIdx, setTrialIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('instruction');
  const [trials, setTrials] = useState<TrialSpec[]>(() => buildTrials(TASK_ORDER[0]));
  const results = useRef<TrialResult[]>([]);
  const shownAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const task = TASK_ORDER[block];
  const trial = trials[trialIdx];
  const info = si.tasks[task];

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => clearTimer, []);

  // Phase timing: gap -> (memory stars) -> stimulus with deadline
  useEffect(() => {
    clearTimer();
    if (phase === 'gap') {
      timer.current = setTimeout(() => setPhase(trial.kind === 'memory' ? 'memoryShow' : 'stimulus'), GAP_MS);
    } else if (phase === 'memoryShow') {
      timer.current = setTimeout(() => setPhase('stimulus'), MEMORY_SHOW_MS);
    } else if (phase === 'stimulus') {
      shownAt.current = Date.now();
      timer.current = setTimeout(() => record(null), DEADLINE_MS[task]);
    }
    // record/trial/task change together with phase; re-running on phase is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trialIdx, block]);

  const finish = async () => {
    setPhase('calculating');
    const report = await scoreScreening(childName, results.current);
    saveScreening(report);
    addStars(TASK_ORDER.length);
    router.replace('/dyscalculia/screening/done');
  };

  function record(answerYes: boolean | null) {
    clearTimer();
    results.current.push({
      task,
      responded: answerYes !== null,
      correct: answerYes !== null && answerYes === trial.answerYes,
      rtMs: answerYes !== null ? Date.now() - shownAt.current : null,
    });
    if (trialIdx + 1 < trials.length) {
      setTrialIdx(trialIdx + 1);
      setPhase('gap');
    } else if (block + 1 < TASK_ORDER.length) {
      setBlock(block + 1);
      setTrials(buildTrials(TASK_ORDER[block + 1]));
      setTrialIdx(0);
      setPhase('instruction');
    } else {
      finish();
    }
  }

  const title = `${si.screening.gameOf(block + 1, TASK_ORDER.length)} • ${info.title}`;

  if (phase === 'calculating') {
    return (
      <Screen scene="owl" title={si.screening.introTitle}>
        <PaperCard style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Txt size={26} weight="bold" color={colors.navy} style={{ marginTop: s(10) }}>
            {si.screening.calculating}
          </Txt>
        </PaperCard>
      </Screen>
    );
  }

  // Mockup 7: owl scene with the game's instructions
  if (phase === 'instruction') {
    return (
      <Screen scene="owl" title={title} right={<DotsPill total={TASK_ORDER.length} current={block} />}>
        <PaperCard>
          <Highlight size={36}>{info.title}</Highlight>
          <Txt size={27} weight="semi" color={colors.navy} style={{ marginTop: s(14), paddingHorizontal: s(20) }}>
            {info.instruction}
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(24), marginTop: s(20) }}>
            <InfoBox icon="help" style={{ flex: 1 }}>
              <Txt size={22} weight="semi" color={colors.navy}>
                {si.common.ready}
              </Txt>
            </InfoBox>
            <Btn3D label={si.common.start} icon="play" color={colors.blue} dark={colors.blueDark} onPress={() => setPhase('gap')} style={{ flex: 1.1 }} />
          </View>
        </PaperCard>
      </Screen>
    );
  }

  // Mockups 5 and 6: boy-at-desk scene with the question card
  const [yesLabel, noLabel] =
    trial.kind === 'verify'
      ? [si.common.correct, si.common.wrong]
      : trial.kind === 'memory'
        ? [si.common.yes, si.common.no]
        : [si.common.same, si.common.different];
  const prompt =
    trial.kind === 'verify'
      ? si.screening.ask.verify
      : trial.kind === 'numberMatch'
        ? si.screening.ask.numberMatch
        : trial.kind === 'shapeMatch'
          ? si.screening.ask.shapeMatch
          : trial.kind === 'faceMatch'
            ? si.screening.ask.faceMatch
            : phase === 'stimulus'
              ? si.screening.ask.memoryAsk
              : si.screening.ask.memoryWatch;
  const answering = phase === 'stimulus';

  return (
    <Screen
      scene="boyQuestion"
      title={title}
      right={
        <>
          <DotsPill total={trials.length} current={trialIdx} />
          <StarPill label={`${si.common.stars} ${stars}`} />
        </>
      }
    >
      <PaperCard style={{ alignItems: 'center', paddingVertical: s(20) }}>
        <Highlight tone="blue" size={30}>
          {prompt}
        </Highlight>
        <View style={{ minHeight: s(250), alignItems: 'center', justifyContent: 'center', marginVertical: s(12) }}>
          {phase === 'gap' ? (
            <Text style={{ fontSize: s(80), fontWeight: '900', color: colors.skyBorder }}>+</Text>
          ) : (
            <Stimulus trial={trial} showStars={phase === 'memoryShow'} />
          )}
        </View>
        <View
          style={{ flexDirection: 'row', gap: s(30), alignSelf: 'stretch', opacity: answering ? 1 : 0 }}
          pointerEvents={answering ? 'auto' : 'none'}
        >
          <Btn3D label={yesLabel} icon="checkmark" onPress={() => record(true)} style={{ flex: 1 }} />
          <Btn3D label={noLabel} icon="close" color={colors.red} dark={colors.redDark} onPress={() => record(false)} style={{ flex: 1 }} />
        </View>
      </PaperCard>
    </Screen>
  );
}
