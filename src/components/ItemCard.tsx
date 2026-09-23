import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { SPACE_TYPE_LABEL, type Space } from '../types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { formatCOP, formatCapacity } from '../utils/format';

interface ItemCardProps {
  item: Space;
  onPress: (item: Space) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${item.name}`}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{SPACE_TYPE_LABEL[item.type]}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.available ? styles.statusAvailable : styles.statusBusy,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                item.available ? styles.statusTextAvailable : styles.statusTextBusy,
              ]}
            >
              {item.available ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Piso {item.floor}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{formatCapacity(item.capacity)}</Text>
        </View>

        <Text style={styles.price}>{formatCOP(item.pricePerHour)} / hora</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.accent,
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: SPACING.base,
    gap: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
  },
  typeBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  statusAvailable: {
    borderColor: COLORS.success,
  },
  statusBusy: {
    borderColor: COLORS.error,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  statusTextAvailable: {
    color: COLORS.success,
  },
  statusTextBusy: {
    color: COLORS.error,
  },
  name: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  meta: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  metaDot: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.border,
  },
  price: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
});
