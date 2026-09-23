import { useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
import { useSpaceById, useSpaces } from '../hooks/useSpaces';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type Space } from '../types';
import { formatCOP, formatCapacity } from '../utils/format';
import type { HomeStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const { id } = route.params;

  const { data: space, isLoading, isError, refetch } = useSpaceById(id);
  const { data: catalog } = useSpaces();

  const isItemSaved = useSavedStore((state) => state.isItemSaved);
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const isSaved = space !== undefined && isItemSaved(space.id);

  useEffect(() => {
    if (space === undefined) {
      return;
    }

    opacity.setValue(0);
    translateY.setValue(30);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [space, opacity, translateY]);

  const floorStats = useMemo(() => {
    if (space === undefined || catalog === undefined) {
      return null;
    }

    const sameFloor = catalog.filter((item: Space) => item.floor === space.floor);
    const available = sameFloor.filter((item: Space) => item.available).length;

    return { total: sameFloor.length, available };
  }, [catalog, space]);

  const handleToggleSave = (): void => {
    if (space === undefined) {
      return;
    }

    if (isSaved) {
      removeItem(space.id);
      return;
    }

    addItem(space);
  };

  if (isLoading) {
    return (
      <View style={styles.notFound}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.notFoundTitle}>Cargando el espacio…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.notFoundTitle}>No pudimos cargar el espacio</Text>
        <Text style={styles.notFoundText}>
          Revisa tu conexión a internet y vuelve a intentarlo.
        </Text>
        <AnimatedButton
          label="Reintentar"
          icon="refresh-outline"
          onPress={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (space === undefined) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="folder-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.notFoundTitle}>Espacio no encontrado</Text>
        <Text style={styles.notFoundText}>
          No hay ningún espacio con el id “{id}” en el catálogo.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Image source={space.image} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{SPACE_TYPE_LABEL[space.type]}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                space.available ? styles.statusAvailable : styles.statusBusy,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  space.available ? styles.statusTextAvailable : styles.statusTextBusy,
                ]}
              >
                {space.available ? 'Disponible' : 'Ocupado'}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{space.name}</Text>
          <Text style={styles.description}>{space.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Ficha del espacio</Text>

          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Piso</Text>
            <Text style={styles.factValue}>Piso {space.floor}</Text>
          </View>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Capacidad</Text>
            <Text style={styles.factValue}>{formatCapacity(space.capacity)}</Text>
          </View>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Precio por hora</Text>
            <Text style={styles.factValuePrice}>{formatCOP(space.pricePerHour)}</Text>
          </View>
          <View style={styles.factRow}>
            <Text style={styles.factLabel}>Estado</Text>
            <Text style={styles.factValue}>
              {space.available ? 'Disponible ahora' : 'Ocupado'}
            </Text>
          </View>

          {floorStats !== null && (
            <View style={styles.progressCard}>
              <ProgressBar
                value={floorStats.available / floorStats.total}
                label={`Ocupación del piso ${space.floor}`}
                caption={`${floorStats.available} de ${floorStats.total} espacios libres en este piso`}
              />
            </View>
          )}

          <AnimatedButton
            label={isSaved ? 'Guardado' : 'Guardar espacio'}
            icon={isSaved ? 'bookmark' : 'bookmark-outline'}
            variant={isSaved ? 'primary' : 'outline'}
            onPress={handleToggleSave}
            testID="save-button"
            style={styles.saveButton}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  hero: {
    width: '100%',
    height: 220,
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
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.base,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  factLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  factValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textPrimary,
  },
  factValuePrice: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.success,
  },
  progressCard: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  saveButton: {
    marginTop: SPACING.xl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  notFoundTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  notFoundText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
