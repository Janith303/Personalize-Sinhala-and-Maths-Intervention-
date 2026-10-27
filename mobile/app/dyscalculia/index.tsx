// Module home: reached from the "dyscalculia test" button on the maths selection screen.
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Icon, type IconName } from '../../components/dyscalculia/Icon';
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
  icon: IconName;
  color: string;
  locked?: boolean;
  done?: boolean;
  onPress: () => void;
}) {
  const text = locked ? colors.primary : colors.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={title}
      className="mx-1.5 flex-1 items-center justify-center rounded-3xl px-3 py-4 active:opacity-80"
      style={{
        backgroundColor: locked ? colors.white : color,
        borderWidth: locked ? 3 : 0,
        borderStyle: 'dashed',
        borderColor: colors.primarySoft,
      }}
    >
      {done ? (
        <View className="absolute right-2 top-2 flex-row items-center rounded-full bg-white px-2 py-0.5">
          <SiText weight="bold" style={{ fontSize: 11, color: colors.green }}>
            ✓ {si.home.stage1Done}
          </SiText>
        </View>
      ) : null}
      <Icon name={locked ? 'lock' : icon} size={64} />
      <SiText weight="bold" style={{ fontSize: 20, color: text, textAlign: 'center', marginTop: 10 }}>
        {title}
      </SiText>
      {/* fixed two-line height so the three cards stay aligned */}
      <SiText style={{ fontSize: 13, color: locked ? colors.muted : text, textAlign: 'center', lineHeight: 19, height: 38, marginTop: 2 }}>
        {sub}
      </SiText>
    </Pressable>
  );
}

export default function DyscalculiaHome() {
  const { childName, stars, screening, profile } = useDyscalculia();
  const stage2Open = screening != null;

  return (
    <View className="flex-1">
      <TopBar
        title={si.home.title}
        right={
          <View className="flex-row items-center">
            {/* For the teacher / parent only, kept away from the child's game cards */}
            <Pressable
              onPress={() => router.push('/dyscalculia/teacher')}
              accessibilityRole="button"
              accessibilityLabel={si.home.teacher}
              className="mr-2 flex-row items-center rounded-full px-3 py-1 active:opacity-80"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Icon name="board" size={18} style={{ marginRight: 5 }} />
              <SiText weight="medium" style={{ fontSize: 13, color: colors.white }}>
                {si.home.teacher}
              </SiText>
            </Pressable>
            <StarPill label={`${si.common.stars} ${stars}`} />
          </View>
        }
      />
      <MathBackground>
        <View className="flex-1 flex-row p-3">
          <View
            className="mx-1.5 w-1/4 items-center justify-center rounded-3xl bg-white px-3 py-4"
            style={{ borderWidth: 2, borderColor: colors.border }}
          >
            <Mascot size={88} />
            <SiText weight="bold" style={{ fontSize: 18, marginTop: 10, textAlign: 'center' }}>
              {childName ? si.home.helloName(childName) : si.home.hello}
            </SiText>
            <SiText style={{ fontSize: 13, color: colors.primary, textAlign: 'center', lineHeight: 19, marginTop: 2 }}>
              {si.home.subtitle}
            </SiText>
          </View>
          <StageCard
            title={si.home.stage1Title}
            sub={si.home.stage1Sub}
            icon="gamepad"
            color={colors.primaryLight}
            done={screening != null}
            onPress={() => router.push('/dyscalculia/screening')}
          />
          <StageCard
            title={si.home.stage2Title}
            sub={stage2Open ? si.home.stage2Sub : si.home.stage2Locked}
            icon="blocks"
            color={colors.purple}
            locked={!stage2Open}
            done={profile != null}
            onPress={() => router.push('/dyscalculia/profile')}
          />
          <StageCard
            title={si.home.practiceTitle}
            sub={si.home.practiceSub}
            icon="rocket"
            color={colors.green}
            onPress={() => router.push('/dyscalculia/practice')}
          />
        </View>
      </MathBackground>
    </View>
  );
}
