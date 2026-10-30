// Teacher / parent view behind a PIN: Stage 1 risk with reasons, Stage 2 profile and practice progress.
// The child never sees this; it is opened from the header pill on the module home.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Icon } from '@/components/dyscalculia/Icon';
import { Btn3D, Highlight, PaperCard, Screen } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { areaColors, colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import { AREA_GROUP, type DyscalculiaGroup, type RiskLevel, type SkillArea } from '@/types/dyscalculia';

const GROUP_AREA = Object.fromEntries(Object.entries(AREA_GROUP).map(([a, g]) => [g, a])) as Record<DyscalculiaGroup, SkillArea>;

// Demo PIN until the shared auth flow provides teacher accounts.
const TEACHER_PIN = '1234';

const RISK_STYLE: Record<RiskLevel, { bg: string; fg: string }> = {
  elevated: { bg: colors.redSoft, fg: colors.red },
  general: { bg: colors.amberSoft, fg: colors.amberDark },
  low: { bg: colors.greenSoft, fg: colors.green },
};

function Bar({ value, color, soft }: { value: number; color: string; soft: string }) {
  const { s } = useU();
  return (
    <View style={{ flex: 1, height: s(16), borderRadius: s(8), backgroundColor: soft, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.round(value * 100)}%`, borderRadius: s(8), backgroundColor: color }} />
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { s } = useU();
  return (
    <PaperCard style={{ flex: 1, padding: s(22) }}>
      <Txt size={23} weight="black" color={colors.header} style={{ marginBottom: s(6) }}>
        {title}
      </Txt>
      {children}
    </PaperCard>
  );
}

export default function TeacherReport() {
  const { s } = useU();
  const { childName, screening, profile, progress, reset } = useDyscalculia();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  const tryPin = (value = pin) => {
    Keyboard.dismiss();
    if (value === TEACHER_PIN) setUnlocked(true);
    else setWrong(true);
  };

  if (!unlocked) {
    return (
      <Screen scene="garden" layout="full" title={si.teacher.title}>
        {/* Tapping outside the PIN box closes the keyboard; the page scrolls when the keyboard is open. */}
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flexDirection: 'row', justifyContent: 'center', gap: s(26) }}>
            <PaperCard style={{ width: s(440), alignItems: 'center' }}>
              <Icon name="board" size={s(110)} />
              <Txt size={21} weight="semi" color={colors.navy} align="center" style={{ marginTop: s(6) }}>
                {si.teacher.about}
              </Txt>
            </PaperCard>
            <PaperCard style={{ width: s(440), alignItems: 'center' }}>
              <Highlight size={26} sparkles={false}>
                {si.teacher.pinPrompt}
              </Highlight>
              <TextInput
                value={pin}
                onChangeText={(t) => {
                  const digits = t.replace(/\D/g, '').slice(0, 4);
                  setPin(digits);
                  setWrong(false);
                  if (digits.length === 4) tryPin(digits); // closes the keyboard and opens the report
                }}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={() => tryPin()}
                disableFullscreenUI
                secureTextEntry
                maxLength={4}
                accessibilityLabel={si.teacher.pinPrompt}
                style={{
                  marginVertical: s(14),
                  width: s(220),
                  height: s(78),
                  borderRadius: s(18),
                  textAlign: 'center',
                  fontSize: s(40),
                  letterSpacing: s(14),
                  color: colors.navy,
                  backgroundColor: colors.sky,
                  borderWidth: s(3),
                  borderColor: wrong ? colors.red : '#7FB8EA',
                }}
              />
              {wrong ? (
                <Txt size={18} weight="bold" color={colors.red}>
                  {si.teacher.wrongPin}
                </Txt>
              ) : null}
              <Btn3D
                label={si.teacher.open}
                icon="lock-open"
                color={colors.blue}
                dark={colors.blueDark}
                onPress={() => tryPin()}
                style={{ alignSelf: 'stretch' }}
              />
              <Txt size={16} weight="semi" color={colors.muted} style={{ marginTop: s(6) }}>
                {si.teacher.pinHint}
              </Txt>
            </PaperCard>
          </Pressable>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen scene="garden" layout="full" title={`${si.teacher.title}${childName ? ` • ${childName}` : ''}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: s(10) }}>
        {!screening && !profile ? (
          <PaperCard style={{ alignItems: 'center' }}>
            <Txt size={24} weight="bold" color={colors.navy}>
              {si.teacher.noResults}
            </Txt>
          </PaperCard>
        ) : (
          <View style={{ flexDirection: 'row', gap: s(20) }}>
            <Section title={si.teacher.stage1}>
              {!screening ? (
                <Txt size={17} weight="semi" color={colors.muted}>
                  {si.teacher.noResults}
                </Txt>
              ) : (
                <>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: RISK_STYLE[screening.riskLevel].bg,
                      borderRadius: s(20),
                      paddingHorizontal: s(14),
                    }}
                  >
                    <Txt size={19} weight="black" color={RISK_STYLE[screening.riskLevel].fg}>
                      {si.teacher.risk[screening.riskLevel]}
                    </Txt>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(10), marginTop: s(10) }}>
                    <Txt size={17} weight="semi" color={colors.navy}>
                      {si.teacher.riskScore}
                    </Txt>
                    <Bar value={screening.riskScore} color={RISK_STYLE[screening.riskLevel].fg} soft={colors.sky} />
                    <Txt size={17} weight="black" color={colors.navy}>
                      {Math.round(screening.riskScore * 100)}%
                    </Txt>
                  </View>
                  {screening.reasons.length ? (
                    <View style={{ marginTop: s(8) }}>
                      <Txt size={17} weight="bold" color={colors.navy}>
                        {si.teacher.reasons}:
                      </Txt>
                      {screening.reasons.map((r) => (
                        <Txt key={r} size={16} weight="regular" color={colors.muted}>
                          • {r}
                        </Txt>
                      ))}
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: s(8),
                      marginTop: s(10),
                      backgroundColor: colors.sky,
                      borderRadius: s(14),
                      padding: s(10),
                    }}
                  >
                    <Ionicons name="arrow-forward-circle" size={s(26)} color={colors.blue} />
                    <Txt size={17} weight="bold" color={colors.header} style={{ flex: 1 }}>
                      {si.teacher.recommendation[screening.recommendation]}
                    </Txt>
                  </View>
                  {screening.source === 'demo' ? (
                    <Txt size={14} weight="regular" color={colors.muted} style={{ marginTop: s(6) }}>
                      {si.teacher.demoNote}
                    </Txt>
                  ) : null}
                </>
              )}
            </Section>

            <Section title={si.teacher.stage2}>
              {profile ? (
                <>
                  {/* the profile: group name(s) with a plain explanation */}
                  {profile.profile.map((p) => (
                    <View
                      key={p.group}
                      style={{
                        marginBottom: s(8),
                        padding: s(10),
                        borderRadius: s(14),
                        backgroundColor: p.group === 'unclassified' ? colors.sky : colors.amberSoft,
                      }}
                    >
                      <Txt size={18} weight="black" color={p.group === 'unclassified' ? colors.header : colors.amberDark}>
                        {p.name}
                      </Txt>
                      <Txt size={15} weight="semi" color={colors.navy}>
                        {p.explanation}
                      </Txt>
                    </View>
                  ))}
                  {/* each group's score */}
                  {profile.groups.map((g) => {
                    const c = areaColors[GROUP_AREA[g.group]];
                    return (
                      <View key={g.group} style={{ marginBottom: s(8) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Txt size={16} weight="bold" color={c.main}>
                            {g.name}
                          </Txt>
                          <Txt size={15} weight="bold" color={g.needsSupport ? colors.red : colors.green}>
                            {g.reason === 'speed' ? si.teacher.slowArea : g.needsSupport ? si.teacher.needsSupport : si.teacher.strength}
                          </Txt>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
                          <Bar value={g.accuracy ?? 0} color={c.main} soft={c.soft} />
                          <Txt size={15} weight="semi" color={colors.navy}>
                            {g.correct}/{g.total}
                          </Txt>
                        </View>
                      </View>
                    );
                  })}
                  <Txt size={13} weight="regular" color={colors.muted}>
                    {si.teacher.profileNote}
                  </Txt>
                </>
              ) : (
                <Txt size={17} weight="semi" color={colors.muted}>
                  {si.teacher.noResults}
                </Txt>
              )}
            </Section>

            <Section title={si.teacher.practice}>
              {(Object.keys(progress) as SkillArea[]).map((area) => (
                <View key={area} style={{ marginBottom: s(8) }}>
                  <Txt size={18} weight="bold" color={areaColors[area].main}>
                    {si.areas[area]}
                  </Txt>
                  <Txt size={16} weight="semi" color={colors.muted}>
                    {si.teacher.levelReached(progress[area].unlockedLevel)}
                  </Txt>
                </View>
              ))}
            </Section>
          </View>
        )}

        {/* on a solid pill so it stays readable over the busy garden background */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            gap: s(8),
            marginTop: s(12),
            backgroundColor: colors.white,
            borderRadius: s(20),
            borderWidth: s(2),
            borderColor: colors.skyBorder,
            paddingHorizontal: s(16),
            paddingVertical: s(4),
          }}
        >
          <Ionicons name="information-circle" size={s(24)} color={colors.blue} />
          <Txt size={16} weight="bold" color={colors.navy}>
            {si.teacher.disclaimer}
          </Txt>
        </View>
        <Pressable
          onPress={() => {
            reset();
            router.replace('/dyscalculia');
          }}
          accessibilityRole="button"
          style={{ alignSelf: 'center', marginTop: s(8), backgroundColor: colors.redSoft, borderRadius: s(20), paddingHorizontal: s(18) }}
        >
          <Txt size={17} weight="bold" color={colors.red}>
            {si.teacher.reset}
          </Txt>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
