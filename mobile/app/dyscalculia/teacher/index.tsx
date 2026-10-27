// Teacher / parent view behind a PIN: Stage 1 risk with reasons, Stage 2 profile and practice progress.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { BigButton, Card, SiText, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { areaColors, colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import type { RiskLevel, SkillArea } from '../../../types/dyscalculia';

// Demo PIN until the shared auth flow provides teacher accounts.
const TEACHER_PIN = '1234';

const RISK_STYLE: Record<RiskLevel, { bg: string; fg: string }> = {
  elevated: { bg: colors.redSoft, fg: colors.red },
  general: { bg: colors.amberSoft, fg: '#854F0B' },
  low: { bg: colors.greenSoft, fg: colors.green },
};

function Bar({ value, color, soft }: { value: number; color: string; soft: string }) {
  return (
    <View className="h-3 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: soft }}>
      <View className="h-full rounded-full" style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }} />
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <SiText weight="bold" style={{ fontSize: 16, color: colors.primary, marginBottom: 6 }}>
      {children}
    </SiText>
  );
}

export default function TeacherReport() {
  const { childName, screening, profile, progress, reset } = useDyscalculia();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  if (!unlocked) {
    return (
      <View className="flex-1">
        <TopBar title={si.teacher.title} />
        <MathBackground>
          <View className="flex-1 items-center justify-center">
            <Card className="items-center" style={{ width: 340 }}>
              <SiText weight="bold" style={{ fontSize: 18 }}>
                🔐 {si.teacher.pinPrompt}
              </SiText>
              <TextInput
                value={pin}
                onChangeText={(t) => {
                  setPin(t.replace(/\D/g, '').slice(0, 4));
                  setWrong(false);
                }}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                accessibilityLabel={si.teacher.pinPrompt}
                className="my-3 w-40 rounded-2xl py-2 text-center"
                style={{ fontSize: 26, letterSpacing: 10, color: colors.ink, backgroundColor: colors.page, borderWidth: 2, borderColor: wrong ? colors.red : colors.border }}
              />
              {wrong ? <SiText style={{ color: colors.red, fontSize: 13, marginBottom: 6 }}>{si.teacher.wrongPin}</SiText> : null}
              <BigButton
                label={si.teacher.open}
                onPress={() => (pin === TEACHER_PIN ? setUnlocked(true) : setWrong(true))}
              />
              <SiText style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>{si.teacher.pinHint}</SiText>
            </Card>
          </View>
        </MathBackground>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <TopBar title={`${si.teacher.title}${childName ? ` · ${childName}` : ''}`} />
      <ScrollView style={{ backgroundColor: colors.page }} contentContainerStyle={{ padding: 14 }}>
        {!screening ? (
          <Card className="items-center">
            <SiText style={{ fontSize: 16 }}>{si.teacher.noResults}</SiText>
          </Card>
        ) : (
          <View className="flex-row">
            {/* Stage 1 */}
            <Card className="mr-3 flex-1">
              <SectionTitle>{si.teacher.stage1}</SectionTitle>
              <View className="self-start rounded-full px-3 py-1" style={{ backgroundColor: RISK_STYLE[screening.riskLevel].bg }}>
                <SiText weight="bold" style={{ color: RISK_STYLE[screening.riskLevel].fg, fontSize: 14 }}>
                  {si.teacher.risk[screening.riskLevel]}
                </SiText>
              </View>
              <View className="mt-3 flex-row items-center">
                <SiText style={{ fontSize: 13, marginRight: 8 }}>{si.teacher.riskScore}</SiText>
                <Bar value={screening.riskScore} color={RISK_STYLE[screening.riskLevel].fg} soft={colors.sky} />
                <SiText weight="bold" style={{ fontSize: 13, marginLeft: 8 }}>
                  {Math.round(screening.riskScore * 100)}%
                </SiText>
              </View>
              {screening.reasons.length ? (
                <View className="mt-3">
                  <SiText weight="medium" style={{ fontSize: 13 }}>
                    {si.teacher.reasons}:
                  </SiText>
                  {screening.reasons.map((r) => (
                    <SiText key={r} style={{ fontSize: 13, color: colors.muted }}>
                      • {r}
                    </SiText>
                  ))}
                </View>
              ) : null}
              <View className="mt-3 rounded-xl p-2" style={{ backgroundColor: colors.sky }}>
                <SiText weight="medium" style={{ fontSize: 13, color: colors.primary }}>
                  ➜ {si.teacher.recommendation[screening.recommendation]}
                </SiText>
              </View>
              {screening.source === 'demo' ? (
                <SiText style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>{si.teacher.demoNote}</SiText>
              ) : null}
            </Card>

            {/* Stage 2 */}
            <Card className="mr-3 flex-1">
              <SectionTitle>{si.teacher.stage2}</SectionTitle>
              {profile ? (
                profile.map((a) => (
                  <View key={a.area} className="mb-3">
                    <View className="flex-row justify-between">
                      <SiText weight="medium" style={{ fontSize: 13, color: areaColors[a.area].main }}>
                        {si.areas[a.area]}
                      </SiText>
                      <SiText style={{ fontSize: 12, color: a.needsSupport ? colors.red : colors.green }}>
                        {a.needsSupport ? si.teacher.needsSupport : si.teacher.strength}
                      </SiText>
                    </View>
                    <View className="mt-1 flex-row items-center">
                      <Bar value={a.accuracy} color={areaColors[a.area].main} soft={areaColors[a.area].soft} />
                      <SiText style={{ fontSize: 12, marginLeft: 6 }}>
                        {a.correct}/{a.total}
                      </SiText>
                    </View>
                  </View>
                ))
              ) : (
                <SiText style={{ fontSize: 13, color: colors.muted }}>{si.teacher.noResults}</SiText>
              )}
            </Card>

            {/* Practice */}
            <Card className="flex-1">
              <SectionTitle>{si.teacher.practice}</SectionTitle>
              {(Object.keys(progress) as SkillArea[]).map((area) => (
                <View key={area} className="mb-3">
                  <SiText weight="medium" style={{ fontSize: 13, color: areaColors[area].main }}>
                    {si.areas[area]}
                  </SiText>
                  <SiText style={{ fontSize: 12, color: colors.muted }}>{si.teacher.levelReached(progress[area].unlockedLevel)}</SiText>
                </View>
              ))}
            </Card>
          </View>
        )}

        <SiText style={{ fontSize: 12, color: colors.muted, marginTop: 10, textAlign: 'center' }}>⚠ {si.teacher.disclaimer}</SiText>
        <Pressable
          onPress={() => {
            reset();
            router.replace('/dyscalculia');
          }}
          accessibilityRole="button"
          className="mt-3 self-center rounded-full px-4 py-1.5"
          style={{ backgroundColor: colors.redSoft }}
        >
          <SiText weight="medium" style={{ fontSize: 13, color: colors.red }}>
            {si.teacher.reset}
          </SiText>
        </Pressable>
      </ScrollView>
    </View>
  );
}
