import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { SPACE_TYPE_LABEL, type Space } from '../types';
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
        <Text style={styles.type}>{SPACE_TYPE_LABEL[item.type]}</Text>

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
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: '#21262d',
    borderColor: '#61DAFB',
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: 16,
    gap: 4,
  },
  type: {
    fontSize: 11,
    fontWeight: '600',
    color: '#61DAFB',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e6edf3',
  },
  description: {
    fontSize: 13,
    color: '#8b949e',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: '#6e7681',
  },
  metaDot: {
    fontSize: 12,
    color: '#30363d',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3fb950',
    marginTop: 8,
  },
});
