import { copy, getAreaLabels } from '@lifewheeluz/shared';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LifeWheelChart } from '../components/LifeWheelChart';
import { ScorePickerSheet } from '../components/ScorePickerSheet';
import { useDraft } from '../hooks/useDataStore';

export function MyLifeScreen() {
  const { scores, locale, setScores } = useDraft(),
    t = copy[locale],
    labels = getAreaLabels(locale),
    [openArea, setOpenArea] = useState<number | null>(null),
    [draftScores, setDraftScores] = useState(scores),
    // Tracks which `scores` reference draftScores was last synced from, so
    // we can reset the local editing draft when it changes externally
    // (initial hydration, a Pro reconciliation load, or right after Save)
    // without reaching for an effect just to derive state from state.
    [syncedScores, setSyncedScores] = useState(scores);

  if (scores !== syncedScores) {
    setSyncedScores(scores);
    setDraftScores(scores);
  }

  const avg = (
    draftScores.reduce((a, b) => a + b, 0) / draftScores.length
  ).toFixed(1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.wheel}</Text>
        <Text style={styles.hint}>{t.wheelHint}</Text>

        <Card style={styles.section}>
          <LifeWheelChart labels={labels} scores={draftScores} />
        </Card>

        <View style={styles.avgRow}>
          <Text style={styles.avgLabel}>{t.avg}</Text>
          <Text style={styles.avgValue}>{avg}</Text>
        </View>

        <Card style={styles.section}>
          {labels.map((label, i) => (
            <Pressable
              key={label}
              onPress={() => setOpenArea(i)}
              style={styles.row}
            >
              <Text style={styles.rowLabel}>{label}</Text>
              <View style={styles.rowValue}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{draftScores[i]}</Text>
                </View>
                <Text style={styles.meaning} numberOfLines={1}>
                  {t.scoreMeanings[draftScores[i] - 1]}
                </Text>
                <ChevronDown size={16} color="#94a3a8" />
              </View>
            </Pressable>
          ))}
        </Card>

        <Button
          title={t.update}
          onPress={() => setScores(draftScores)}
          style={styles.saveButton}
        />
      </ScrollView>

      {openArea !== null && (
        <ScorePickerSheet
          visible
          label={labels[openArea]}
          value={draftScores[openArea]}
          meanings={t.scoreMeanings}
          onSelect={(value) => {
            const next = [...draftScores];
            next[openArea] = value;
            setDraftScores(next);
          }}
          onClose={() => setOpenArea(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7f3' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#1f2c28' },
  hint: { fontSize: 13, color: '#68766f', marginTop: 4 },
  section: { marginTop: 16 },
  avgRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  avgLabel: { fontSize: 13, color: '#68766f' },
  avgValue: { fontSize: 20, fontWeight: '800', color: '#1f2c28' },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f6f3',
  },
  rowLabel: { fontSize: 12, fontWeight: '600', color: '#68766f' },
  rowValue: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2f776a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  meaning: { flex: 1, fontSize: 14, color: '#1f2c28' },
  saveButton: { marginTop: 20 },
});
