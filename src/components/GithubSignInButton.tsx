import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';

import {
  completeGithubSignIn,
  githubClientId,
  githubDiscovery,
  githubScopes,
  isGithubConfigured,
  oauthRedirectUri,
} from '../services/oauthService';
import { useAuthStore } from '../stores/authStore';
import { notify } from '../utils/dialog';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

const CONFIG_HELP =
  'Para activar el ingreso con GitHub necesitas: 1) crear una OAuth App en GitHub, ' +
  '2) copiar su Client ID en EXPO_PUBLIC_GITHUB_CLIENT_ID, 3) registrar esta URL de ' +
  `redirección: ${oauthRedirectUri}, y 4) correr la app con un build nativo ` +
  '(pnpm expo run:android o run:ios). En Expo Go el esquema propio no se puede usar.';

function ConfiguredGithubButton(): React.JSX.Element {
  const signInWithOAuth = useAuthStore((state) => state.signInWithOAuth);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: githubClientId,
      scopes: githubScopes,
      redirectUri: oauthRedirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    githubDiscovery,
  );

  useEffect(() => {
    if (response === null) {
      return;
    }

    if (response.type === 'success') {
      const code = response.params.code;

      if (code === undefined || request === null || request.codeVerifier === undefined) {
        notify('No pudimos completar el ingreso', 'GitHub no devolvió el código esperado.');
        return;
      }

      void (async () => {
        try {
          const result = await completeGithubSignIn(code, request.codeVerifier ?? '');
          await signInWithOAuth(result.profile, result.accessToken);
        } catch (error) {
          notify(
            'No pudimos completar el ingreso',
            error instanceof Error ? error.message : 'Inténtalo de nuevo.',
          );
        }
      })();

      return;
    }

    if (response.type === 'error') {
      notify(
        'GitHub devolvió un error',
        response.error?.message ?? 'Revisa la configuración de la OAuth App.',
      );
      return;
    }

    notify('Ingreso cancelado', 'No se completó el ingreso con GitHub.');
  }, [response, request, signInWithOAuth]);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={() => {
        void promptAsync();
      }}
      disabled={request === null}
      accessibilityRole="button"
      testID="github-sign-in-button"
    >
      <Ionicons name="logo-github" size={20} color={COLORS.textPrimary} />
      <Text style={styles.buttonText}>Continuar con GitHub</Text>
    </Pressable>
  );
}

export function GithubSignInButton(): React.JSX.Element {
  if (isGithubConfigured()) {
    return <ConfiguredGithubButton />;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => notify('Ingreso con GitHub sin configurar', CONFIG_HELP)}
      accessibilityRole="button"
      testID="github-sign-in-button"
    >
      <Ionicons name="logo-github" size={20} color={COLORS.textMuted} />
      <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
        Continuar con GitHub
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  buttonPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  buttonDisabled: {
    borderStyle: 'dashed',
  },
  buttonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },
});
