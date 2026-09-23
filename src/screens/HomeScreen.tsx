import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ItemCard } from '../components/ItemCard';
import { MOCK_SPACES } from '../data/mockData';
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

  const handleSpacePress = useCallback(
    (space: Space): void => {
      navigation.navigate('HomeDetail', { id: space.id, name: space.name });
    },
    [navigation],
  );

  const filteredSpaces = useMemo((): Space[] => {
    const term = query.trim().toLowerCase();
    if (term === '') {
      return MOCK_SPACES;
    }

    return MOCK_SPACES.filter((space) => {
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
  }, [query]);

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
      <View style={styles.empty}>
        <Ionicons name="search-outline" size={44} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Sin resultados</Text>
        <Text style={styles.emptyText}>
          No encontramos espacios para “{query.trim()}”. Prueba con otro nombre,
          tipo de espacio o piso.
        </Text>
      </View>
    ),
    [query],
  );

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
            {filteredSpaces.length} de {MOCK_SPACES.length} espacios
          </Text>
        </View>

        <FlatList
          data={filteredSpaces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
