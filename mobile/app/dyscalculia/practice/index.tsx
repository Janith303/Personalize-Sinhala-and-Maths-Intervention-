// Intervention map: one path of 4 levels per skill area. Areas the Stage 2 profile marked as
// "needs support" are recommended first.
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AREA_ICON, Icon, StarRow } from '../../../components/dyscalculia/Icon';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { SiText, StarPill, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { areaColors, colors } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';
import type { SkillArea } from '../../../types/dyscalculia';
import { MAX_LEVEL } from '../../../utils/dyscalculia/questions';

const AREAS: SkillArea[] = ['quantity', 'sequence', 'operations'];

export default function PracticeMap() {
  const { stars, progress, profile } = useDyscalculia();
  const needs = new Set(profile?.filter((a) => a.needsSupport).map((a) => a.area));

  return (
    <View className="flex-1">
      <TopBar title={si.practice.title} onBack={() => router.replace('/dyscalculia')} right={<StarPill label={`${si.common.stars} ${stars}`} />} />
      <MathBackground>
        <View className="flex-1 flex-row p-4">
          {AREAS.map((area) => {
            const p = progress[area];
            const c = areaColors[area];
            const earned = Object.values(p.stars).reduce((a, b) => a + b, 0);
            return (
              <View key={area} className="mx-2 flex-1 justify-between rounded-3xl bg-white p-3" style={{ borderWidth: 3, borderColor: needs.has(area) ? c.main : colors.border }}>
                <View>
                  <View className="flex-row items-center">
                    <Icon name={AREA_ICON[area]} size={30} style={{ marginRight: 6 }} />
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
                            <Icon name="lock" size={22} />
                          ) : done ? (
                            <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>✓</Text>
                          ) : (
                            <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>{level}</Text>
                          )}
                        </View>
                        <View className="mt-0.5 h-3 flex-row">
                          <StarRow filled={p.stars[level] ?? 0} size={11} />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View>
                  <View className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: c.soft }}>
                    <View className="h-full rounded-full" style={{ width: `${(earned / (MAX_LEVEL * 3)) * 100}%`, backgroundColor: c.main }} />
                  </View>
                  <View className="mt-1 flex-row items-center">
                    <SiText style={{ fontSize: 12, color: colors.muted }}>{si.practice.level(p.unlockedLevel)} · </SiText>
                    <Icon name="star" size={12} style={{ marginRight: 3 }} />
                    <SiText style={{ fontSize: 12, color: colors.muted }}>{earned}</SiText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </MathBackground>
    </View>
  );
}
