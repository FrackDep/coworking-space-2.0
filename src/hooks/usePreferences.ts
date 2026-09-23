import { useCallback, useEffect, useState } from 'react';

import {
  isNativeStorageAvailable,
  preferenceKeys,
  readString,
  storageBackendLabel,
  subscribeToPreferences,
  writeString,
} from '../storage/mmkv';

export type SortOrder = 'name' | 'price' | 'floor';

export interface Preferences {
  sortOrder: SortOrder;
  compactMode: boolean;
  itemsPerPage: number;
  isNativeStorage: boolean;
  storageLabel: string;
  setSortOrder: (value: SortOrder) => void;
  setCompactMode: (value: boolean) => void;
  setItemsPerPage: (value: number) => void;
}

const DEFAULT_SORT_ORDER: SortOrder = 'name';
const DEFAULT_COMPACT_MODE = false;
const DEFAULT_ITEMS_PER_PAGE = 10;

function toSortOrder(value: string | null): SortOrder {
  if (value === 'price' || value === 'floor' || value === 'name') {
    return value;
  }
  return DEFAULT_SORT_ORDER;
}

function toBoolean(value: string | null): boolean {
  if (value === null) {
    return DEFAULT_COMPACT_MODE;
  }
  return value === 'true';
}

function toItemsPerPage(value: string | null): number {
  const parsed = Number(value);
  if (parsed === 5 || parsed === 10 || parsed === 20) {
    return parsed;
  }
  return DEFAULT_ITEMS_PER_PAGE;
}

export function usePreferences(): Preferences {
  const [sortOrder, setSortOrderState] = useState<SortOrder>(() =>
    toSortOrder(readString(preferenceKeys.sortOrder)),
  );
  const [compactMode, setCompactModeState] = useState<boolean>(() =>
    toBoolean(readString(preferenceKeys.compactMode)),
  );
  const [itemsPerPage, setItemsPerPageState] = useState<number>(() =>
    toItemsPerPage(readString(preferenceKeys.itemsPerPage)),
  );

  const syncFromStorage = useCallback((): void => {
    setSortOrderState(toSortOrder(readString(preferenceKeys.sortOrder)));
    setCompactModeState(toBoolean(readString(preferenceKeys.compactMode)));
    setItemsPerPageState(toItemsPerPage(readString(preferenceKeys.itemsPerPage)));
  }, []);

  useEffect(() => {
    syncFromStorage();

    const unsubscribe = subscribeToPreferences(syncFromStorage);
    return unsubscribe;
  }, [syncFromStorage]);

  const setSortOrder = useCallback((value: SortOrder): void => {
    setSortOrderState(value);
    void writeString(preferenceKeys.sortOrder, value);
  }, []);

  const setCompactMode = useCallback((value: boolean): void => {
    setCompactModeState(value);
    void writeString(preferenceKeys.compactMode, String(value));
  }, []);

  const setItemsPerPage = useCallback((value: number): void => {
    setItemsPerPageState(value);
    void writeString(preferenceKeys.itemsPerPage, String(value));
  }, []);

  return {
    sortOrder,
    compactMode,
    itemsPerPage,
    isNativeStorage: isNativeStorageAvailable,
    storageLabel: storageBackendLabel,
    setSortOrder,
    setCompactMode,
    setItemsPerPage,
  };
}
