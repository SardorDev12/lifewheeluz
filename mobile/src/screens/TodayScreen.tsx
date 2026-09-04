import {
  childrenOf,
  colors,
  copy,
  effectiveProgress,
  getAreaLabels,
  hasReviewedThisMonth,
  monthlyLabelFor,
} from '@lifewheeluz/shared';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Compass } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LifeWheelChart } from '../components/LifeWheelChart';
import { WheelRide } from '../components/WheelRide';
import { useDraft } from '../hooks/useDataStore';
import type { RootTabParamList } from '../navigation/RootNavigator';

export function TodayScreen() {
  const { scores, goals, reviews, locale, profile } = useDraft(),
    navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>(),
    t = copy[locale],
    labels = getAreaLabels(locale),
    rootGoals = goals.filter((g) => g.parentId === null),
    lastMonthLabel = monthlyLabelFor(new Date(), locale),
    reviewed = hasReviewedThisMonth(reviews);

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length,
    stdDev = Math.sqrt(
      scores.reduce((a, b) => a + (b - avg) ** 2, 0) / scores.length,
    ),
    [rideLabel, rideCaption] =
      stdDev < 0.9
        ? [t.rideSmoothLabel, t.rideSmoothCaption]
        : stdDev < 2
          ? [t.rideUnevenLabel, t.rideUnevenCaption]
          : [t.rideRoughLabel, t.rideRoughCaption];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.overline}>{t.overview}</Text>
        <Text style={styles.greeting}>{t.greeting}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <Card style={styles.section}>
          <Text style={styles.cardTitle}>{t.rideTitle}</Text>
          <WheelRide scores={scores} label={rideLabel} caption={rideCaption} />
          <View style={styles.whyBlock}>
            <Text style={styles.cardTitle}>{t.rideWhy}</Text>
            <Text style={styles.hint}>{t.rideWhyHint}</Text>
            <LifeWheelChart labels={labels} scores={scores} />
          </View>
          <Button
            title={t.reassess}
            variant="outline"
            icon={<Compass size={16} color="#2f776a" />}
            onPress={() => navigation.navigate('MyLife')}
            style={{ marginTop: 16 }}
          />
        </Card>

        {!reviewed && (
          <Card style={styles.section}>
            <Text style={styles.monthlyTitle}>{t.monthlyAnalysis}</Text>
            <Text style={styles.hint}>{lastMonthLabel}</Text>
            <Button
              title={t.start}
              variant="outline"
              onPress={() => navigation.navigate('Reviews')}
              style={{ marginTop: 16 }}
            />
          </Card>
        )}

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>{t.progress}</Text>
            <Text style={styles.hint}>
              {rootGoals.length} {t.goalCount}
            </Text>
          </View>
          {rootGoals.length === 0 ? (
            <Text style={styles.hint}>{t.noGoals}</Text>
          ) : (
            rootGoals.map((goal) => {
              const progress = effectiveProgress(goal, goals),
                subCount = childrenOf(goals, goal.id).length;
              return (
                <View key={goal.id} style={styles.goalRow}>
                  <View style={styles.goalRowTop}>
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
                    <Text style={styles.hint}>{goal.year}</Text>
                  </View>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {subCount > 0 && (
                    <Text style={styles.hint}>
                      {subCount} {t.subgoals}
                    </Text>
                  )}
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>{progress}%</Text>
                </View>
              );
            })
          )}
        </Card>
        <Text style={styles.footerNote}>
          {profile.tier === 'pro' ? t.proActive : t.offline}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7f3' },
  content: { padding: 20, paddingBottom: 40 },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c56d50',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2c28',
    marginTop: 4,
  },
  subtitle: { fontSize: 14, color: '#68766f', marginTop: 4 },
  section: { marginTop: 20 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1f2c28' },
  hint: { fontSize: 12, color: '#94a3a8', marginTop: 2 },
  whyBlock: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f6f3',
  },
  monthlyTitle: { fontSize: 13, fontWeight: '700', color: '#bc6d4f' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  goalRow: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f6f3',
  },
  goalRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  areaTagText: { fontSize: 10, fontWeight: '700' },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2c28',
    marginTop: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#edf1ee',
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#2f776a' },
  progressLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#2f776a',
  },
  footerNote: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3a8',
  },
});
