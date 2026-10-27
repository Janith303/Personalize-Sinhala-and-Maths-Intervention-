// Module home: reached from the "dyscalculia test" button on the maths selection screen.
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MathBackground } from '../../components/dyscalculia/MathBackground';
import { Mascot, SiText, StarPill, TopBar } from '../../components/dyscalculia/ui';
import { si } from '../../constants/dyscalculia/strings.si';
import { colors } from '../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../contexts/dyscalculia/DyscalculiaContext';

function StageCard({
  title,
  sub,
  icon,
  color,
  locked,
  done,
  onPress,
}: {
  title: string;
  sub: string;
  icon: string;
  color: string;
  locked?: boolean;
  done?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={title}
      className="mx-2 flex-1 justify-between rounded-3xl p-4 active:opacity-80"
      style={{
        backgroundColor: locked ? colors.white : color,
        borderWidth: locked ? 3 : 0,
        borderStyle: 'dashed',
        borderColor: colors.primarySoft,
      }}
    >
      <View className="flex-row items-start justify-between">
        <Text style={{ fontSize: 40 }}>{locked ? '🔒' : icon}</Text>
        {done ? (
          <View className="rounded-full bg-white px-2 py-0.5">
            <SiText weight="bold" style={{ fontSize: 12, color: colors.green }}>
              ✓ {si.home.stage1Done}
            </SiText>
          </View>
        ) : null}
      </View>
      <View>
        <SiText weight="bold" style={{ fontSize: 21, color: locked ? colors.primary : colors.white }}>
          {title}
        </SiText>
        <SiText style={{ fontSize: 14, color: locked ? colors.muted : colors.white }}>{sub}</SiText>
      </View>
    </Pressable>
  );
}

export default function DyscalculiaHome() {
  const { childName, stars, screening, profile } = useDyscalculia();
  const stage2Open = screening != null;

  return (
    <View className="flex-1">
      <TopBar title={si.home.title} right={<StarPill label={`${si.common.stars} ${stars}`} />} />
      <MathBackground>
        <View className="flex-1 flex-row p-4">
          <View
            className="mr-2 w-1/4 items-center justify-center rounded-3xl bg-white p-3"
            style={{ borderWidth: 2, borderColor: colors.border }}
          >
            <Mascot size={86} />
            <SiText weight="bold" style={{ fontSize: 18, marginTop: 10, textAlign: 'center' }}>
              {childName ? si.home.helloName(childName) : si.home.hello}
            </SiText>
            <SiText style={{ fontSize: 13, color: colors.primary, textAlign: 'center', marginTop: 4 }}>{si.home.subtitle}</SiText>
            <Pressable
              onPress={() => router.push('/dyscalculia/teacher')}
              accessibilityRole="button"
              className="mt-4 rounded-full px-4 py-1.5"
              style={{ backgroundColor: colors.sky }}
            >
              <SiText weight="medium" style={{ fontSize: 13, color: colors.primary }}>
                👩‍🏫 {si.home.teacher}
              </SiText>
            </Pressable>
          </View>
          <View className="flex-1 flex-row">
            <StageCard
              title={si.home.stage1Title}
              sub={si.home.stage1Sub}
              icon="🎮"
              color={colors.primaryLight}
              done={screening != null}
              onPress={() => router.push('/dyscalculia/screening')}
            />
            <StageCard
              title={si.home.stage2Title}
              sub={stage2Open ? si.home.stage2Sub : si.home.stage2Locked}
              icon="🧩"
              color={colors.purple}
              locked={!stage2Open}
              done={profile != null}
              onPress={() => router.push('/dyscalculia/profile')}
            />
            <StageCard
              title={si.home.practiceTitle}
              sub={si.home.practiceSub}
              icon="🚀"
              color={colors.green}
              onPress={() => router.push('/dyscalculia/practice')}
            />
          </View>
        </View>
      </MathBackground>
    </View>
  );
}
