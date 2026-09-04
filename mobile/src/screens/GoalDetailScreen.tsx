import {
  childrenOf,
  colors,
  copy,
  descendantIds,
  effectiveProgress,
  getAreaLabels,
} from '@lifewheeluz/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ChevronRight, Plus, Trash2 } from 'lucide-react-native';
import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GoalFormModal } from '../components/GoalFormModal';
import { useDraft } from '../hooks/useDataStore';
import type { GoalsStackParamList } from '../navigation/GoalsStack';

type Props = NativeStackScreenProps<GoalsStackParamList, 'GoalDetail'>;

export function GoalDetailScreen({ route, navigation }: Props) {
  const { goals, locale, setGoals } = useDraft(),
    t = copy[locale],
    labels = getAreaLabels(locale),
    goal = goals.find((g) => g.id === route.params.goalId),
    [formOpen, setFormOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: goal?.title ?? '' });
  }, [navigation, goal?.title]);

  if (!goal) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.empty}>{t.noGoals}</Text>
      </SafeAreaView>
    );
  }

  const subgoals = childrenOf(goals, goal.id),
    isLeaf = subgoals.length === 0,
    progress = effectiveProgress(goal, goals);

  function toggleDone() {
    if (!goal) return;
    const done = goal.progress !== 100;
    setGoals(
      goals.map((g) =>
        g.id === goal.id ? { ...g, progress: done ? 100 : 0 } : g,
      ),
    );
  }

  function handleDelete() {
    if (!goal) return;
    const removeIds = new Set([goal.id, ...descendantIds(goals, goal.id)]);
    setGoals(goals.filter((g) => !removeIds.has(g.id)));
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.areaTag,
            {
              backgroundColor: `${colors[goal.area]}20`,
              alignSelf: 'flex-start',
            },
          ]}
        >
          <Text style={[styles.areaTagText, { color: colors[goal.area] }]}>
            {labels[goal.area]}
          </Text>
        </View>
        <Text style={styles.title}>{goal.title}</Text>
        {goal.note ? <Text style={styles.note}>{goal.note}</Text> : null}

        <Card style={styles.section}>
          {isLeaf ? (
            <Pressable style={styles.checkboxRow} onPress={toggleDone}>
              <View
                style={[
                  styles.checkbox,
                  goal.progress === 100 && styles.checkboxDone,
                ]}
              >
                {goal.progress === 100 && <Check size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>{t.markDone}</Text>
            </Pressable>
          ) : (
            <View>
              <Text style={styles.progressBig}>{progress}%</Text>
              <Text style={styles.hint}>{t.autoProgressHint}</Text>
            </View>
          )}
        </Card>

        <View style={styles.subHeader}>
          <Text style={styles.sectionTitle}>{t.subgoalsTitle}</Text>
          <Pressable onPress={() => setFormOpen(true)} style={styles.addLink}>
            <Plus size={14} color="#2f776a" />
            <Text style={styles.addLinkText}>{t.addSubgoal}</Text>
          </Pressable>
        </View>

        {subgoals.length === 0 ? (
          <Text style={styles.hint}>{t.noSubgoals}</Text>
        ) : (
          subgoals.map((sub) => {
            const subKids = childrenOf(goals, sub.id),
              subIsLeaf = subKids.length === 0,
              subProgress = effectiveProgress(sub, goals);
            return (
              <Pressable
                key={sub.id}
                onPress={() =>
                  navigation.push('GoalDetail', { goalId: sub.id })
                }
              >
                <Card style={styles.subCard}>
                  <View style={styles.subCardLeft}>
                    {subIsLeaf ? (
                      <View
                        style={[
                          styles.miniCheckbox,
                          sub.progress === 100 && styles.checkboxDone,
                        ]}
                      >
                        {sub.progress === 100 && (
                          <Check size={12} color="#fff" />
                        )}
                      </View>
                    ) : (
                      <Text style={styles.miniPercent}>{subProgress}%</Text>
                    )}
                    <Text style={styles.subTitle} numberOfLines={1}>
                      {sub.title}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#94a3a8" />
                </Card>
              </Pressable>
            );
          })
        )}

        <Button
          title={t.delete}
          variant="outline"
          icon={<Trash2 size={16} color="#b43e35" />}
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </ScrollView>

      <GoalFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        locale={locale}
        labels={labels}
        defaultAreaIndex={goal.area}
        parent={goal}
        onSubmit={({ title, area, year, note }) => {
          setGoals([
            ...goals,
            {
              id: crypto.randomUUID(),
              parentId: goal.id,
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
  empty: { textAlign: 'center', color: '#94a3a8', marginTop: 40, padding: 20 },
  areaTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  areaTagText: { fontSize: 10, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#1f2c28', marginTop: 10 },
  note: { fontSize: 13, color: '#68766f', marginTop: 4 },
  section: { marginTop: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dce4df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#2f776a', borderColor: '#2f776a' },
  checkboxLabel: { fontSize: 14, fontWeight: '600', color: '#1f2c28' },
  progressBig: { fontSize: 32, fontWeight: '800', color: '#1f2c28' },
  hint: { fontSize: 12, color: '#94a3a8', marginTop: 2 },
  subHeader: {
    marginTop: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1f2c28' },
  addLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addLinkText: { fontSize: 13, fontWeight: '600', color: '#2f776a' },
  subCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  subCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  miniCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce4df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPercent: { fontSize: 12, fontWeight: '700', color: '#2f776a', width: 36 },
  subTitle: { fontSize: 14, color: '#1f2c28', flexShrink: 1 },
  deleteButton: { marginTop: 24, borderColor: '#f3d9d5' },
});
