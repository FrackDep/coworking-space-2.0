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
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import { useAuthStore } from '../stores/authStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RegisterScreenProps } from '../navigation/types';

export function RegisterScreen({ navigation }: RegisterScreenProps): React.JSX.Element {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
    } catch {
      return;
    }
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
        <View style={styles.header}>
          <Text style={styles.title}>Nueva cuenta de miembro</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta para publicar y guardar espacios del edificio.
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
            placeholder="camila.nido"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormField
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="camila@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormField
            control={control}
            name="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres, con número"
            secureTextEntry
            autoCapitalize="none"
          />

          <FormField
            control={control}
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repite la contraseña"
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
            testID="register-submit"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.background} />
            ) : (
              <Text style={styles.submitText}>Crear cuenta</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.noteText}>
            La API pública de práctica (dummyjson.com) no tiene endpoint de
            registro: la cuenta se crea en el dispositivo con una sesión de
            demostración. El ingreso con usuario y contraseña sí se valida
            contra la API real.
          </Text>
        </View>

        <Pressable
          style={styles.linkButton}
          onPress={() => {
            clearError();
            navigation.navigate('Login');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta?{' '}
            <Text style={styles.linkHighlight}>Iniciar sesión</Text>
          </Text>
        </Pressable>
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
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  header: {
    gap: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
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
  note: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  noteText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
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
});
