// End of Stage 2 for the child: praise, then go to practice (recommended areas are marked there).
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { BigButton, Card, Mascot, SiText, StarPill, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';

export default function ProfileDone() {
  const { stars } = useDyscalculia();
  return (
    <View className="flex-1">
      <TopBar
        title={si.profile.introTitle}
        onBack={() => router.replace('/dyscalculia')}
        right={<StarPill label={`${si.common.stars} ${stars}`} />}
      />
      <MathBackground>
        <View className="flex-1 flex-row items-center justify-center px-6">
          <Mascot size={120} mood="🏆" />
          <Card className="ml-6 items-center" style={{ width: '55%' }}>
            <SiText weight="bold" style={{ fontSize: 22, color: colors.purple, textAlign: 'center' }}>
              {si.profile.doneTitle}
            </SiText>
            <Text style={{ fontSize: 34, marginVertical: 8 }}>⭐⭐⭐</Text>
            <SiText style={{ fontSize: 16 }}>{si.profile.doneSub}</SiText>
            <View className="mt-4 flex-row">
              <BigButton label={si.common.home} icon="🏠" color={colors.primaryLight} onPress={() => router.replace('/dyscalculia')} style={{ marginRight: 12 }} />
              <BigButton label={si.profile.toPractice} icon="🚀" color={colors.green} onPress={() => router.replace('/dyscalculia/practice')} />
            </View>
          </Card>
        </View>
      </MathBackground>
    </View>
  );
}
