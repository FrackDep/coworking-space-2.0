import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function animateNextLayout(): void {
  if (Platform.OS === 'web') {
    return;
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}
