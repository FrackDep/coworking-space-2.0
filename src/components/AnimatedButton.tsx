import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

type ButtonVariant = 'primary' | 'outline' | 'danger';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  style?: ViewStyle;
}

export function AnimatedButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  testID,
  style,
}: AnimatedButtonProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 400,
      friction: 12,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const isInactive = disabled || loading;

  return (
    <Animated.View style={[styles.wrapper, style, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.button, styles[variant], isInactive && styles.inactive]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isInactive}
        accessibilityRole="button"
        accessibilityState={{ disabled: isInactive, busy: loading }}
        testID={testID}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColorFor(variant)} />
        ) : (
          <>
            {icon !== undefined && (
              <Ionicons name={icon} size={18} color={textColorFor(variant)} />
            )}
            <Text style={[styles.label, { color: textColorFor(variant) }]}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

function textColorFor(variant: ButtonVariant): string {
  if (variant === 'primary') {
    return COLORS.background;
  }

  if (variant === 'danger') {
    return COLORS.error;
  }

  return COLORS.accent;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    minHeight: 46,
  },
  primary: {
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  inactive: {
    opacity: 0.6,
  },
  label: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
});
