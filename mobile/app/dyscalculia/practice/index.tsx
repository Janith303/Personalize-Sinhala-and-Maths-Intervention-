// Intervention map: one path of 4 levels per skill area. Areas the Stage 2 profile marked as
// "needs support" are recommended first.
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { SiText, StarPill, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { areaColors, colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import type { SkillArea } from '../../../types/dyscalculia';
import { MAX_LEVEL } from '../../../utils/dyscalculia/questions';

const AREAS: { area: SkillArea; icon: string }[] = [
  { area: 'quantity', icon: '🔵' },
  { area: 'sequence', icon: '🚂' },
  { area: 'operations', icon: '➕' },
];

export default function PracticeMap() {
  const { stars, progress, profile } = useDyscalculia();
  const needs = new Set(profile?.filter((a) => a.needsSupport).map((a) => a.area));

  return (
    <View className="flex-1">
      <TopBar title={si.practice.title} onBack={() => router.replace('/dyscalculia')} right={<StarPill label={`${si.common.stars} ${stars}`} />} />
      <MathBackground>
        <View className="flex-1 flex-row p-4">
          {AREAS.map(({ area, icon }) => {
            const p = progress[area];
            const c = areaColors[area];
            const earned = Object.values(p.stars).reduce((a, b) => a + b, 0);
            return (
              <View key={area} className="mx-2 flex-1 justify-between rounded-3xl bg-white p-3" style={{ borderWidth: 3, borderColor: needs.has(area) ? c.main : colors.border }}>
                <View>
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 24, marginRight: 6 }}>{icon}</Text>
                    <SiText weight="bold" style={{ fontSize: 17, color: c.main }}>
                      {si.areas[area]}
                    </SiText>
                  </View>
                  {needs.has(area) ? (
                    <View className="mt-1 self-start rounded-full px-2 py-0.5" style={{ backgroundColor: c.soft }}>
                      <SiText weight="medium" style={{ fontSize: 12, color: c.main }}>
                        ★ {si.practice.recommended}
                      </SiText>
                    </View>
                  ) : null}
                </View>

                <View className="my-2 flex-row justify-between">
                  {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((level) => {
                    const unlocked = level <= p.unlockedLevel;
                    const done = (p.stars[level] ?? 0) > 0;
                    return (
                      <Pressable
                        key={level}
                        disabled={!unlocked}
                        accessibilityRole="button"
                        accessibilityLabel={`${si.areas[area]} ${si.practice.level(level)}`}
                        onPress={() => router.push({ pathname: '/dyscalculia/practice/session', params: { area, level: String(level) } })}
                        className="items-center"
                      >
                        <View
                          className="h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: !unlocked ? c.soft : done ? colors.green : c.main }}
                        >
                          {!unlocked ? (
                            <Text style={{ fontSize: 18 }}>🔒</Text>
                          ) : done ? (
                            <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>✓</Text>
                          ) : (
                            <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>{level}</Text>
                          )}
                        </View>
                        <Text style={{ fontSize: 11, marginTop: 2 }}>{'⭐'.repeat(p.stars[level] ?? 0) || ' '}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View>
                  <View className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: c.soft }}>
                    <View className="h-full rounded-full" style={{ width: `${(earned / (MAX_LEVEL * 3)) * 100}%`, backgroundColor: c.main }} />
                  </View>
                  <SiText style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                    {si.practice.level(p.unlockedLevel)} · ⭐ {earned}
                  </SiText>
                </View>
              </View>
            );
          })}
        </View>
      </MathBackground>
    </View>
  );
}
