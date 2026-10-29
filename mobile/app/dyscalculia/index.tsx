// Module home: reached from the "ඩිස්කැල්කුලියා" card on the maths screen.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Icon, type IconName } from '@/components/dyscalculia/Icon';
import { Avatar, CHARACTERS, HeaderPill, Screen, StarPill } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';

/** Faint maths symbols in a card corner (decoration). */
function Faint({ items }: { items: { t: string; c: string; x: number; y: number; size: number }[] }) {
  const { s } = useU();
  return (
    <>
      {items.map((d, i) => (
        <Text
          key={i}
          pointerEvents="none"
          style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, fontSize: s(d.size), fontWeight: '900', color: d.c }}
        >
          {d.t}
        </Text>
      ))}
    </>
  );
}

function StageCard({
  title,
  sub,
  icon,
  bg,
  border,
  text = colors.white,
  dashed,
  done,
  disabled,
  onPress,
  children,
}: {
  title: string;
  sub: string;
  icon: IconName;
  bg: string;
  border: string;
  text?: string;
  dashed?: boolean;
  done?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}) {
  const { s } = useU();
  // Pressed state in React state (not a style function, which NativeWind drops on Android).
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flex: 1,
        marginHorizontal: s(9),
        borderRadius: s(32),
        backgroundColor: bg,
        borderWidth: s(5),
        borderColor: border,
        borderStyle: dashed ? 'dashed' : 'solid',
        alignItems: 'center',
        paddingTop: s(34),
        overflow: 'hidden',
        transform: [{ scale: pressed ? 0.97 : 1 }],
      }}
    >
      {children}
      {done ? (
        <View
          style={{
            position: 'absolute',
            top: s(12),
            right: s(12),
            flexDirection: 'row',
            alignItems: 'center',
            gap: s(4),
            backgroundColor: colors.white,
            borderRadius: s(16),
            paddingHorizontal: s(10),
          }}
        >
          <Ionicons name="checkmark-circle" size={s(20)} color={colors.green} />
          <Txt size={15} weight="bold" color={colors.green}>
            {si.home.stage1Done}
          </Txt>
        </View>
      ) : null}
      <Icon name={icon} size={s(112)} />
      <Txt size={32} weight="black" color={text} align="center" style={{ marginTop: s(10) }}>
        {title}
      </Txt>
      <Txt size={19} weight="semi" color={text} align="center" style={{ paddingHorizontal: s(16) }}>
        {sub}
      </Txt>
    </Pressable>
  );
}

export default function DyscalculiaHome() {
  const { s } = useU();
  const { childName, stars, screening, profile } = useDyscalculia();
  const stage2Open = screening != null;

  return (
    <Screen
      scene="garden"
      layout="full"
      gear
      title={si.home.title}
      right={
        <>
          <HeaderPill label={si.home.teacher} onPress={() => router.push('/dyscalculia/teacher')} />
          <StarPill label={`${si.common.stars} ${stars}`} />
        </>
      }
    >
      <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: s(30), paddingTop: s(44), paddingBottom: s(34) }}>
        {/* greeting */}
        <View
          style={{
            flex: 1,
            marginHorizontal: s(9),
            borderRadius: s(32),
            backgroundColor: colors.white,
            borderWidth: s(5),
            borderColor: colors.skyBorder,
            alignItems: 'center',
            paddingTop: s(22),
            overflow: 'hidden',
          }}
        >
          <Faint
            items={[
              { t: '1', c: '#F9D5DC', x: 14, y: 76, size: 54 },
              { t: '+', c: '#C9EBD6', x: 40, y: 74, size: 50 },
              { t: '3', c: '#DCD3F6', x: 66, y: 70, size: 66 },
            ]}
          />
          <Avatar source={CHARACTERS.avatarOwl} size={150} />
          <Txt size={27} weight="black" color={colors.navy} align="center" style={{ marginTop: s(8), paddingHorizontal: s(10) }}>
            {childName ? si.home.helloName(childName) : si.home.hello}
          </Txt>
          <Txt size={19} weight="semi" color={colors.navy} align="center" style={{ paddingHorizontal: s(16) }}>
            {si.home.subtitle}
          </Txt>
        </View>

        {/* Stage 1 */}
        <StageCard
          title={si.home.stage1Title}
          sub={si.home.stage1Sub}
          icon="gamepad"
          bg="#2F7BE0"
          border="#5FA0EE"
          done={screening != null}
          onPress={() => router.push('/dyscalculia/screening')}
        >
          <View style={{ position: 'absolute', bottom: s(-14), alignSelf: 'center' }}>
            <Avatar source={CHARACTERS.avatarBoyWave} size={128} />
          </View>
        </StageCard>

        {/* Stage 2 (locked until Stage 1 is done) */}
        {stage2Open ? (
          <StageCard
            title={si.home.stage2Title}
            sub={si.home.stage2Sub}
            icon="blocks"
            bg={colors.purple}
            border="#B49CFA"
            done={profile != null}
            onPress={() => router.push('/dyscalculia/profile')}
          />
        ) : (
          <StageCard
            title={si.home.stage2Title}
            sub={si.home.stage2Locked}
            icon="lock"
            bg={colors.lockCard}
            border={colors.lockBorder}
            text={colors.lockText}
            dashed
            disabled
          >
            <Faint
              items={[
                { t: '÷', c: '#F4C89A', x: 16, y: 74, size: 56 },
                { t: '△', c: '#B9D2EE', x: 42, y: 78, size: 46 },
                { t: '2', c: '#F4C0D1', x: 70, y: 72, size: 60 },
              ]}
            />
          </StageCard>
        )}

        {/* Practice */}
        <StageCard
          title={si.home.practiceTitle}
          sub={si.home.practiceSub}
          icon="rocket"
          bg="#1E9E5A"
          border="#5CC98E"
          onPress={() => router.push('/dyscalculia/practice')}
        >
          <View style={{ position: 'absolute', bottom: s(18), right: s(34) }}>
            <Ionicons name="flag" size={s(46)} color="#F6C343" />
          </View>
        </StageCard>
      </View>
    </Screen>
  );
}
