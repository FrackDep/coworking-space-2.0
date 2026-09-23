import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_FAVORITES } from '../data/mockData';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type Space } from '../types';
import { formatCOP } from '../utils/format';

interface FavoriteRowProps {
  item: Space;
}

function FavoriteRow({ item }: FavoriteRowProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Ionicons name="heart-outline" size={20} color={COLORS.error} />

      <View style={styles.cardContent}>
        <Text style={styles.cardType}>{SPACE_TYPE_LABEL[item.type]}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.cardPrice}>{formatCOP(item.pricePerHour)} / hora</Text>
      </View>
    </View>
  );
}

export function FavoritesScreen(): React.JSX.Element {
  const renderFavorite: ListRenderItem<Space> = useCallback(
    ({ item }) => <FavoriteRow item={item} />,
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Todavía no tienes favoritos</Text>
        <Text style={styles.emptyText}>
          Explora los espacios del catálogo y guarda los que quieras reservar.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          Espacios que quieres reservar después
        </Text>
      </View>

      <FlatList
        data={MOCK_FAVORITES}
        keyExtractor={(item) => item.id}
        renderItem={renderFavorite}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  list: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardType: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  cardDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardPrice: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
