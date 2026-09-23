import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ItemCard } from '../components/ItemCard';
import { useSpaces } from '../hooks/useSpaces';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { SPACE_TYPE_LABEL, type Space } from '../types';
import type { HomeStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeList'
>;

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, isFetching, refetch } = useSpaces();

  const spaces = useMemo((): Space[] => data ?? [], [data]);

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

  const renderItem: ListRenderItem<Space> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={handleSpacePress} />,
    [handleSpacePress],
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

  if (isLoading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.stateTitle}>Cargando espacios…</Text>
        <Text style={styles.stateText}>
          Consultando el catálogo del edificio.
        </Text>
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
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          onPress={() => {
            void refetch();
          }}
          accessibilityRole="button"
          testID="retry-button"
        >
          <Ionicons name="refresh-outline" size={18} color={COLORS.background} />
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
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
            {filteredSpaces.length} de {spaces.length} espacios
          </Text>
        </View>

        <FlatList
          data={filteredSpaces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
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
  list: {
    padding: SPACING.base,
    flexGrow: 1,
  },
  separator: {
    height: SPACING.md,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  retryButtonPressed: {
    opacity: 0.75,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.background,
  },
});
