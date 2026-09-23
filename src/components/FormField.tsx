import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface FormFieldProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues extends FieldValues | undefined,
> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  errorMessage?: string;
}

export function FormField<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues extends FieldValues | undefined,
>({
  control,
  name,
  label,
  errorMessage,
  ...textInputProps
}: FormFieldProps<TFieldValues, TContext, TTransformedValues>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const textValue =
            typeof value === 'string'
              ? value
              : typeof value === 'number'
                ? String(value)
                : '';

          return (
            <TextInput
              style={[styles.input, errorMessage !== undefined && styles.inputError]}
              value={textValue}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={COLORS.textMuted}
              {...textInputProps}
            />
          );
        }}
      />

      <Text style={styles.error} numberOfLines={1}>
        {errorMessage ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    minHeight: 16,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.error,
  },
});
