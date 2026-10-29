// End of Stage 2 for the child: praise, then go to practice (recommended areas are marked there).
import { router } from 'expo-router';
import { View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Btn3D, PaperCard, Screen, StarPill, Stars } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';

export default function ProfileDone() {
  const { s } = useU();
  const { stars } = useDyscalculia();
  return (
    <Screen
      scene="owlParty"
      title={si.profile.introTitle}
      onBack={() => router.replace('/dyscalculia')}
      right={<StarPill label={`${si.common.stars} ${stars}`} />}
    >
      <PaperCard border={colors.greenBorder} dash="#C7EBD4" style={{ alignItems: 'center' }}>
        <Txt size={40} weight="black" color={colors.purple} align="center">
          {si.profile.doneTitle}
        </Txt>
        <View style={{ marginVertical: s(10) }}>
          <Stars filled={3} size={80} />
        </View>
        <Txt size={27} weight="semi" color={colors.navy} align="center">
          {si.profile.doneSub}
        </Txt>
        <View style={{ flexDirection: 'row', gap: s(26), marginTop: s(20), alignSelf: 'stretch' }}>
          <Btn3D label={si.common.home} icon="home" color={colors.blue} dark={colors.blueDark} onPress={() => router.replace('/dyscalculia')} style={{ flex: 1 }} />
          <Btn3D label={si.profile.toPractice} icon="rocket" onPress={() => router.replace('/dyscalculia/practice')} style={{ flex: 1 }} />
        </View>
      </PaperCard>
    </Screen>
  );
}
