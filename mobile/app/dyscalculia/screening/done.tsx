// End of Stage 1 for the child: only praise and stars, never a risk label (cheering boy scene).
import { router } from 'expo-router';
import { View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Btn3D, PaperCard, Screen, StarPill, Stars } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import { TASK_ORDER } from '@/utils/dyscalculia/screeningTrials';

export default function ScreeningDone() {
  const { s } = useU();
  const { stars } = useDyscalculia();
  return (
    <Screen
      scene="boyCheer"
      title={si.screening.introTitle}
      onBack={() => router.replace('/dyscalculia')}
      right={<StarPill label={`${si.common.stars} ${stars}`} />}
    >
      <PaperCard border={colors.greenBorder} dash="#C7EBD4" style={{ alignItems: 'center' }}>
        <Txt size={40} weight="black" color={colors.green} align="center">
          {si.screening.doneTitleA}{' '}
          <Txt size={40} weight="black" color={colors.navy}>
            {si.screening.doneTitleB}
          </Txt>
        </Txt>
        <View style={{ marginVertical: s(10) }}>
          <Stars filled={TASK_ORDER.length} size={70} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: s(12),
            backgroundColor: colors.creamPill,
            borderRadius: s(30),
            borderWidth: s(2),
            borderColor: '#F7E3A6',
            paddingHorizontal: s(70),
          }}
        >
          <Txt size={26} weight="semi" color={colors.navy}>
            {si.screening.doneSub}
          </Txt>
          <Txt size={36} weight="black" color={colors.green}>
            {TASK_ORDER.length}
          </Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: s(26), marginTop: s(20), alignSelf: 'stretch' }}>
          <Btn3D label={si.common.home} icon="home" onPress={() => router.replace('/dyscalculia')} style={{ flex: 1 }} />
          <Btn3D
            label={si.screening.forTeacher}
            icon="easel"
            color={colors.purple}
            dark={colors.purpleDark}
            size={24}
            onPress={() => router.replace('/dyscalculia/teacher')}
            style={{ flex: 1 }}
          />
        </View>
      </PaperCard>
    </Screen>
  );
}
