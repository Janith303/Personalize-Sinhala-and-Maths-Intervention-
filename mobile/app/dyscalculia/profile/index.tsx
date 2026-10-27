// Stage 2 intro: three groups of games (quantity, sequence, operations) to build a learning profile.
import { router } from 'expo-router';
import { View } from 'react-native';
import { AREA_ICON, Icon } from '../../../components/dyscalculia/Icon';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { BigButton, Card, Mascot, SiText, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { areaColors, colors } from '../../../constants/dyscalculia/theme';
import type { SkillArea } from '../../../types/dyscalculia';

const AREAS: SkillArea[] = ['quantity', 'sequence', 'operations'];

export default function ProfileIntro() {
  return (
    <View className="flex-1">
      <TopBar title={si.profile.introTitle} />
      <MathBackground>
        <View className="flex-1 flex-row items-center justify-center px-6">
          <Mascot size={110} />
          <Card className="ml-6" style={{ width: '58%' }}>
            <SiText weight="bold" style={{ fontSize: 21, color: colors.primary }}>
              {si.profile.introTitle}
            </SiText>
            <SiText style={{ fontSize: 16, marginTop: 4 }}>{si.profile.explain}</SiText>
            <View className="mt-3 flex-row">
              {AREAS.map((area) => (
                <View key={area} className="mr-2 flex-1 items-center rounded-2xl py-2" style={{ backgroundColor: areaColors[area].soft }}>
                  <Icon name={AREA_ICON[area]} size={36} />
                  <SiText weight="medium" style={{ fontSize: 14, color: areaColors[area].main }}>
                    {si.areas[area]}
                  </SiText>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row justify-end">
              <BigButton label={si.common.start} icon="play" color={colors.purple} onPress={() => router.replace('/dyscalculia/profile/play')} />
            </View>
          </Card>
        </View>
      </MathBackground>
    </View>
  );
}
