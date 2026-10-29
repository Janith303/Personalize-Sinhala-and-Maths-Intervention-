// Stage 2: 9 questions per group (27 in total) with gentle feedback (it is an assessment, no hints),
// then the answers go to the backend for the learning profile.
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { PaperCard, Screen } from '@/components/dyscalculia/kit';
import { QuestionPlayer } from '@/components/dyscalculia/QuestionPlayer';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import { scoreProfile } from '@/services/dyscalculia/api';
import { profileQuestions } from '@/utils/dyscalculia/questions';

export default function ProfilePlay() {
  const { s } = useU();
  const { childName, saveProfile, addStars } = useDyscalculia();
  const [questions] = useState(profileQuestions);
  const [calculating, setCalculating] = useState(false);

  if (calculating) {
    return (
      <Screen scene="owl" title={si.profile.introTitle}>
        <PaperCard style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Txt size={26} weight="bold" color={colors.navy} style={{ marginTop: s(10) }}>
            {si.screening.calculating}
          </Txt>
        </PaperCard>
      </Screen>
    );
  }

  return (
    <QuestionPlayer
      title={si.profile.introTitle}
      questions={questions}
      feedback="gentle"
      headerFor={(q) => si.areas[q.area]}
      onFinish={async (results) => {
        setCalculating(true);
        saveProfile(await scoreProfile(childName, results));
        addStars(3);
        router.replace('/dyscalculia/profile/done');
      }}
    />
  );
}
