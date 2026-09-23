import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormField } from '../components/FormField';
import { GithubSignInButton } from '../components/GithubSignInButton';
import { DEMO_CREDENTIALS } from '../services/authService';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../stores/authStore';
import { secureStorageLabel } from '../storage/secureStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { LoginScreenProps } from '../navigation/types';

export function LoginScreen({ navigation }: LoginScreenProps): React.JSX.Element {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const { control, handleSubmit, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
    } catch {
      return;
    }
  };

  const handleUseDemoCredentials = (): void => {
    clearError();
    setValue('username', DEMO_CREDENTIALS.username);
    setValue('password', DEMO_CREDENTIALS.password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="business-outline" size={34} color={COLORS.accent} />
          </View>
          <Text style={styles.title}>Nido Coworking</Text>
          <Text style={styles.subtitle}>
            Ingresa con tu cuenta de miembro para reservar espacios del edificio.
          </Text>
        </View>

        {error !== null && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <FormField
            control={control}
            name="username"
            label="Usuario"
            placeholder="emilys"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormField
            control={control}
            name="password"
            label="Contraseña"
            placeholder="Tu contraseña de miembro"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            accessibilityRole="button"
            testID="login-submit"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={styles.submitText}>Iniciar sesión</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.demoButton}
            onPress={handleUseDemoCredentials}
            accessibilityRole="button"
            testID="demo-credentials"
          >
            <Ionicons name="key-outline" size={16} color={COLORS.accent} />
            <Text style={styles.demoText}>
              Usar credenciales de prueba ({DEMO_CREDENTIALS.username})
            </Text>
          </Pressable>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <GithubSignInButton />

        <Pressable
          style={styles.linkButton}
          onPress={() => {
            clearError();
            navigation.navigate('Register');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.linkText}>
            ¿Todavía no eres miembro?{' '}
            <Text style={styles.linkHighlight}>Crear cuenta</Text>
          </Text>
        </Pressable>

        <Text style={styles.footnote}>
          Los tokens de sesión se guardan en {secureStorageLabel}, nunca en texto
          plano.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  hero: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentDim,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.error,
    lineHeight: 18,
  },
  form: {
    gap: SPACING.base,
  },
  submitButton: {
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  demoText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.accent,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  linkHighlight: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  footnote: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
