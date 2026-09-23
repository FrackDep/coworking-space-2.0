import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface ProgressBarProps {
  value: number;
  label: string;
  caption?: string;
}

function clamp(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

export function ProgressBar({ value, label, caption }: ProgressBarProps): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;
  const target = clamp(value);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress, target]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.error, COLORS.warning, COLORS.success],
    extrapolate: 'clamp',
  });

  const percentage = Math.round(target * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor }]} />
      </View>

      {caption !== undefined && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  percentage: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  track: {
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  caption: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
});
