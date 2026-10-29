// One practice session (8 questions) for a skill area and level, then stars and the next step:
// 2+ stars unlocks the next level; below 50 % suggests an easier level. Hints are allowed here.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Btn3D, PaperCard, Screen, StarPill, Stars } from '@/components/dyscalculia/kit';
import { QuestionPlayer } from '@/components/dyscalculia/QuestionPlayer';
import { si } from '@/constants/dyscalculia/strings.si';
import { areaColors, colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import type { SkillArea } from '@/types/dyscalculia';
import { makeQuestions, MAX_LEVEL } from '@/utils/dyscalculia/questions';
import { starsFor } from '@/utils/dyscalculia/scoring';

export default function PracticeSession() {
  const { s } = useU();
  const params = useLocalSearchParams<{ area: SkillArea; level: string }>();
  const area: SkillArea = params.area ?? 'quantity';
  const level = Math.min(MAX_LEVEL, Math.max(1, Number(params.level) || 1));
  const { stars, savePractice, addStars } = useDyscalculia();

  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState(() => makeQuestions(area, level));
  const [result, setResult] = useState<{ correct: number; total: number; stars: number } | null>(null);
  const title = `${si.areas[area]} • ${si.practice.level(level)}`;

  const goLevel = (l: number) =>
    router.replace({ pathname: '/dyscalculia/practice/session', params: { area, level: String(l) } });

  if (!result) {
    return (
      <QuestionPlayer
        key={round}
        title={title}
        questions={questions}
        feedback="full"
        hints
        onFinish={(rs) => {
          const correct = rs.filter((r) => r.correct).length;
          const earned = starsFor(correct / rs.length);
          savePractice(area, level, earned);
          addStars(earned);
          setResult({ correct, total: rs.length, stars: earned });
        }}
      />
    );
  }

  const passed = result.stars >= 2;
  const struggling = result.correct / result.total < 0.5;
  return (
    <Screen
      scene={passed ? 'owlParty' : 'owl'}
      title={title}
      onBack={() => router.replace('/dyscalculia/practice')}
      right={<StarPill label={`${si.common.stars} ${stars}`} />}
    >
      <PaperCard border={passed ? colors.greenBorder : undefined} dash={passed ? '#C7EBD4' : undefined} style={{ alignItems: 'center' }}>
        <Txt size={38} weight="black" color={areaColors[area].main} align="center">
          {si.practice.sessionDone}
        </Txt>
        <View style={{ marginVertical: s(8) }}>
          <Stars filled={result.stars} total={3} size={76} />
        </View>
        <Txt size={27} weight="semi" color={colors.navy}>
          {si.practice.score(result.correct, result.total)}
        </Txt>
        {passed && level < MAX_LEVEL ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
            <Ionicons name="lock-open" size={s(28)} color={colors.green} />
            <Txt size={23} weight="bold" color={colors.green}>
              {si.practice.levelUp}
            </Txt>
          </View>
        ) : null}
        {struggling && level > 1 ? (
          <Txt size={23} weight="bold" color={colors.amberDark}>
            {si.practice.tryEasier}
          </Txt>
        ) : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: s(14), marginTop: s(16) }}>
          <Btn3D
            label={si.practice.again}
            icon="refresh"
            color={colors.blue}
            dark={colors.blueDark}
            height={64}
            size={22}
            onPress={() => {
              setQuestions(makeQuestions(area, level));
              setResult(null);
              setRound(round + 1);
            }}
          />
          {struggling && level > 1 ? (
            <Btn3D label={si.practice.level(level - 1)} icon="arrow-down" color={colors.amber} dark={colors.amberDark} height={64} size={22} onPress={() => goLevel(level - 1)} />
          ) : null}
          {passed && level < MAX_LEVEL ? (
            <Btn3D label={si.practice.nextLevel} icon="arrow-up" height={64} size={22} onPress={() => goLevel(level + 1)} />
          ) : null}
          <Btn3D
            label={si.practice.backToMap}
            icon="map"
            color={colors.purple}
            dark={colors.purpleDark}
            height={64}
            size={22}
            onPress={() => router.replace('/dyscalculia/practice')}
          />
        </View>
      </PaperCard>
    </Screen>
  );
}
