import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { readSecret, saveSecret } from '../storage/secureStore';

import { usePreferences, type SortOrder } from '../hooks/usePreferences';
import { useAuthStore } from '../stores/authStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'name', label: 'Nombre' },
  { value: 'price', label: 'Precio' },
  { value: 'floor', label: 'Piso' },
];

const PAGE_OPTIONS = [5, 10, 20];

const ACCESS_CODE_KEY = 'nido.accessCode';

type SecureStatus = 'idle' | 'saved' | 'found' | 'missing' | 'error';

export function SettingsScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    sortOrder,
    compactMode,
    itemsPerPage,
    storageLabel,
    setSortOrder,
    setCompactMode,
    setItemsPerPage,
  } = usePreferences();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<SecureStatus>('idle');
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const handleSaveCode = async (): Promise<void> => {
    if (code.trim() === '') {
      setStatus('error');
      return;
    }

    try {
      await saveSecret(ACCESS_CODE_KEY, code.trim());
      setCode('');
      setStatus('saved');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleReadCode = async (): Promise<void> => {
    try {
      const stored = await readSecret(ACCESS_CODE_KEY);
      setStatus(stored === null ? 'missing' : 'found');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleLogout = (): void => {
    setConfirmingLogout(true);
  };

  const confirmLogout = (): void => {
    setConfirmingLogout(false);
    void logout();
  };

  const secureMessage: Record<SecureStatus, string> = {
    idle: 'El código se guarda en el almacenamiento seguro del dispositivo.',
    saved: 'Código guardado de forma segura. No se muestra en pantalla.',
    found: 'Hay un código guardado. Por seguridad no se muestra su valor.',
    missing: 'Todavía no hay ningún código guardado.',
    error: 'No se pudo acceder al almacenamiento seguro en este dispositivo.',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Preferencias del catálogo</Text>
      <Text style={styles.sectionHint}>
        Se guardan al instante, sin botón de guardar. Almacenamiento activo:{' '}
        {storageLabel}.
      </Text>

      <Text style={styles.label}>Ordenar espacios por</Text>
      <View style={styles.optionRow}>
        {SORT_OPTIONS.map((option) => {
          const selected = option.value === sortOrder;

          return (
            <Pressable
              key={option.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setSortOrder(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              testID={`sort-${option.value}`}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTexts}>
          <Text style={styles.switchTitle}>Modo compacto</Text>
          <Text style={styles.switchHint}>
            Muestra solo el nombre y el precio de cada espacio.
          </Text>
        </View>
        <Switch
          value={compactMode}
          onValueChange={setCompactMode}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
          thumbColor={COLORS.textPrimary}
          testID="compact-mode-switch"
        />
      </View>

      <Text style={styles.label}>Espacios por página</Text>
      <View style={styles.optionRow}>
        {PAGE_OPTIONS.map((option) => {
          const selected = option === itemsPerPage;

          return (
            <Pressable
              key={option}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setItemsPerPage(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              testID={`page-${option}`}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Sesión</Text>
      <Text style={styles.sectionHint}>
        Tu sesión viaja en tokens firmados que se guardan en el almacenamiento
        seguro, aparte de las preferencias del catálogo.
      </Text>

      <View style={styles.sessionRow}>
        <Ionicons name="person-outline" size={18} color={COLORS.accent} />
        <Text style={styles.sessionText}>
          {user === null
            ? 'Sin sesión activa.'
            : `${user.firstName} ${user.lastName} · ${user.email}`}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.sessionButton, pressed && styles.buttonPressed]}
        onPress={handleLogout}
        accessibilityRole="button"
        testID="settings-logout-button"
      >
        <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
        <Text style={styles.sessionButtonText}>Cerrar sesión</Text>
      </Pressable>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Seguridad</Text>
      <Text style={styles.sectionHint}>
        Código de acceso del edificio para reservar salas. Se guarda en el
        almacenamiento seguro del dispositivo y nunca se muestra en texto plano.
      </Text>

      <View style={styles.secureRow}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Código de acceso"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          keyboardType="number-pad"
          accessibilityLabel="Código de acceso del edificio"
          testID="access-code-input"
        />
        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
          onPress={() => {
            void handleSaveCode();
          }}
          accessibilityRole="button"
          testID="save-code-button"
        >
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.background} />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.readButton, pressed && styles.buttonPressed]}
        onPress={() => {
          void handleReadCode();
        }}
        accessibilityRole="button"
        testID="read-code-button"
      >
        <Ionicons name="key-outline" size={18} color={COLORS.accent} />
        <Text style={styles.readButtonText}>Comprobar si hay código guardado</Text>
      </Pressable>

      <View style={styles.statusBox}>
        <Ionicons
          name={status === 'error' ? 'alert-circle-outline' : 'shield-checkmark-outline'}
          size={18}
          color={status === 'error' ? COLORS.error : COLORS.textMuted}
        />
        <Text style={styles.statusText}>{secureMessage[status]}</Text>
      </View>
      <ConfirmDialog
        visible={confirmingLogout}
        title="Cerrar sesión"
        message="¿Quieres salir de tu cuenta de Nido Coworking?"
        confirmLabel="Salir"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmingLogout(false)}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  sectionHint: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.lg,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sessionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  sessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  sessionButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  chipText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  switchTexts: {
    flex: 1,
    gap: SPACING.xs,
  },
  switchTitle: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  switchHint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xl,
  },
  secureRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.background,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  readButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.accent,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  statusText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});
