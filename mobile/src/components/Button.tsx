import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export function Button({
  title,
  onPress,
  variant = 'solid',
  disabled,
  loading,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? '#2f776a' : '#fff'} />
      ) : (
        <>
          {icon}
          <Text style={isOutline ? styles.outlineText : styles.solidText}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  solid: { backgroundColor: '#2f776a' },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dce4df',
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  solidText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  outlineText: { color: '#2f776a', fontWeight: '600', fontSize: 15 },
});
