import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from '../errors/error-logger';
import {
  createStorageSaveError,
  createStorageLoadError,
  createStorageDeleteError,
  createStorageCorruptedError,
} from './storage-errors';

const STORAGE_PREFIX = '@TrackFit:';

export const secureStorage = {
  async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(`${STORAGE_PREFIX}${key}`, value);
    } catch (error) {
      errorLogger.error('Failed to save to secure storage', error as Error, { key });
      throw createStorageSaveError(key, error as Error);
    }
  },

  async getSecure(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(`${STORAGE_PREFIX}${key}`);
      return value;
    } catch (error) {
      errorLogger.error('Failed to load from secure storage', error as Error, { key });
      throw createStorageLoadError(key, error as Error);
    }
  },

  async removeSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      errorLogger.error('Failed to delete from secure storage', error as Error, { key });
      throw createStorageDeleteError(key, error as Error);
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, jsonValue);
    } catch (error) {
      errorLogger.error('Failed to save to storage', error as Error, { key });
      throw createStorageSaveError(key, error as Error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (jsonValue === null) {
        return null;
      }

      try {
        return JSON.parse(jsonValue) as T;
      } catch (parseError) {
        errorLogger.error('Failed to parse storage data', parseError as Error, { key });
        throw createStorageCorruptedError(key);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('corrupted')) {
        throw error;
      }
      errorLogger.error('Failed to load from storage', error as Error, { key });
      throw createStorageLoadError(key, error as Error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      errorLogger.error('Failed to delete from storage', error as Error, { key });
      throw createStorageDeleteError(key, error as Error);
    }
  },

  async clear(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter(k => k.startsWith(STORAGE_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      errorLogger.error('Failed to clear storage', error as Error);
      throw createStorageDeleteError('all', error as Error);
    }
  },
};
