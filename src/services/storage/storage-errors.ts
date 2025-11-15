import { StorageError } from '../errors/error-types';
import { ERROR_MESSAGES } from '../../constants/error-messages';

export function createStorageSaveError(key: string, originalError?: Error): StorageError {
  return new StorageError(
    ERROR_MESSAGES.storage.saveFailed,
    'STORAGE_SAVE_ERROR',
    { key, originalError: originalError?.message }
  );
}

export function createStorageLoadError(key: string, originalError?: Error): StorageError {
  return new StorageError(
    ERROR_MESSAGES.storage.loadFailed,
    'STORAGE_LOAD_ERROR',
    { key, originalError: originalError?.message }
  );
}

export function createStorageDeleteError(key: string, originalError?: Error): StorageError {
  return new StorageError(
    ERROR_MESSAGES.storage.deleteFailed,
    'STORAGE_DELETE_ERROR',
    { key, originalError: originalError?.message }
  );
}

export function createStorageCorruptedError(key: string): StorageError {
  return new StorageError(
    ERROR_MESSAGES.storage.corruptedData,
    'STORAGE_CORRUPTED',
    { key }
  );
}

export function createStorageQuotaError(key: string): StorageError {
  return new StorageError(
    ERROR_MESSAGES.storage.quotaExceeded,
    'STORAGE_QUOTA_EXCEEDED',
    { key }
  );
}
