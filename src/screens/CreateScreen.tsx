import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCreateSpace } from '../hooks/useSpaces';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type SpaceType } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type CreateScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeCreate'
>;

const SPACE_TYPES: SpaceType[] = [
  'escritorio-flexible',
  'escritorio-dedicado',
  'sala-juntas',
  'oficina-privada',
  'cabina-fonica',
  'sala-eventos',
];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const { mutate, isPending, isError, error } = useCreateSpace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SpaceType>('escritorio-flexible');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  const isComplete =
    name.trim() !== '' &&
    description.trim() !== '' &&
    Number(floor) > 0 &&
    Number(capacity) > 0 &&
    Number(pricePerHour) > 0;

  const handleSubmit = (): void => {
    mutate(
      {
        name: name.trim(),
        description: description.trim(),
        type,
        floor: Number(floor),
        capacity: Number(capacity),
        pricePerHour: Number(pricePerHour),
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
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
        <Text style={styles.label}>Nombre del espacio</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej. Sala de juntas · Aurora"
          placeholderTextColor={COLORS.textMuted}
          accessibilityLabel="Nombre del espacio"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Qué incluye el espacio y para qué sirve"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
          accessibilityLabel="Descripción del espacio"
        />

        <Text style={styles.label}>Tipo de espacio</Text>
        <View style={styles.typeRow}>
          {SPACE_TYPES.map((spaceType) => {
            const selected = spaceType === type;

            return (
              <Pressable
                key={spaceType}
                style={[styles.typeChip, selected && styles.typeChipSelected]}
                onPress={() => setType(spaceType)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[styles.typeChipText, selected && styles.typeChipTextSelected]}
                >
                  {SPACE_TYPE_LABEL[spaceType]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Piso</Text>
            <TextInput
              style={styles.input}
              value={floor}
              onChangeText={setFloor}
              placeholder="3"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              accessibilityLabel="Piso"
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Capacidad</Text>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="8"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              accessibilityLabel="Capacidad"
            />
          </View>
        </View>

        <Text style={styles.label}>Precio por hora (COP)</Text>
        <TextInput
          style={styles.input}
          value={pricePerHour}
          onChangeText={setPricePerHour}
          placeholder="45000"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          accessibilityLabel="Precio por hora"
        />

        {isError && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>
              No se pudo crear el espacio: {error.message}
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !isComplete && styles.submitButtonDisabled,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!isComplete || isPending}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isComplete || isPending }}
          testID="create-submit"
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="add-outline" size={20} color={COLORS.background} />
          )}
          <Text style={styles.submitButtonText}>
            {isPending ? 'Guardando…' : 'Publicar espacio'}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          El espacio se envía a la API del edificio con un POST y el catálogo se
          refresca solo al volver.
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
    gap: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
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
