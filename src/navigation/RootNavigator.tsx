import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '../stores/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

function RestoringSession(): React.JSX.Element {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.splashTitle}>Nido Coworking</Text>
      <Text style={styles.splashText}>Restaurando tu sesión…</Text>
    </View>
  );
}

export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) {
    return <RestoringSession />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  splashTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  splashText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
});
