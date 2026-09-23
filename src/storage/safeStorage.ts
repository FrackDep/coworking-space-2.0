import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredPair = [string, string | null];

const memoryStore = new Map<string, string>();
let memoryOnly = false;

function useMemory(): void {
  memoryOnly = true;
}

export async function getItem(key: string): Promise<string | null> {
  if (memoryOnly) {
    return memoryStore.get(key) ?? null;
  }

  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    useMemory();
    return memoryStore.get(key) ?? null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (memoryOnly) {
    memoryStore.set(key, value);
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    useMemory();
    memoryStore.set(key, value);
  }
}

export async function removeItem(key: string): Promise<void> {
  memoryStore.delete(key);

  if (memoryOnly) {
    return;
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    useMemory();
  }
}

export async function getAllKeys(): Promise<string[]> {
  if (memoryOnly) {
    return Array.from(memoryStore.keys());
  }

  try {
    const keys = await AsyncStorage.getAllKeys();
    return Array.from(keys);
  } catch (error) {
    useMemory();
    return Array.from(memoryStore.keys());
  }
}

export async function multiGet(keys: string[]): Promise<StoredPair[]> {
  if (memoryOnly) {
    return keys.map((key) => [key, memoryStore.get(key) ?? null]);
  }

  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.map(([key, value]) => [key, value]);
  } catch (error) {
    useMemory();
    return keys.map((key) => [key, memoryStore.get(key) ?? null]);
  }
}

export const safeStorage = {
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  multiGet,
};
