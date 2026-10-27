// Stage 2: 6 questions per skill area with gentle feedback (it is an assessment).
import { router } from 'expo-router';
import { useState } from 'react';
import { QuestionPlayer } from '../../../components/dyscalculia/QuestionPlayer';
import { si } from '../../../constants/dyscalculia/strings.si';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import { profileQuestions } from '../../../utils/dyscalculia/questions';
import { summariseAreas } from '../../../utils/dyscalculia/scoring';

export default function ProfilePlay() {
  const { saveProfile, addStars } = useDyscalculia();
  const [questions] = useState(profileQuestions);

  return (
    <QuestionPlayer
      title={si.profile.introTitle}
      questions={questions}
      feedback="gentle"
      headerFor={(q) => si.areas[q.area]}
      onFinish={(results) => {
        saveProfile(summariseAreas(results));
        addStars(3);
        router.replace('/dyscalculia/profile/done');
      }}
    />
  );
}
