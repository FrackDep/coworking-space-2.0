import { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export function AnimatedCard({
  children,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: AnimatedCardProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.95,
      tension: 300,
      friction: 12,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 260,
      friction: 8,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, style, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={styles.pressable}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
  },
  pressable: {
    borderRadius: 12,
  },
});
