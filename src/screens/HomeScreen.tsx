import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedCard } from '../components/AnimatedCard';
import { ItemCard } from '../components/ItemCard';
import { ProgressBar } from '../components/ProgressBar';
import { usePreferences } from '../hooks/usePreferences';
import { useSpaces } from '../hooks/useSpaces';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type Space } from '../types';
import { animateNextLayout } from '../utils/layoutAnimation';
import { sortSpaces } from '../utils/sortSpaces';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeList'
>;

const STAGGER_DELAY_MS = 80;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, isFromCache, refetch } = useSpaces();
  const { sortOrder, compactMode, itemsPerPage } = usePreferences();

  const entrance = useRef(new Map<string, Animated.Value>()).current;
  const animatedItems = useRef(new Set<string>()).current;
  const headerEntrance = useRef(new Animated.Value(0)).current;

  const spaces = useMemo(
    (): Space[] => sortSpaces(data ?? [], sortOrder),
    [data, sortOrder],
  );

  const handleSpacePress = useCallback(
    (space: Space): void => {
      navigation.navigate('HomeDetail', { id: space.id, name: space.name });
    },
    [navigation],
  );

  const filteredSpaces = useMemo((): Space[] => {
    const term = query.trim().toLowerCase();
    if (term === '') {
      return spaces;
    }

    return spaces.filter((space) => {
      const searchable = [
        space.name,
        space.description,
        SPACE_TYPE_LABEL[space.type],
        `piso ${space.floor}`,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [query, spaces]);

  const visibleSpaces = useMemo(
    (): Space[] => filteredSpaces.slice(0, itemsPerPage * page),
    [filteredSpaces, itemsPerPage, page],
  );

  const remainingSpaces = filteredSpaces.length - visibleSpaces.length;

  const availableShare = useMemo((): number => {
    if (spaces.length === 0) {
      return 0;
    }

    const available = spaces.filter((space) => space.available).length;
    return available / spaces.length;
  }, [spaces]);

  const entranceFor = useCallback(
    (id: string): Animated.Value => {
      const existing = entrance.get(id);

      if (existing !== undefined) {
        return existing;
      }

      const value = new Animated.Value(0);
      entrance.set(id, value);
      return value;
    },
    [entrance],
  );

  useEffect(() => {
    Animated.timing(headerEntrance, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [headerEntrance]);

  useEffect(() => {
    const pending = visibleSpaces.filter((space) => !animatedItems.has(space.id));

    if (pending.length === 0) {
      return;
    }

    pending.forEach((space) => {
      animatedItems.add(space.id);
      entranceFor(space.id).setValue(0);
    });

    Animated.stagger(
      STAGGER_DELAY_MS,
      pending.map((space) =>
        Animated.timing(entranceFor(space.id), {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [visibleSpaces, animatedItems, entranceFor]);

  const renderItem: ListRenderItem<Space> = useCallback(
    ({ item }) => {
      const progress = entranceFor(item.id);

      return (
        <Animated.View
          style={{
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <AnimatedCard
            onPress={() => handleSpacePress(item)}
            accessibilityLabel={`Ver ${item.name}`}
            testID={`space-card-${item.id}`}
          >
            <ItemCard item={item} compact={compactMode} />
          </AnimatedCard>
        </Animated.View>
      );
    },
    [compactMode, entranceFor, handleSpacePress],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.state}>
        <Ionicons name="search-outline" size={44} color={COLORS.textMuted} />
        <Text style={styles.stateTitle}>
          {query.trim() === '' ? 'Sin espacios publicados' : 'Sin resultados'}
        </Text>
        <Text style={styles.stateText}>
          {query.trim() === ''
            ? 'El catálogo del edificio está vacío por ahora. Desliza hacia abajo para volver a intentar.'
            : `No encontramos espacios para “${query.trim()}”. Prueba con otro nombre, tipo de espacio o piso.`}
        </Text>
      </View>
    ),
    [query],
  );

  const handleShowMore = useCallback((): void => {
    animateNextLayout();
    setPage((current) => current + 1);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.stateTitle}>Cargando espacios…</Text>
        <Text style={styles.stateText}>Consultando el catálogo del edificio.</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.state}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.stateTitle}>No pudimos cargar el catálogo</Text>
        <Text style={styles.stateText}>
          Revisa tu conexión a internet y vuelve a intentarlo.
        </Text>
        <AnimatedButton
          label="Reintentar"
          icon="refresh-outline"
          onPress={() => {
            void refetch();
          }}
          testID="retry-button"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre, tipo o piso…"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Buscar espacios"
          />
          <Text style={styles.resultCount}>
            {visibleSpaces.length} de {spaces.length} espacios
          </Text>
        </View>

        {isFromCache && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={18} color={COLORS.warning} />
            <Text style={styles.offlineText}>
              Mostrando datos sin red: el catálogo viene de la caché del
              dispositivo.
            </Text>
          </View>
        )}

        <Animated.View
          style={[
            styles.occupancy,
            {
              opacity: headerEntrance,
              transform: [
                {
                  translateY: headerEntrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ProgressBar
            value={availableShare}
            label="Ocupación del edificio"
            caption={`${spaces.filter((space) => space.available).length} de ${spaces.length} espacios libres ahora mismo`}
          />
        </Animated.View>

        <FlatList
          data={visibleSpaces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            remainingSpaces > 0 ? (
              <View style={styles.footer}>
                <AnimatedButton
                  label={`Ver ${remainingSpaces} espacios más`}
                  icon="chevron-down-outline"
                  variant="outline"
                  onPress={handleShowMore}
                  testID="show-more-button"
                />
              </View>
            ) : null
          }
          onRefresh={refetch}
          refreshing={isFetching}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          testID="spaces-list"
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
  resultCount: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.surface,
  },
  offlineText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.warning,
    lineHeight: 18,
  },
  occupancy: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  list: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.md,
  },
  footer: {
    marginTop: SPACING.md,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  stateTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stateText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
