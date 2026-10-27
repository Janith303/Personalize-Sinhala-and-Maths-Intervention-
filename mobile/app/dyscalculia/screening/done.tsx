// End of Stage 1 for the child: only praise and stars, never a risk label.
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { BigButton, Card, Mascot, SiText, StarPill, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import { TASK_ORDER } from '../../../utils/dyscalculia/screeningTrials';

export default function ScreeningDone() {
  const { stars } = useDyscalculia();
  return (
    <View className="flex-1">
      <TopBar
        title={si.screening.introTitle}
        onBack={() => router.replace('/dyscalculia')}
        right={<StarPill label={`${si.common.stars} ${stars}`} />}
      />
      <MathBackground>
        <View className="flex-1 flex-row items-center justify-center px-6">
          <Mascot size={120} mood="🎉" />
          <Card className="ml-6 items-center" style={{ width: '55%' }}>
            <SiText weight="bold" style={{ fontSize: 22, color: colors.primary, textAlign: 'center' }}>
              {si.screening.doneTitle}
            </SiText>
            <Text style={{ fontSize: 34, marginVertical: 8 }}>{'⭐'.repeat(Math.min(TASK_ORDER.length, 7))}</Text>
            <SiText style={{ fontSize: 16 }}>
              {si.screening.doneSub}: {TASK_ORDER.length}
            </SiText>
            <View className="mt-4 flex-row">
              <BigButton label={si.common.home} icon="🏠" onPress={() => router.replace('/dyscalculia')} style={{ marginRight: 12 }} />
              <BigButton
                label={si.screening.forTeacher}
                icon="👩‍🏫"
                color={colors.purple}
                onPress={() => router.replace('/dyscalculia/teacher')}
              />
            </View>
          </Card>
        </View>
      </MathBackground>
    </View>
  );
}
