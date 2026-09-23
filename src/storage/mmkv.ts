import { Platform } from 'react-native';
import { getAllKeys, multiGet, removeItem, setItem } from './safeStorage';

interface NativeKeyValueStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

interface MMKVModule {
  MMKV: new (config: { id: string }) => NativeKeyValueStorage;
}

let nativeStorage: NativeKeyValueStorage | null = null;

if (Platform.OS !== 'web') {
  try {
    const mmkvModule = require('react-native-mmkv') as MMKVModule;
    const instance = new mmkvModule.MMKV({ id: 'nido-coworking' });
    instance.set('__healthcheck__', 'ok');
    instance.delete('__healthcheck__');
    nativeStorage = instance;
  } catch (error) {
    nativeStorage = null;
  }
}

export const isNativeStorageAvailable: boolean = nativeStorage !== null;

function resolveBackendLabel(): string {
  if (isNativeStorageAvailable) {
    return 'MMKV (almacenamiento nativo)';
  }

  if (Platform.OS === 'web') {
    return 'AsyncStorage (almacenamiento del navegador)';
  }

  return 'AsyncStorage (respaldo para Expo Go)';
}

export const storageBackendLabel: string = resolveBackendLabel();

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeToPreferences(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function readString(key: string): string | null {
  if (nativeStorage !== null) {
    return nativeStorage.getString(key) ?? null;
  }
  return memoryCache.get(key) ?? null;
}

const memoryCache = new Map<string, string>();

export async function hydrateFromAsyncStorage(): Promise<void> {
  if (nativeStorage !== null) {
    return;
  }

  const keys = await getAllKeys();
  const stored = keys.filter((key) => key.startsWith('nido.'));
  const pairs = await multiGet(stored);

  pairs.forEach(([key, value]) => {
    if (value !== null) {
      memoryCache.set(key, value);
    }
  });

  notifyListeners();
}

export async function writeString(key: string, value: string | null): Promise<void> {
  if (nativeStorage !== null) {
    if (value === null) {
      nativeStorage.delete(key);
    } else {
      nativeStorage.set(key, value);
    }
    notifyListeners();
    return;
  }

  if (value === null) {
    memoryCache.delete(key);
    await removeItem(key);
  } else {
    memoryCache.set(key, value);
    await setItem(key, value);
  }
  notifyListeners();
}

export const preferenceKeys = {
  sortOrder: 'nido.preference.sortOrder',
  compactMode: 'nido.preference.compactMode',
  itemsPerPage: 'nido.preference.itemsPerPage',
} as const;

export const cachedSpacesKey = 'nido.cache.spaces';
