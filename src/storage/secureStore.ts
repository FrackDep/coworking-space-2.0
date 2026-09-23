import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const WEB_PREFIX = 'nido.secure.';

const memorySecrets = new Map<string, string>();
let browserStorageBlocked = false;

export const secureStorageLabel: string =
  Platform.OS === 'web'
    ? 'el almacenamiento del navegador (localStorage)'
    : 'SecureStore (llavero cifrado del dispositivo)';

export async function saveSecret(key: string, value: string): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  if (browserStorageBlocked) {
    memorySecrets.set(key, value);
    return;
  }

  try {
    window.localStorage.setItem(WEB_PREFIX + key, value);
  } catch (error) {
    browserStorageBlocked = true;
    memorySecrets.set(key, value);
  }
}

export async function readSecret(key: string): Promise<string | null> {
  if (Platform.OS !== 'web') {
    return SecureStore.getItemAsync(key);
  }

  if (browserStorageBlocked) {
    return memorySecrets.get(key) ?? null;
  }

  try {
    return window.localStorage.getItem(WEB_PREFIX + key);
  } catch (error) {
    browserStorageBlocked = true;
    return memorySecrets.get(key) ?? null;
  }
}

export async function deleteSecret(key: string): Promise<void> {
  memorySecrets.delete(key);

  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  if (browserStorageBlocked) {
    return;
  }

  try {
    window.localStorage.removeItem(WEB_PREFIX + key);
  } catch (error) {
    browserStorageBlocked = true;
  }
}
