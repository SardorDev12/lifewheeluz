import { copy, monthlyLabelFor } from '@lifewheeluz/shared';
import { Check, Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useDraft } from '../hooks/useDataStore';

export function ReviewsScreen() {
  const { reviews, locale, setReviews } = useDraft(),
    t = copy[locale],
    [formOpen, setFormOpen] = useState(false),
    [win, setWin] = useState(''),
    [lesson, setLesson] = useState(''),
    [next, setNext] = useState('');

  function handleSubmit() {
    if (!win.trim() || !lesson.trim() || !next.trim()) return;
    setReviews([
      {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(locale),
        createdAt: new Date().toISOString(),
        win: win.trim(),
        lesson: lesson.trim(),
        next: next.trim(),
      },
      ...reviews,
    ]);
    setWin('');
    setLesson('');
    setNext('');
    setFormOpen(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.history}</Text>
          <Button
            title={t.start}
            icon={<Plus size={16} color="#fff" />}
            onPress={() => setFormOpen(true)}
          />
        </View>

        {reviews.length === 0 ? (
          <Text style={styles.empty}>{t.noReviews}</Text>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} style={styles.card}>
              <Text style={styles.monthLabel}>
                {monthlyLabelFor(new Date(review.createdAt), locale)}
              </Text>
              <Text style={styles.fieldLabel}>{t.win}</Text>
              <Text style={styles.fieldValue}>{review.win}</Text>
              <Text style={styles.fieldLabel}>{t.lesson}</Text>
              <Text style={styles.fieldValue}>{review.lesson}</Text>
              <Text style={styles.fieldLabel}>{t.nextMonth}</Text>
              <Text style={styles.fieldValue}>{review.next}</Text>
            </Card>
          ))
        )}
      </ScrollView>

      <Modal
        visible={formOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFormOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setFormOpen(false)} />
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{t.monthly}</Text>
            <Text style={styles.fieldLabel}>{t.win}</Text>
            <TextInput
              value={win}
              onChangeText={setWin}
              multiline
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>{t.lesson}</Text>
            <TextInput
              value={lesson}
              onChangeText={setLesson}
              multiline
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>{t.nextMonth}</Text>
            <TextInput
              value={next}
              onChangeText={setNext}
              multiline
              style={styles.input}
            />
            <Button
              title={t.finish}
              icon={<Check size={16} color="#fff" />}
              onPress={handleSubmit}
              style={styles.submit}
            />
          </ScrollView>
        </View>
      </Modal>
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
  title: { fontSize: 22, fontWeight: '800', color: '#1f2c28' },
  empty: { textAlign: 'center', color: '#94a3a8', marginTop: 40 },
  card: { marginBottom: 12 },
  monthLabel: { fontSize: 12, fontWeight: '700', color: '#c56d50' },
  fieldLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3a8',
    textTransform: 'uppercase',
  },
  fieldValue: { fontSize: 14, color: '#1f2c28', marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 22, 0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  input: {
    marginTop: 6,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#dce4df',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 14,
    color: '#1f2c28',
    textAlignVertical: 'top',
  },
  submit: { marginTop: 20, marginBottom: 12 },
});
