// Intervention map (mockup 1): one card per skill area with 4 levels. Areas the Stage 2 profile
// marked as "needs support" are recommended first.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { AREA_ICON, Icon } from '@/components/dyscalculia/Icon';
import { CHARACTERS, Screen, StarPill } from '@/components/dyscalculia/kit';
import { si } from '@/constants/dyscalculia/strings.si';
import { areaColors, colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';
import { AREA_GROUP, type SkillArea } from '@/types/dyscalculia';
import { MAX_LEVEL } from '@/utils/dyscalculia/questions';

const AREAS: { area: SkillArea; character: number }[] = [
  { area: 'quantity', character: CHARACTERS.boyNumbers },
  { area: 'sequence', character: CHARACTERS.girlBlocks },
  { area: 'operations', character: CHARACTERS.boyBoard },
];

const openLevel = (area: SkillArea, level: number) =>
  router.push({ pathname: '/dyscalculia/practice/session', params: { area, level: String(level) } });

export default function PracticeMap() {
  const { s } = useU();
  const { stars, progress, profile } = useDyscalculia();
  // Areas whose Stage 2 group needs support are recommended first
  const needs = new Set(AREAS.filter(({ area }) => profile?.groups.find((g) => g.group === AREA_GROUP[area])?.needsSupport).map(({ area }) => area));

  return (
    <Screen
      scene="garden"
      layout="full"
      title={si.practice.title}
      onBack={() => router.replace('/dyscalculia')}
      right={<StarPill label={`${si.common.stars} ${stars}`} />}
    >
      <View style={{ flex: 1, flexDirection: 'row', gap: s(22), paddingHorizontal: s(20), paddingBottom: s(10) }}>
        {AREAS.map(({ area, character }) => {
          const p = progress[area];
          const c = areaColors[area];
          const earned = Object.values(p.stars).reduce((a, b) => a + b, 0);
          return (
            <View
              key={area}
              style={{
                flex: 1,
                backgroundColor: '#F8FBFF',
                borderRadius: s(32),
                borderWidth: s(5),
                borderColor: c.main,
                padding: s(16),
                justifyContent: 'space-between',
              }}
            >
              {/* title row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(12) }}>
                <Icon name={AREA_ICON[area]} size={s(78)} />
                <View style={{ flex: 1 }}>
                  <Txt size={29} weight="black" color={c.main} numberOfLines={1}>
                    {si.areas[area]}
                  </Txt>
                  <Txt size={16} weight="semi" color={colors.muted} numberOfLines={1}>
                    {si.practice.areaSub[area]}
                  </Txt>
                </View>
              </View>

              {/* character */}
              <View style={{ height: s(150), borderRadius: s(60), backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={character} style={{ height: s(150), width: '90%' }} resizeMode="contain" accessible={false} />
                {needs.has(area) ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: s(6),
                      left: s(10),
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: s(4),
                      backgroundColor: c.main,
                      borderRadius: s(16),
                      paddingHorizontal: s(10),
                    }}
                  >
                    <Ionicons name="star" size={s(16)} color={colors.white} />
                    <Txt size={15} weight="bold" color={colors.white}>
                      {si.practice.recommended}
                    </Txt>
                  </View>
                ) : null}
              </View>

              {/* levels */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((level) => {
                  const unlocked = level <= p.unlockedLevel;
                  const done = (p.stars[level] ?? 0) > 0;
                  return (
                    <Pressable
                      key={level}
                      disabled={!unlocked}
                      onPress={() => openLevel(area, level)}
                      accessibilityRole="button"
                      accessibilityLabel={`${si.areas[area]} ${si.practice.level(level)}`}
                      style={{
                        width: s(68),
                        height: s(68),
                        borderRadius: s(34),
                        backgroundColor: !unlocked ? c.soft : done ? colors.green : c.main,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!unlocked ? (
                        <Icon name="lock" size={s(34)} />
                      ) : done ? (
                        <Ionicons name="checkmark" size={s(40)} color={colors.white} />
                      ) : (
                        <Txt size={30} weight="black" color={colors.white}>
                          {level}
                        </Txt>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* progress */}
              <View style={{ height: s(14), borderRadius: s(7), backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${Math.max(8, (earned / (MAX_LEVEL * 3)) * 100)}%`, borderRadius: s(7), backgroundColor: c.main }} />
              </View>

              {/* footer */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: c.soft,
                  borderRadius: s(30),
                  paddingLeft: s(18),
                  height: s(58),
                }}
              >
                <Txt size={19} weight="semi" color={colors.navy}>
                  {si.practice.level(p.unlockedLevel)} ·{' '}
                </Txt>
                <Icon name="star" size={s(24)} />
                <Txt size={19} weight="bold" color={colors.navy} style={{ marginLeft: s(4), flex: 1 }}>
                  {earned}
                </Txt>
                <Pressable
                  onPress={() => openLevel(area, p.unlockedLevel)}
                  accessibilityRole="button"
                  accessibilityLabel={si.practice.level(p.unlockedLevel)}
                  style={{ width: s(58), height: s(58), borderRadius: s(29), backgroundColor: c.main, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="chevron-forward" size={s(34)} color={colors.white} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
