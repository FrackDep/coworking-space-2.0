import React, { useEffect } from 'react';
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
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormField } from '../components/FormField';
import { useSpaceById, useUpdateSpace } from '../hooks/useSpaces';
import {
  spaceSchema,
  type SpaceFormData,
  type SpaceFormInput,
} from '../schemas/spaceSchema';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type SpaceType } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type EditScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeEdit'
>;
type EditRouteProp = RouteProp<HomeStackParamList, 'HomeEdit'>;

const SPACE_TYPES: SpaceType[] = [
  'escritorio-flexible',
  'escritorio-dedicado',
  'sala-juntas',
  'oficina-privada',
  'cabina-fonica',
  'sala-eventos',
];

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditScreenNavigationProp>();
  const route = useRoute<EditRouteProp>();
  const { id } = route.params;

  const { data: space, isLoading } = useSpaceById(id);
  const { mutate, isPending, isError, error } = useUpdateSpace();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SpaceFormInput, unknown, SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'escritorio-flexible',
      floor: 1,
      capacity: 1,
      pricePerHour: 0,
    },
  });

  useEffect(() => {
    if (space === undefined) {
      return;
    }

    reset({
      name: space.name,
      description: space.description,
      type: space.type,
      floor: space.floor,
      capacity: space.capacity,
      pricePerHour: space.pricePerHour,
    });
  }, [space, reset]);

  const onSubmit = (data: SpaceFormData): void => {
    mutate(
      { ...data, id },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.stateText}>Cargando el espacio…</Text>
      </View>
    );
  }

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
        <FormField
          control={control}
          name="name"
          label="Nombre del espacio"
          errorMessage={errors.name?.message}
          accessibilityLabel="Nombre del espacio"
        />

        <FormField
          control={control}
          name="description"
          label="Descripción"
          errorMessage={errors.description?.message}
          multiline
          numberOfLines={3}
          style={styles.multiline}
          accessibilityLabel="Descripción del espacio"
        />

        <Text style={styles.label}>Tipo de espacio</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.typeRow}>
              {SPACE_TYPES.map((spaceType) => {
                const selected = spaceType === value;

                return (
                  <Pressable
                    key={spaceType}
                    style={[styles.typeChip, selected && styles.typeChipSelected]}
                    onPress={() => onChange(spaceType)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        selected && styles.typeChipTextSelected,
                      ]}
                    >
                      {SPACE_TYPE_LABEL[spaceType]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
        <Text style={styles.error}>{errors.type?.message ?? ''}</Text>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <FormField
              control={control}
              name="floor"
              label="Piso"
              keyboardType="number-pad"
              errorMessage={errors.floor?.message}
              accessibilityLabel="Piso"
            />
          </View>
          <View style={styles.rowItem}>
            <FormField
              control={control}
              name="capacity"
              label="Capacidad"
              keyboardType="number-pad"
              errorMessage={errors.capacity?.message}
              accessibilityLabel="Capacidad"
            />
          </View>
        </View>

        <FormField
          control={control}
          name="pricePerHour"
          label="Precio por hora (COP)"
          keyboardType="number-pad"
          errorMessage={errors.pricePerHour?.message}
          accessibilityLabel="Precio por hora"
        />

        {isError && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>
              No se pudo guardar el cambio: {error.message}
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !isDirty && styles.submitButtonDisabled,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !isDirty}
          accessibilityRole="button"
          accessibilityState={{ disabled: isPending || !isDirty }}
          testID="edit-submit"
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="checkmark-outline" size={20} color={COLORS.background} />
          )}
          <Text style={styles.submitButtonText}>
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Los valores iniciales vienen del servidor y se cargan con reset(). El
          botón se activa solo cuando cambias algún campo.
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
    paddingBottom: SPACING.xxl,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  stateText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.md,
  },
  error: {
    minHeight: 16,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  typeChipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceAlt,
  },
  typeChipText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  typeChipTextSelected: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rowItem: {
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
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
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonPressed: {
    opacity: 0.75,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.background,
  },
  hint: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
