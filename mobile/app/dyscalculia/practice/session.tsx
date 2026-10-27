// One practice session (8 questions) for a skill area and level, then stars and the next step:
// 2+ stars unlocks the next level; below 50 % suggests an easier level.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Icon, StarRow } from '../../../components/dyscalculia/Icon';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { QuestionPlayer } from '../../../components/dyscalculia/QuestionPlayer';
import { BigButton, Card, Mascot, SiText, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { areaColors, colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import type { SkillArea } from '../../../types/dyscalculia';
import { makeQuestions, MAX_LEVEL } from '../../../utils/dyscalculia/questions';
import { starsFor } from '../../../utils/dyscalculia/scoring';

export default function PracticeSession() {
  const params = useLocalSearchParams<{ area: SkillArea; level: string }>();
  const area: SkillArea = params.area ?? 'quantity';
  const level = Math.min(MAX_LEVEL, Math.max(1, Number(params.level) || 1));
  const { savePractice, addStars } = useDyscalculia();

  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState(() => makeQuestions(area, level));
  const [result, setResult] = useState<{ correct: number; total: number; stars: number } | null>(null);
  const title = `${si.areas[area]} · ${si.practice.level(level)}`;

  const goLevel = (l: number) =>
    router.replace({ pathname: '/dyscalculia/practice/session', params: { area, level: String(l) } });

  if (!result) {
    return (
      <QuestionPlayer
        key={round}
        title={title}
        questions={questions}
        feedback="full"
        onFinish={(rs) => {
          const correct = rs.filter((r) => r.correct).length;
          const stars = starsFor(correct / rs.length);
          savePractice(area, level, stars);
          addStars(stars);
          setResult({ correct, total: rs.length, stars });
        }}
      />
    );
  }

  const passed = result.stars >= 2;
  const struggling = result.correct / result.total < 0.5;
  return (
    <View className="flex-1">
      <TopBar title={title} onBack={() => router.replace('/dyscalculia/practice')} />
      <MathBackground>
        <View className="flex-1 flex-row items-center justify-center px-6">
          <Mascot size={120} picture={passed ? 'owl_party' : 'owl'} />
          <Card className="ml-6 items-center" style={{ width: '58%' }}>
            <SiText weight="bold" style={{ fontSize: 22, color: areaColors[area].main }}>
              {si.practice.sessionDone}
            </SiText>
            <View className="my-2 flex-row">
              <StarRow filled={result.stars} total={3} size={38} />
            </View>
            <SiText style={{ fontSize: 17 }}>{si.practice.score(result.correct, result.total)}</SiText>
            {passed && level < MAX_LEVEL ? (
              <View className="mt-1 flex-row items-center">
                <Icon name="unlock" size={20} style={{ marginRight: 6 }} />
                <SiText weight="medium" style={{ fontSize: 15, color: colors.green }}>
                  {si.practice.levelUp}
                </SiText>
              </View>
            ) : null}
            {struggling && level > 1 ? (
              <SiText weight="medium" style={{ fontSize: 15, color: colors.amber, marginTop: 4 }}>
                {si.practice.tryEasier}
              </SiText>
            ) : null}
            <View className="mt-4 flex-row flex-wrap justify-center">
              <BigButton
                label={si.practice.again}
                icon="replay"
                size="sm"
                color={colors.primaryLight}
                style={{ margin: 4 }}
                onPress={() => {
                  setQuestions(makeQuestions(area, level));
                  setResult(null);
                  setRound(round + 1);
                }}
              />
              {struggling && level > 1 ? (
                <BigButton label={si.practice.level(level - 1)} icon="arrow_down" size="sm" color={colors.amber} style={{ margin: 4 }} onPress={() => goLevel(level - 1)} />
              ) : null}
              {passed && level < MAX_LEVEL ? (
                <BigButton label={si.practice.nextLevel} icon="arrow_up" size="sm" color={colors.green} style={{ margin: 4 }} onPress={() => goLevel(level + 1)} />
              ) : null}
              <BigButton
                label={si.practice.backToMap}
                icon="map"
                size="sm"
                color={colors.purple}
                style={{ margin: 4 }}
                onPress={() => router.replace('/dyscalculia/practice')}
              />
            </View>
          </Card>
        </View>
      </MathBackground>
    </View>
  );
}
