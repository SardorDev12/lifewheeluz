import {
  childrenOf,
  colors,
  copy,
  effectiveProgress,
  getAreaLabels,
} from '@lifewheeluz/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GoalFormModal } from '../components/GoalFormModal';
import { useDraft } from '../hooks/useDataStore';
import type { GoalsStackParamList } from '../navigation/GoalsStack';

type Props = NativeStackScreenProps<GoalsStackParamList, 'GoalsList'>;

export function GoalsListScreen({ navigation }: Props) {
  const { scores, goals, locale, setGoals } = useDraft(),
    t = copy[locale],
    labels = getAreaLabels(locale),
    weakest = scores.indexOf(Math.min(...scores)),
    rootGoals = goals.filter((g) => g.parentId === null),
    [formOpen, setFormOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t.goals });
  }, [navigation, t.goals]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.count}>
            {rootGoals.length} {t.goalCount}
          </Text>
          <Button
            title={t.add}
            icon={<Plus size={16} color="#fff" />}
            onPress={() => setFormOpen(true)}
          />
        </View>

        {rootGoals.length === 0 ? (
          <Text style={styles.empty}>{t.noGoals}</Text>
        ) : (
          rootGoals.map((goal) => {
            const progress = effectiveProgress(goal, goals),
              subCount = childrenOf(goals, goal.id).length;
            return (
              <Pressable
                key={goal.id}
                onPress={() =>
                  navigation.navigate('GoalDetail', { goalId: goal.id })
                }
              >
                <Card style={styles.card}>
                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.areaTag,
                        { backgroundColor: `${colors[goal.area]}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.areaTagText,
                          { color: colors[goal.area] },
                        ]}
                      >
                        {labels[goal.area]}
                      </Text>
                    </View>
                    <Text style={styles.year}>{goal.year}</Text>
                  </View>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {subCount > 0 && (
                    <Text style={styles.subCount}>
                      {subCount} {t.subgoals}
                    </Text>
                  )}
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>{progress}%</Text>
                </Card>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <GoalFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        locale={locale}
        labels={labels}
        defaultAreaIndex={weakest}
        parent={null}
        onSubmit={({ title, area, year, note }) => {
          setGoals([
            ...goals,
            {
              id: crypto.randomUUID(),
              parentId: null,
              title,
              area,
              year,
              note,
              progress: 0,
            },
          ]);
          setFormOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7f3' },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  count: { fontSize: 13, color: '#68766f' },
  empty: { textAlign: 'center', color: '#94a3a8', marginTop: 40 },
  card: { marginBottom: 12 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  areaTagText: { fontSize: 10, fontWeight: '700' },
  year: { fontSize: 12, color: '#94a3a8' },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2c28',
    marginTop: 10,
  },
  subCount: { fontSize: 12, color: '#94a3a8', marginTop: 4 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#edf1ee',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#2f776a' },
  progressLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#2f776a',
  },
});
