// Stage 2 intro: three groups of games (quantity, sequence, operations) to build a learning profile.
import { router } from 'expo-router';
import { View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { AREA_ICON, Icon } from '@/components/dyscalculia/Icon';
import { Btn3D, Highlight, PaperCard, Screen, StarPill } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { areaColors, colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import type { SkillArea } from '@/types/dyscalculia';

const AREAS: SkillArea[] = ['quantity', 'sequence', 'operations'];

export default function ProfileIntro() {
  const { s } = useU();
  const { stars } = useDyscalculia();
  return (
    <Screen scene="boyWave" gear title={si.profile.introTitle} right={<StarPill label={`${si.common.stars} ${stars}`} />}>
      <PaperCard>
        <Highlight size={36}>{si.profile.introTitle}</Highlight>
        <Txt size={25} weight="semi" color={colors.navy} align="center" style={{ marginTop: s(10) }}>
          {si.profile.explain}
        </Txt>
        <View style={{ flexDirection: 'row', gap: s(16), marginTop: s(14) }}>
          {AREAS.map((area) => (
            <View
              key={area}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: s(10),
                borderRadius: s(22),
                backgroundColor: areaColors[area].soft,
                borderWidth: s(3),
                borderColor: areaColors[area].main,
              }}
            >
              <Icon name={AREA_ICON[area]} size={s(70)} />
              <Txt size={21} weight="black" color={areaColors[area].main}>
                {si.areas[area]}
              </Txt>
            </View>
          ))}
        </View>
        <View style={{ marginTop: s(16), alignItems: 'flex-end' }}>
          <Btn3D
            label={si.common.start}
            icon="play"
            color={colors.purple}
            dark={colors.purpleDark}
            onPress={() => router.replace('/dyscalculia/profile/play')}
            style={{ width: s(380) }}
          />
        </View>
      </PaperCard>
    </Screen>
  );
}
