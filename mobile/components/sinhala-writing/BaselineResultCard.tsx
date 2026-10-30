import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BaselineResult, WordStatus } from '../../services/sinhala_writing/baselineApi';

const WORD_ICON: Record<WordStatus, string> = { on_line: '✅', above: '⬆️', below: '⬇️' };

type Props = {
  result: BaselineResult;
  onRetry: () => void;
  onNext?: () => void;
};

export default function BaselineResultCard({ result, onRetry, onNext }: Props) {
  const good = result.is_correct;
  return (
    <View style={styles.card}>
      <View style={[styles.verdict, good ? styles.good : styles.bad]}>
        <Text style={styles.verdictIcon}>{good ? '✅' : '❌'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.verdictText}>{result.message}</Text>
        </View>
      </View>

      {/* scrolls when there are many words on a small landscape screen */}
      <ScrollView style={styles.scroll} contentContainerStyle={{ gap: 8 }}>
        {result.annotated_image && (
          <Image source={{ uri: result.annotated_image }} style={styles.image} resizeMode="contain" />
        )}

        {result.words.map((word) => (
          <Text key={word.index} style={styles.word}>
            {WORD_ICON[word.status]}  {word.message}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.retry]} onPress={onRetry}>
          <Text style={styles.retryText}>🔄 නැවත උත්සාහ කරන්න</Text>
        </Pressable>
        {onNext && (
          <Pressable style={[styles.button, styles.next]} onPress={onNext}>
            <Text style={styles.nextText}>ඊළඟ ➡️</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexShrink: 1, backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: 16, gap: 12 },
  scroll: { flexShrink: 1 },
  verdict: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 14, gap: 12 },
  good: { backgroundColor: '#E3F4E6' },
  bad: { backgroundColor: '#FDE7E7' },
  verdictIcon: { fontSize: 34 },
  verdictText: { fontSize: 20, fontWeight: '700', color: '#1F3B2A' },
  image: { width: '100%', aspectRatio: 4, borderRadius: 12, backgroundColor: '#EEE' },
  word: { fontSize: 17, color: '#333' },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  button: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  retry: { backgroundColor: '#E3F4E6' },
  retryText: { fontSize: 16, fontWeight: '600', color: '#2E7D46' },
  next: { backgroundColor: '#2E7D46' },
  nextText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});