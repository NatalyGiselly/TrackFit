export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string = 'AUTH_ERROR',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code: string = 'VALIDATION_ERROR',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string = 'STORAGE_ERROR',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public code: string = 'NETWORK_ERROR',
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfterMs: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export type AppError =
  | AuthenticationError
  | ValidationError
  | StorageError
  | NetworkError
  | RateLimitError;
