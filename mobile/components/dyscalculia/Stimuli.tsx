// Pictures shown in the games: dots, shapes, faces, memory grid, number train and equations.
// Drawn with plain Views so no extra drawing library is needed.
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/dyscalculia/theme';
import type { FaceSpec, QuestionVisual, ShapeName } from '../../types/dyscalculia';
import { MEMORY_GRID } from '../../utils/dyscalculia/screeningTrials';
import { shuffle } from '../../utils/dyscalculia/random';
import { NumText } from './ui';

/** `count` dots scattered over a grid of slots (no overlaps). `seed` re-shuffles positions per question. */
export function DotField({
  count,
  width = 220,
  height = 150,
  dot = 22,
  color = colors.primaryLight,
  seed = 0,
}: {
  count: number;
  width?: number;
  height?: number;
  dot?: number;
  color?: string;
  seed?: number;
}) {
  const positions = useMemo(() => {
    const cols = 5;
    const rows = Math.max(4, Math.ceil(count / cols));
    const cw = width / cols;
    const ch = height / rows;
    const slots = shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, count);
    return slots.map((s) => ({
      left: (s % cols) * cw + (cw - dot) / 2 + (Math.random() - 0.5) * (cw - dot) * 0.6,
      top: Math.floor(s / cols) * ch + (ch - dot) / 2 + (Math.random() - 0.5) * (ch - dot) * 0.6,
    }));
    // seed is only used to force new positions for a new question
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, width, height, dot, seed]);
  return (
    <View style={{ width, height }}>
      {positions.map((p, i) => (
        <View
          key={i}
          style={{ position: 'absolute', left: p.left, top: p.top, width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }}
        />
      ))}
    </View>
  );
}

export function Shape({ name, size = 96, color = colors.purple }: { name: ShapeName; size?: number; color?: string }) {
  switch (name) {
    case 'circle':
      return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
    case 'square':
      return <View style={{ width: size * 0.9, height: size * 0.9, borderRadius: 6, backgroundColor: color }} />;
    case 'rectangle':
      return <View style={{ width: size * 1.4, height: size * 0.65, borderRadius: 6, backgroundColor: color }} />;
    case 'oval':
      return <View style={{ width: size * 1.4, height: size * 0.8, borderRadius: size, backgroundColor: color }} />;
    case 'diamond':
      return (
        <View
          style={{ width: size * 0.72, height: size * 0.72, borderRadius: 6, backgroundColor: color, transform: [{ rotate: '45deg' }] }}
        />
      );
    case 'triangle':
      return (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderBottomWidth: size * 0.86,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      );
  }
}

const SKIN = ['#F2C9A0', '#D9A06B', '#8D5A3B'];
const HAIR = '#3B2A1E';

export function Face({ spec, size = 120 }: { spec: FaceSpec; size?: number }) {
  const eyeY = size * 0.38;
  const eye = (left: number) => {
    const base = { position: 'absolute' as const, top: eyeY, left };
    if (spec.eyes === 2) return <View style={{ ...base, width: size * 0.14, height: 4, borderRadius: 2, backgroundColor: HAIR }} />;
    if (spec.eyes === 1)
      return (
        <View
          style={{
            ...base,
            top: eyeY - size * 0.05,
            width: size * 0.15,
            height: size * 0.12,
            borderRadius: size,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: size * 0.06, height: size * 0.06, borderRadius: size, backgroundColor: HAIR }} />
        </View>
      );
    return <View style={{ ...base, top: eyeY - size * 0.03, width: size * 0.09, height: size * 0.09, borderRadius: size, backgroundColor: HAIR }} />;
  };
  const mouthTop = size * 0.62;
  let mouth;
  if (spec.mouth === 0)
    mouth = (
      <View
        style={{
          position: 'absolute',
          top: mouthTop - size * 0.08,
          left: size * 0.32,
          width: size * 0.36,
          height: size * 0.18,
          borderBottomWidth: 4,
          borderBottomLeftRadius: size,
          borderBottomRightRadius: size,
          borderColor: '#A3333D',
        }}
      />
    );
  else if (spec.mouth === 1)
    mouth = <View style={{ position: 'absolute', top: mouthTop + 4, left: size * 0.34, width: size * 0.32, height: 4, borderRadius: 2, backgroundColor: '#A3333D' }} />;
  else
    mouth = <View style={{ position: 'absolute', top: mouthTop - 2, left: size * 0.41, width: size * 0.18, height: size * 0.16, borderRadius: size, backgroundColor: '#A3333D' }} />;

  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: SKIN[spec.skin] }} />
      {spec.hair === 1 ? (
        <View
          style={{ position: 'absolute', top: -2, left: size * 0.12, width: size * 0.76, height: size * 0.26, borderTopLeftRadius: size, borderTopRightRadius: size, backgroundColor: HAIR }}
        />
      ) : null}
      {spec.hair === 2 ? (
        <>
          <View style={{ position: 'absolute', top: size * 0.12, left: -4, width: size * 0.2, height: size * 0.45, borderRadius: size, backgroundColor: HAIR }} />
          <View style={{ position: 'absolute', top: size * 0.12, right: -4, width: size * 0.2, height: size * 0.45, borderRadius: size, backgroundColor: HAIR }} />
        </>
      ) : null}
      {eye(size * 0.26)}
      {eye(size * 0.6)}
      {mouth}
    </View>
  );
}

/** 4 x 4 grid. Shows stars in `stars` cells, or highlights the `probe` cell. */
export function MemoryGrid({ stars = [], probe, cell = 46 }: { stars?: number[]; probe?: number; cell?: number }) {
  return (
    <View style={{ width: cell * MEMORY_GRID + 8 * MEMORY_GRID, flexDirection: 'row', flexWrap: 'wrap' }}>
      {Array.from({ length: MEMORY_GRID * MEMORY_GRID }, (_, i) => (
        <View
          key={i}
          style={{
            width: cell,
            height: cell,
            margin: 4,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: i === probe ? colors.amberSoft : colors.white,
            borderWidth: i === probe ? 4 : 2,
            borderColor: i === probe ? colors.amber : colors.border,
          }}
        >
          {stars.includes(i) ? <Text style={{ fontSize: cell * 0.55 }}>⭐</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function NumberTrain({ items, car = 58 }: { items: (number | null)[]; car?: number }) {
  return (
    <View className="flex-row items-end">
      <View
        className="mr-1 items-center justify-center"
        style={{ width: car + 6, height: car + 10, backgroundColor: colors.primary, borderTopLeftRadius: 12, borderTopRightRadius: 24, borderRadius: 8 }}
      >
        <Text style={{ fontSize: car * 0.5 }}>🚂</Text>
      </View>
      {items.map((n, i) => (
        <View
          key={i}
          className="mx-1 items-center justify-center rounded-lg"
          style={{
            width: car,
            height: car * 0.86,
            backgroundColor: n == null ? colors.white : colors.primaryLight,
            borderWidth: n == null ? 3 : 0,
            borderStyle: n == null ? 'dashed' : 'solid',
            borderColor: colors.primaryLight,
          }}
        >
          <NumText style={{ fontSize: car * 0.46, color: n == null ? colors.primaryLight : colors.white }}>{n ?? '?'}</NumText>
        </View>
      ))}
    </View>
  );
}

export function EquationCard({ text, size = 46 }: { text: string; size?: number }) {
  return (
    <View className="rounded-3xl bg-white px-10 py-3" style={{ borderWidth: 3, borderColor: colors.primaryLight }}>
      <NumText style={{ fontSize: size, letterSpacing: 2 }}>{text}</NumText>
    </View>
  );
}

export function QuestionVisualView({ visual, seed }: { visual: QuestionVisual; seed: number }) {
  switch (visual.type) {
    case 'dots':
      return (
        <View className="rounded-3xl bg-white p-3" style={{ borderWidth: 3, borderColor: colors.primaryLight }}>
          <DotField count={visual.count} seed={seed} width={260} height={visual.count > 10 ? 150 : 120} />
        </View>
      );
    case 'compareDots':
      return (
        <View className="flex-row">
          {[visual.left, visual.right].map((c, i) => (
            <View key={i} className="mx-3 rounded-3xl bg-white p-3" style={{ borderWidth: 3, borderColor: i ? colors.pink : colors.amber }}>
              <DotField count={c} seed={seed + i} width={190} height={130} dot={18} color={i ? colors.pink : colors.amber} />
            </View>
          ))}
        </View>
      );
    case 'train':
      return <NumberTrain items={visual.items} />;
    case 'equation':
      return <EquationCard text={visual.text} />;
  }
}
