// Pictures shown in the games: equations, dots, shapes, faces, memory grid and number train.
// Drawn with plain Views; sizes are design pixels scaled with useU().
import { useMemo } from 'react';
import { Text, View, type TextStyle } from 'react-native';

import { useU } from '@/components/common/layout';
import { colors } from '@/constants/dyscalculia/theme';
import type { FaceSpec, QuestionVisual, ShapeName } from '@/types/dyscalculia';
import { shuffle } from '@/utils/dyscalculia/random';
import { MEMORY_GRID } from '@/utils/dyscalculia/screeningTrials';
import { Icon } from './Icon';

/** Big bold number / symbol text. */
function Num({ size, color = colors.navy, style, children }: { size: number; color?: string; style?: TextStyle; children: React.ReactNode }) {
  const { s } = useU();
  return <Text style={[{ fontSize: s(size), lineHeight: s(size * 1.18), fontWeight: '900', color }, style]}>{children}</Text>;
}

/** Light-blue rounded box (numbers and equations). */
export function NumberBox({ children, width, height }: { children: React.ReactNode; width?: number; height: number }) {
  const { s } = useU();
  return (
    <View
      style={{
        width: width ? s(width) : undefined,
        height: s(height),
        paddingHorizontal: width ? 0 : s(46),
        borderRadius: s(26),
        backgroundColor: colors.sky,
        borderWidth: s(4),
        borderColor: '#5AA6EE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s(18),
      }}
    >
      {children}
    </View>
  );
}

/** "4 + 1 = 5": numbers navy, operators blue, the shown answer purple. */
export function Equation({ parts, size = 92 }: { parts: (string | number)[]; size?: number }) {
  return (
    <NumberBox height={size * 1.55}>
      {parts.map((p, i) => {
        const op = typeof p === 'string' && /^[+−×÷=?]$/.test(p) && p !== '?';
        const last = i === parts.length - 1;
        return (
          <Num key={i} size={size} color={op ? '#2E8BEF' : last ? colors.purple : colors.navy}>
            {p}
          </Num>
        );
      })}
    </NumberBox>
  );
}

/** `count` dots scattered over a grid of slots (no overlaps). `seed` re-shuffles positions per question. */
export function DotField({
  count,
  width = 300,
  height = 170,
  dot = 46,
  color = colors.amber,
  seed = 0,
}: {
  count: number;
  width?: number;
  height?: number;
  dot?: number;
  color?: string;
  seed?: number;
}) {
  const { s } = useU();
  const positions = useMemo(() => {
    const cols = count <= 6 ? 3 : 5;
    const rows = Math.max(2, Math.ceil(count / cols));
    const cw = width / cols;
    const ch = height / rows;
    const slots = shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, count);
    const d = Math.min(dot, cw * 0.8, ch * 0.8);
    return slots.map((sl) => ({
      d,
      left: (sl % cols) * cw + (cw - d) / 2 + (Math.random() - 0.5) * (cw - d) * 0.5,
      top: Math.floor(sl / cols) * ch + (ch - d) / 2 + (Math.random() - 0.5) * (ch - d) * 0.5,
    }));
    // seed only forces new positions for a new question
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, width, height, dot, seed]);
  return (
    <View style={{ width: s(width), height: s(height) }}>
      {positions.map((p, i) => (
        <View
          key={i}
          style={{ position: 'absolute', left: s(p.left), top: s(p.top), width: s(p.d), height: s(p.d), borderRadius: s(p.d), backgroundColor: color }}
        />
      ))}
    </View>
  );
}

/** Cream box with an orange border holding dots. */
export function DotBox({ count, seed, width = 330, height = 190, color = colors.amber, border = colors.amber }: { count: number; seed: number; width?: number; height?: number; color?: string; border?: string }) {
  const { s } = useU();
  return (
    <View style={{ padding: s(14), borderRadius: s(26), backgroundColor: '#FFF8EA', borderWidth: s(4), borderColor: border }}>
      <DotField count={count} seed={seed} width={width} height={height} color={color} />
    </View>
  );
}

export function Shape({ name, size = 120, color = colors.purple }: { name: ShapeName; size?: number; color?: string }) {
  const { s } = useU();
  const z = s(size);
  switch (name) {
    case 'circle':
      return <View style={{ width: z, height: z, borderRadius: z / 2, backgroundColor: color }} />;
    case 'square':
      return <View style={{ width: z * 0.9, height: z * 0.9, borderRadius: s(8), backgroundColor: color }} />;
    case 'rectangle':
      return <View style={{ width: z * 1.4, height: z * 0.65, borderRadius: s(8), backgroundColor: color }} />;
    case 'oval':
      return <View style={{ width: z * 1.4, height: z * 0.8, borderRadius: z, backgroundColor: color }} />;
    case 'diamond':
      return <View style={{ width: z * 0.72, height: z * 0.72, borderRadius: s(8), backgroundColor: color, transform: [{ rotate: '45deg' }] }} />;
    case 'triangle':
      return (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: z / 2,
            borderRightWidth: z / 2,
            borderBottomWidth: z * 0.86,
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
const LIPS = '#A3333D';

export function Face({ spec, size = 150 }: { spec: FaceSpec; size?: number }) {
  const { s } = useU();
  const z = s(size);
  const eyeY = z * 0.38;
  const eye = (left: number) => {
    const base = { position: 'absolute' as const, top: eyeY, left };
    if (spec.eyes === 2) return <View style={{ ...base, width: z * 0.14, height: Math.max(3, z * 0.03), borderRadius: 2, backgroundColor: HAIR }} />;
    if (spec.eyes === 1)
      return (
        <View
          style={{ ...base, top: eyeY - z * 0.05, width: z * 0.15, height: z * 0.12, borderRadius: z, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ width: z * 0.06, height: z * 0.06, borderRadius: z, backgroundColor: HAIR }} />
        </View>
      );
    return <View style={{ ...base, top: eyeY - z * 0.03, width: z * 0.09, height: z * 0.09, borderRadius: z, backgroundColor: HAIR }} />;
  };
  const mouthTop = z * 0.62;
  const mouth =
    spec.mouth === 0 ? (
      <View
        style={{
          position: 'absolute',
          top: mouthTop - z * 0.08,
          left: z * 0.32,
          width: z * 0.36,
          height: z * 0.18,
          borderBottomWidth: Math.max(3, z * 0.03),
          borderBottomLeftRadius: z,
          borderBottomRightRadius: z,
          borderColor: LIPS,
        }}
      />
    ) : spec.mouth === 1 ? (
      <View style={{ position: 'absolute', top: mouthTop + 4, left: z * 0.34, width: z * 0.32, height: Math.max(3, z * 0.03), borderRadius: 2, backgroundColor: LIPS }} />
    ) : (
      <View style={{ position: 'absolute', top: mouthTop - 2, left: z * 0.41, width: z * 0.18, height: z * 0.16, borderRadius: z, backgroundColor: LIPS }} />
    );
  return (
    <View style={{ width: z, height: z }}>
      <View style={{ position: 'absolute', width: z, height: z, borderRadius: z / 2, backgroundColor: SKIN[spec.skin] }} />
      {spec.hair === 1 ? (
        <View
          style={{ position: 'absolute', top: -2, left: z * 0.12, width: z * 0.76, height: z * 0.26, borderTopLeftRadius: z, borderTopRightRadius: z, backgroundColor: HAIR }}
        />
      ) : null}
      {spec.hair === 2 ? (
        <>
          <View style={{ position: 'absolute', top: z * 0.12, left: -4, width: z * 0.2, height: z * 0.45, borderRadius: z, backgroundColor: HAIR }} />
          <View style={{ position: 'absolute', top: z * 0.12, right: -4, width: z * 0.2, height: z * 0.45, borderRadius: z, backgroundColor: HAIR }} />
        </>
      ) : null}
      {eye(z * 0.26)}
      {eye(z * 0.6)}
      {mouth}
    </View>
  );
}

/** White rounded box holding a shape or face. */
export function PictureBox({ children }: { children: React.ReactNode }) {
  const { s } = useU();
  return (
    <View
      style={{
        width: s(240),
        height: s(200),
        borderRadius: s(26),
        backgroundColor: colors.white,
        borderWidth: s(4),
        borderColor: colors.skyBorder,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

/** 4 x 4 grid. Shows stars in `stars` cells, or highlights the `probe` cell. */
export function MemoryGrid({ stars = [], probe, cell = 52 }: { stars?: number[]; probe?: number; cell?: number }) {
  const { s } = useU();
  const c = s(cell);
  return (
    <View style={{ width: (c + s(10)) * MEMORY_GRID, flexDirection: 'row', flexWrap: 'wrap' }}>
      {Array.from({ length: MEMORY_GRID * MEMORY_GRID }, (_, i) => (
        <View
          key={i}
          style={{
            width: c,
            height: c,
            margin: s(5),
            borderRadius: s(12),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: i === probe ? colors.amberSoft : colors.white,
            borderWidth: s(i === probe ? 5 : 3),
            borderColor: i === probe ? colors.amber : colors.skyDash,
          }}
        >
          {stars.includes(i) ? <Icon name="star" size={c * 0.72} /> : null}
        </View>
      ))}
    </View>
  );
}

export function NumberTrain({ items, car = 84 }: { items: (number | null)[]; car?: number }) {
  const { s } = useU();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Icon name="train" size={s(car * 1.35)} style={{ marginRight: s(4) }} />
      {items.map((n, i) => (
        <View
          key={i}
          style={{
            width: s(car),
            height: s(car * 0.9),
            marginHorizontal: s(5),
            borderRadius: s(14),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: n == null ? colors.white : [colors.green, colors.blue, colors.pink, colors.amber, colors.purple][i % 5],
            borderWidth: n == null ? s(4) : 0,
            borderStyle: n == null ? 'dashed' : 'solid',
            borderColor: colors.navy,
          }}
        >
          <Num size={car * 0.5} color={n == null ? colors.navy : colors.white}>
            {n ?? '?'}
          </Num>
        </View>
      ))}
    </View>
  );
}

/** 0..max number line with a tick per number; only the ends (and the middle for 0-20) are labelled.
 *  An arrow above points at `value`. */
export function NumberLine({ max, value, width = 620 }: { max: number; value: number; width?: number }) {
  const { s } = useU();
  const pad = 34;
  const x = (n: number) => s(pad + ((width - 2 * pad) * n) / max);
  const labelled = max === 20 ? [0, 10, 20] : [0, max];
  return (
    <View style={{ width: s(width), height: s(190), borderRadius: s(26), backgroundColor: colors.sky, borderWidth: s(4), borderColor: '#5AA6EE' }}>
      {/* arrow */}
      <View style={{ position: 'absolute', left: x(value) - s(22), top: s(14), alignItems: 'center', width: s(44) }}>
        <View style={{ width: s(12), height: s(34), borderRadius: s(6), backgroundColor: colors.red }} />
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: s(20),
            borderRightWidth: s(20),
            borderTopWidth: s(24),
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: colors.red,
          }}
        />
      </View>
      {/* line */}
      <View style={{ position: 'absolute', left: x(0), width: x(max) - x(0), top: s(92), height: s(6), borderRadius: s(3), backgroundColor: colors.navy }} />
      {Array.from({ length: max + 1 }, (_, n) => {
        const big = labelled.includes(n);
        return (
          <View key={n} style={{ position: 'absolute', left: x(n) - s(2), top: s(big ? 78 : 84), width: s(4), height: s(big ? 34 : 22), backgroundColor: colors.navy }} />
        );
      })}
      {labelled.map((n) => (
        <View key={`l${n}`} style={{ position: 'absolute', left: x(n) - s(30), top: s(116), width: s(60), alignItems: 'center' }}>
          <Num size={40}>{n}</Num>
        </View>
      ))}
    </View>
  );
}

/** Visual for a Stage 2 / practice question. */
export function QuestionVisualView({ visual, seed }: { visual: QuestionVisual; seed: number }) {
  const { s } = useU();
  switch (visual.type) {
    case 'dots':
      return <DotBox count={visual.count} seed={seed} width={visual.count > 10 ? 420 : 340} height={visual.count > 10 ? 190 : 160} color={colors.blue} border="#5AA6EE" />;
    case 'compareDots':
      return (
        <View style={{ flexDirection: 'row', gap: s(26) }}>
          <DotBox count={visual.left} seed={seed} width={250} height={170} color={colors.amber} border={colors.amber} />
          <DotBox count={visual.right} seed={seed + 1} width={250} height={170} color={colors.pink} border={colors.pink} />
        </View>
      );
    case 'train':
      return <NumberTrain items={visual.items} />;
    case 'equation':
      return <Equation parts={visual.text.split(/\s+/).filter(Boolean)} size={80} />;
    case 'numberLine':
      return <NumberLine max={visual.max} value={visual.value} />;
  }
}
