import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type Space } from '../types';
import { formatCOP } from '../utils/format';

interface SavedRowProps {
  item: Space;
  onRemove: () => void;
}

function SavedRow({ item, onRemove }: SavedRowProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />

      <View style={styles.cardContent}>
        <Text style={styles.cardType}>{SPACE_TYPE_LABEL[item.type]}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.cardPrice}>{formatCOP(item.pricePerHour)} / hora</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Quitar ${item.name} de guardados`}
      >
        <Ionicons name="close-outline" size={20} color={COLORS.error} />
      </Pressable>
    </View>
  );
}

export function SavedScreen(): React.JSX.Element {
  const items = useSavedStore((state) => state.items);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  const renderItem: ListRenderItem<Space> = useCallback(
    ({ item }) => (
      <SavedRow item={item} onRemove={() => removeItem(item.id)} />
    ),
    [removeItem],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <Ionicons name="bookmark-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Sin guardados aún</Text>
        <Text style={styles.emptyText}>
          Abre un espacio del catálogo y toca “Guardar” para tenerlo a mano.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guardados</Text>
        <Text style={styles.headerSubtitle}>
          {items.length === 0
            ? 'Espacios que guardes para reservar después'
            : `${items.length} espacio${items.length === 1 ? '' : 's'} listo${
                items.length === 1 ? '' : 's'
              } para reservar`}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          items.length > 0 ? (
            <Pressable onPress={clearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar todo</Text>
            </Pressable>
          ) : null
        }
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
  clearButton: {
    alignSelf: 'flex-end',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  clearButtonText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.error,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
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
  cardTitle: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  cardDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  cardPrice: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.success,
    marginTop: 2,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonPressed: {
    opacity: 0.6,
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
