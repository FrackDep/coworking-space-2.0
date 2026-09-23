import type { SortOrder } from '../hooks/usePreferences';
import type { Space } from '../types';

export function sortSpaces(spaces: Space[], sortOrder: SortOrder): Space[] {
  const sorted = [...spaces];

  if (sortOrder === 'price') {
    return sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
  }

  if (sortOrder === 'floor') {
    return sorted.sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name));
  }

  return sorted.sort((a, b) => a.name.localeCompare(b.name));
}
