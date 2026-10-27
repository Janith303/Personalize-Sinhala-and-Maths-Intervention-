// Stage 1: runs the 7 screening games. Each trial is a timed yes/no decision; accuracy and
// reaction times are sent for scoring at the end. No right/wrong feedback during the games.
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { DotField, Face, MemoryGrid, Shape } from '../../../components/dyscalculia/Stimuli';
import { BigButton, Card, Mascot, NumText, ProgressDots, SiText, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import { scoreScreening } from '../../../services/dyscalculia/api';
import type { TrialResult, TrialSpec } from '../../../types/dyscalculia';
import { buildTrials, DEADLINE_MS, TASK_ORDER } from '../../../utils/dyscalculia/screeningTrials';

type Phase = 'instruction' | 'gap' | 'memoryShow' | 'stimulus' | 'calculating';

const GAP_MS = 400;
const MEMORY_SHOW_MS = 1800;

function Stimulus({ trial, showStars }: { trial: TrialSpec; showStars?: boolean }) {
  switch (trial.kind) {
    case 'verify':
      return (
        <View className="rounded-3xl bg-white px-12 py-3" style={{ borderWidth: 3, borderColor: colors.primaryLight }}>
          <NumText style={{ fontSize: 54, letterSpacing: 3 }}>
            {trial.a} + {trial.b} = {trial.shown}
          </NumText>
        </View>
      );
    case 'numberMatch':
      return (
        <View className="flex-row items-center">
          <View className="mr-6 h-32 w-32 items-center justify-center rounded-3xl bg-white" style={{ borderWidth: 3, borderColor: colors.primaryLight }}>
            <NumText style={{ fontSize: 70 }}>{trial.digit}</NumText>
          </View>
          <View className="rounded-3xl bg-white p-3" style={{ borderWidth: 3, borderColor: colors.amber }}>
            <DotField count={trial.dots} width={200} height={110} dot={22} color={colors.amber} seed={trial.digit * 31 + trial.dots} />
          </View>
        </View>
      );
    case 'shapeMatch':
      return (
        <View className="flex-row items-center">
          {[trial.left, trial.right].map((s, i) => (
            <View key={i} className="mx-4 h-36 w-44 items-center justify-center rounded-3xl bg-white" style={{ borderWidth: 3, borderColor: colors.border }}>
              <Shape name={s} />
            </View>
          ))}
        </View>
      );
    case 'faceMatch':
      return (
        <View className="flex-row items-center">
          {[trial.left, trial.right].map((f, i) => (
            <View key={i} className="mx-4 h-36 w-40 items-center justify-center rounded-3xl bg-white" style={{ borderWidth: 3, borderColor: colors.border }}>
              <Face spec={f} size={112} />
            </View>
          ))}
        </View>
      );
    case 'memory':
      return showStars ? <MemoryGrid stars={trial.cells} cell={36} /> : <MemoryGrid probe={trial.probe} cell={36} />;
  }
}

export default function ScreeningPlay() {
  const { childName, saveScreening, addStars } = useDyscalculia();
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

  const title = `${si.screening.gameOf(block + 1, TASK_ORDER.length)} · ${info.title}`;

  if (phase === 'calculating') {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.page }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <SiText weight="medium" style={{ marginTop: 12, fontSize: 18, color: colors.primary }}>
          {si.screening.calculating}
        </SiText>
      </View>
    );
  }

  if (phase === 'instruction') {
    return (
      <View className="flex-1">
        <TopBar title={title} right={<ProgressDots total={TASK_ORDER.length} current={block} />} />
        <MathBackground>
          <View className="flex-1 flex-row items-center justify-center px-6">
            <Mascot size={110} />
            <Card className="ml-6 items-start" style={{ width: '55%' }}>
              <SiText weight="bold" style={{ fontSize: 22, color: colors.primary }}>
                {info.title}
              </SiText>
              <SiText style={{ fontSize: 17, marginTop: 6 }}>{info.instruction}</SiText>
              <View className="mt-4 w-full flex-row items-center justify-between">
                <SiText style={{ fontSize: 15, color: colors.muted }}>{si.common.ready}</SiText>
                <BigButton label={si.common.start} icon="play" onPress={() => setPhase('gap')} />
              </View>
            </Card>
          </View>
        </MathBackground>
      </View>
    );
  }

  const [yesLabel, noLabel, yesColor, noColor] =
    trial.kind === 'verify'
      ? [si.common.correct, si.common.wrong, colors.green, colors.red]
      : trial.kind === 'memory'
        ? [si.common.yes, si.common.no, colors.primaryLight, colors.purple]
        : [si.common.same, si.common.different, colors.primaryLight, colors.purple];
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

  return (
    <View className="flex-1">
      <TopBar title={title} right={<ProgressDots total={trials.length} current={trialIdx} />} />
      <MathBackground>
        <View className="flex-1 items-center justify-evenly px-6 py-2">
          <SiText weight="medium" style={{ fontSize: 19, color: colors.primary }}>
            {prompt}
          </SiText>
          {phase === 'gap' ? (
            <Text style={{ fontSize: 44, color: colors.primarySoft, fontWeight: '800' }}>+</Text>
          ) : (
            <Stimulus trial={trial} showStars={phase === 'memoryShow'} />
          )}
          <View className="flex-row" style={{ opacity: phase === 'stimulus' ? 1 : 0 }} pointerEvents={phase === 'stimulus' ? 'auto' : 'none'}>
            <BigButton label={`✓  ${yesLabel}`} color={yesColor} size="lg" onPress={() => record(true)} style={{ marginHorizontal: 14, minWidth: 170 }} />
            <BigButton label={`✗  ${noLabel}`} color={noColor} size="lg" onPress={() => record(false)} style={{ marginHorizontal: 14, minWidth: 170 }} />
          </View>
        </View>
      </MathBackground>
    </View>
  );
}
