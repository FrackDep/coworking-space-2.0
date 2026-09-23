import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
import { getProfile } from '../services/authService';
import { secureStorageLabel } from '../storage/secureStore';
import { getAccessToken, readTokenClaims } from '../services/tokenService';
import { useAuthStore } from '../stores/authStore';
import { useSavedStore } from '../stores/savedStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { MEMBERSHIP_LABEL } from '../types';
import { formatClockTime, formatHours } from '../utils/format';
import { initialsFor } from '../utils/memberMapper';

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const refreshTokens = useAuthStore((state) => state.refreshTokens);
  const logout = useAuthStore((state) => state.logout);
  const savedCount = useSavedStore((state) => state.items.length);

  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const usesServerAccount = user?.sessionOrigin === 'dummyjson';

  const serverProfile = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getProfile,
    enabled: usesServerAccount,
  });

  useEffect(() => {
    void (async () => {
      const token = await getAccessToken();

      if (token === null || token === '') {
        setExpiresAt(null);
        return;
      }

      const claims = readTokenClaims(token);
      setExpiresAt(claims?.exp ?? null);
    })();
  }, [user]);

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await refreshTokens();
    setIsRefreshing(false);
  };

  const handleLogout = (): void => {
    setConfirmingLogout(true);
  };

  const confirmLogout = (): void => {
    setConfirmingLogout(false);
    void logout();
  };

  if (user === null) {
    return (
      <View style={styles.empty}>
        <Ionicons name="person-outline" size={44} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>No hay una sesión activa.</Text>
      </View>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {user.image === '' ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsFor(user)}</Text>
          </View>
        ) : (
          <Image source={{ uri: user.image }} style={styles.avatarImage} />
        )}

        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.planBadge}>
          <Ionicons name="ribbon-outline" size={14} color={COLORS.accent} />
          <Text style={styles.planBadgeText}>{MEMBERSHIP_LABEL[user.plan]}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu cuenta en el edificio</Text>
        <InfoRow label="Usuario" value={user.username} />
        <InfoRow label="Miembro desde" value={user.memberSince} />
        <InfoRow label="Piso preferido" value={`Piso ${user.preferredFloor}`} />
        <InfoRow label="Espacios guardados" value={String(savedCount)} />

        <View style={styles.progressCard}>
          <ProgressBar
            value={user.hoursUsed / user.hoursIncluded}
            label="Horas del mes"
            caption={`${formatHours(user.hoursUsed)} de ${formatHours(
              user.hoursIncluded,
            )} del ${MEMBERSHIP_LABEL[user.plan]}`}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del servidor</Text>

        {!usesServerAccount && (
          <View style={styles.serverNote}>
            <Ionicons name="phone-portrait-outline" size={18} color={COLORS.textMuted} />
            <Text style={styles.serverNoteText}>
              Esta sesión es local (registro simulado o GitHub), así que el perfil
              se arma en el dispositivo. Ingresa con las credenciales de prueba
              para consultar /auth/me en el servidor.
            </Text>
          </View>
        )}

        {usesServerAccount && serverProfile.isLoading && (
          <ActivityIndicator size="small" color={COLORS.accent} />
        )}

        {usesServerAccount && serverProfile.isError && (
          <Text style={styles.serverError}>
            No pudimos leer tu perfil del servidor. Toca “Renovar sesión” o vuelve
            a entrar.
          </Text>
        )}

        {usesServerAccount && serverProfile.data !== undefined && (
          <>
            <InfoRow label="Nombre en el servidor" value={serverProfile.data.firstName} />
            <InfoRow label="Apellido en el servidor" value={serverProfile.data.lastName} />
            <InfoRow
              label="Identificador"
              value={String(serverProfile.data.id)}
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sesión y seguridad</Text>
        <View style={styles.sessionRow}>
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.success} />
          <Text style={styles.sessionText}>
            Tokens guardados en {secureStorageLabel}.
          </Text>
        </View>
        <InfoRow
          label="Token válido hasta"
          value={expiresAt === null ? 'Sin expiración conocida' : formatClockTime(expiresAt)}
        />

        <AnimatedButton
          label="Renovar sesión"
          icon="refresh-outline"
          variant="outline"
          loading={isRefreshing}
          onPress={() => {
            void handleRefresh();
          }}
          testID="refresh-session-button"
        />

        <AnimatedButton
          label="Cerrar sesión"
          icon="log-out-outline"
          variant="danger"
          onPress={handleLogout}
          testID="logout-button"
        />
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
    gap: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.full,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  name: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
  },
  planBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  section: {
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  infoValue: {
    flexShrink: 1,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  serverNote: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  serverNoteText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  serverError: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
    lineHeight: 18,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sessionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  progressCard: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
});
