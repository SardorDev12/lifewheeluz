import { Check } from 'lucide-react-native';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function ScorePickerSheet({
  visible,
  label,
  value,
  meanings,
  onSelect,
  onClose,
}: {
  visible: boolean;
  label: string;
  value: number;
  meanings: string[];
  onSelect: (value: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{label}</Text>
        <ScrollView style={styles.list}>
          {meanings.map((meaning, i) => {
            const score = i + 1,
              selected = score === value;
            return (
              <Pressable
                key={score}
                onPress={() => {
                  onSelect(score);
                  onClose();
                }}
                style={[styles.row, selected && styles.rowSelected]}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{score}</Text>
                </View>
                <Text style={styles.rowText}>{meaning}</Text>
                {selected && <Check size={18} color="#2f776a" />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 22, 0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  title: { fontSize: 13, fontWeight: '700', color: '#68766f', marginBottom: 8 },
  list: { maxHeight: 420 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f6f3',
  },
  rowSelected: { backgroundColor: '#f1f6f3', borderRadius: 12 },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2f776a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  rowText: { flex: 1, fontSize: 14, color: '#1f2c28' },
});
