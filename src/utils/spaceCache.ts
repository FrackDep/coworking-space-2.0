import type { Space, SpaceType } from '../types';
import { imageForType } from './spaceMapper';

export interface CachedSpace {
  id: string;
  name: string;
  type: SpaceType;
  description: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  available: boolean;
}

export function toCachedSpaces(spaces: Space[]): CachedSpace[] {
  return spaces.map((space) => ({
    id: space.id,
    name: space.name,
    type: space.type,
    description: space.description,
    floor: space.floor,
    capacity: space.capacity,
    pricePerHour: space.pricePerHour,
    available: space.available,
  }));
}

export function fromCachedSpaces(cached: CachedSpace[]): Space[] {
  return cached.map((space) => ({
    ...space,
    image: imageForType(space.type),
  }));
}

export function serializeCache(spaces: Space[]): string {
  return JSON.stringify(toCachedSpaces(spaces));
}

export function parseCache(raw: string): Space[] {
  const parsed = JSON.parse(raw) as CachedSpace[];

  if (!Array.isArray(parsed)) {
    return [];
  }

  return fromCachedSpaces(parsed);
}
