import { copy, type Goal, type Locale } from '@lifewheeluz/shared';
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
import { Button } from './Button';

export function GoalFormModal({
  visible,
  onClose,
  onSubmit,
  locale,
  labels,
  defaultAreaIndex,
  parent,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    area: number;
    year: string;
    note: string;
  }) => void;
  locale: Locale;
  labels: string[];
  defaultAreaIndex: number;
  parent: Goal | null;
}) {
  const t = copy[locale],
    [title, setTitle] = useState(''),
    [area, setArea] = useState(defaultAreaIndex),
    [year, setYear] = useState(parent ? parent.year : '2029'),
    [note, setNote] = useState('');

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      area: parent ? parent.area : area,
      year,
      note,
    });
    setTitle('');
    setNote('');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{parent ? t.addSubgoal : t.add}</Text>
          {parent && <Text style={styles.parentTitle}>{parent.title}</Text>}
          <Text style={styles.smartHint}>
            💡 {parent ? t.smartHintSub : t.smartHintBig}
          </Text>

          <Text style={styles.fieldLabel}>{t.area}</Text>
          {parent ? (
            <View style={styles.readonlyArea}>
              <Text style={styles.readonlyAreaText}>{labels[parent.area]}</Text>
            </View>
          ) : (
            <View style={styles.areaGrid}>
              {labels.map((label, i) => (
                <Pressable
                  key={label}
                  onPress={() => setArea(i)}
                  style={[styles.areaChip, area === i && styles.areaChipActive]}
                >
                  <Text
                    style={[
                      styles.areaChipText,
                      area === i && styles.areaChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.fieldLabel}>{t.title}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={
              parent ? t.subgoalTitlePlaceholder : t.goalTitlePlaceholder
            }
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>{t.year}</Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>{t.motivation}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            style={[styles.input, styles.textarea]}
          />

          <Button
            title={t.create}
            onPress={handleSubmit}
            style={styles.submit}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  title: { fontSize: 20, fontWeight: '800', color: '#1f2c28' },
  parentTitle: { fontSize: 13, color: '#68766f', marginTop: 4 },
  smartHint: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f2f6f3',
    fontSize: 12,
    color: '#4b6359',
  },
  fieldLabel: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#dce4df',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1f2c28',
  },
  textarea: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  readonlyArea: {
    height: 44,
    borderWidth: 1,
    borderColor: '#dce4df',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  readonlyAreaText: { fontSize: 14, fontWeight: '600', color: '#2f776a' },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dce4df',
  },
  areaChipActive: { backgroundColor: '#2f776a', borderColor: '#2f776a' },
  areaChipText: { fontSize: 12, color: '#475569' },
  areaChipTextActive: { color: '#fff', fontWeight: '700' },
  submit: { marginTop: 20, marginBottom: 12 },
});
