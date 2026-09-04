import { copy, type Locale } from '@lifewheeluz/shared';
import { useState } from 'react';
import {
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

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export function SettingsScreen() {
  const {
      locale,
      setLocale,
      profile,
      setProfile,
      hasSupabase,
      upgradeStatus,
      requestUpgrade,
      signOut,
    } = useDraft(),
    t = copy[locale],
    [email, setEmail] = useState(profile.email);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.settings}</Text>

        <View style={styles.localeRow}>
          {LOCALES.map((l) => (
            <Pressable
              key={l.code}
              onPress={() => setLocale(l.code)}
              style={[
                styles.localeChip,
                locale === l.code && styles.localeChipActive,
              ]}
            >
              <Text
                style={[
                  styles.localeChipText,
                  locale === l.code && styles.localeChipTextActive,
                ]}
              >
                {l.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.section}>
          {!hasSupabase ? (
            <View>
              <Text style={styles.cardTitle}>{t.upgradeTitle}</Text>
              <Text style={styles.hint}>{t.backendNotConfigured}</Text>
            </View>
          ) : profile.tier === 'pro' ? (
            <View>
              <Text style={styles.cardTitle}>{t.proActive}</Text>
              <Text style={styles.hint}>
                {t.signedInAs.replace('{email}', profile.email)}
              </Text>
              <Button
                title={t.signOut}
                variant="outline"
                onPress={() => {
                  signOut().catch((err: unknown) =>
                    console.error('Failed to sign out', err),
                  );
                }}
                style={styles.signOutButton}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.cardTitle}>{t.upgradeTitle}</Text>
              <Text style={styles.hint}>{t.upgradeHint}</Text>
              {upgradeStatus === 'sent' ? (
                <Text style={styles.sentText}>
                  {t.magicLinkSent.replace('{email}', email)}
                </Text>
              ) : (
                <>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <Button
                    title={t.sendMagicLink}
                    loading={upgradeStatus === 'sending'}
                    onPress={() => {
                      requestUpgrade(email).catch((err: unknown) =>
                        console.error('Failed to request magic link', err),
                      );
                    }}
                    style={styles.upgradeButton}
                  />
                </>
              )}
              {upgradeStatus === 'error' && (
                <Text style={styles.errorText}>{t.magicLinkError}</Text>
              )}
            </View>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.cardTitle}>{t.offline}</Text>
          <Text style={styles.hint}>{t.offlineHint}</Text>
          <Text style={styles.fieldLabel}>{t.name}</Text>
          <TextInput
            value={profile.name}
            onChangeText={(name) => setProfile({ ...profile, name })}
            style={styles.input}
          />
          <Text style={styles.fieldLabel}>{t.email}</Text>
          <TextInput
            value={profile.email}
            onChangeText={(value) => setProfile({ ...profile, email: value })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7f3' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#1f2c28' },
  localeRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  localeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#dce4df',
  },
  localeChipActive: { backgroundColor: '#2f776a', borderColor: '#2f776a' },
  localeChipText: { fontSize: 13, color: '#475569' },
  localeChipTextActive: { color: '#fff', fontWeight: '700' },
  section: { marginTop: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#2f776a' },
  hint: { fontSize: 13, color: '#68766f', marginTop: 4 },
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
  upgradeButton: { marginTop: 12 },
  signOutButton: { marginTop: 12 },
  sentText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#2f776a',
  },
  errorText: { marginTop: 8, fontSize: 13, color: '#b43e35' },
});
