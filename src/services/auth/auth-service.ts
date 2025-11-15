import { secureStorage } from '../storage/secure-storage';
import { passwordHasher } from './password-hasher';
import { sessionManager } from './session-manager';
import { emailValidator } from '../validation/email-validator';
import { passwordValidator } from '../validation/password-validator';
import { usernameValidator } from '../validation/username-validator';
import { AuthenticationError, RateLimitError } from '../errors/error-types';
import { errorLogger } from '../errors/error-logger';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import type { User } from '../../types/auth';

const USERS_KEY = 'users';
const RATE_LIMIT_KEY = 'auth_rate_limit';
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type StoredUser = User & { passwordHash: string };

type RateLimitData = {
  attempts: number;
  resetAt: number;
};

export const authService = {
  async checkRateLimit(email: string): Promise<void> {
    try {
      const rateLimitKey = `${RATE_LIMIT_KEY}:${email}`;
      const data = await secureStorage.getItem<RateLimitData>(rateLimitKey);

      if (!data) {
        return;
      }

      if (Date.now() > data.resetAt) {
        await secureStorage.removeItem(rateLimitKey);
        return;
      }

      if (data.attempts >= MAX_ATTEMPTS) {
        const retryAfterMs = data.resetAt - Date.now();
        throw new RateLimitError(
          ERROR_MESSAGES.auth.rateLimitExceeded,
          retryAfterMs,
          { email, attempts: data.attempts }
        );
      }
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      errorLogger.warn('Failed to check rate limit', error as Error, { email });
    }
  },

  async recordFailedAttempt(email: string): Promise<void> {
    try {
      const rateLimitKey = `${RATE_LIMIT_KEY}:${email}`;
      const data = await secureStorage.getItem<RateLimitData>(rateLimitKey);

      const newData: RateLimitData = {
        attempts: (data?.attempts || 0) + 1,
        resetAt: data?.resetAt || Date.now() + RATE_LIMIT_WINDOW_MS,
      };

      await secureStorage.setItem(rateLimitKey, newData);
    } catch (error) {
      errorLogger.warn('Failed to record failed attempt', error as Error, { email });
    }
  },

  async clearRateLimit(email: string): Promise<void> {
    try {
      const rateLimitKey = `${RATE_LIMIT_KEY}:${email}`;
      await secureStorage.removeItem(rateLimitKey);
    } catch (error) {
      errorLogger.warn('Failed to clear rate limit', error as Error, { email });
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    const normalizedEmail = emailValidator.validateOrThrow(email);
    passwordValidator.validateOrThrow(password);

    await this.checkRateLimit(normalizedEmail);

    try {
      const users = await secureStorage.getItem<StoredUser[]>(USERS_KEY) || [];
      const user = users.find((u) => u.email === normalizedEmail);

      if (!user) {
        await this.recordFailedAttempt(normalizedEmail);
        throw new AuthenticationError(ERROR_MESSAGES.auth.invalidCredentials, 'INVALID_CREDENTIALS');
      }

      const isPasswordValid = await passwordHasher.verify(password, user.passwordHash);

      if (!isPasswordValid) {
        await this.recordFailedAttempt(normalizedEmail);
        throw new AuthenticationError(ERROR_MESSAGES.auth.invalidCredentials, 'INVALID_CREDENTIALS');
      }

      await this.clearRateLimit(normalizedEmail);

      const { passwordHash: _, ...userWithoutPassword } = user;
      await sessionManager.saveSession(userWithoutPassword);

      errorLogger.info('User signed in successfully', { userId: user.id, email: normalizedEmail });

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof RateLimitError) {
        throw error;
      }

      errorLogger.error('Sign in failed', error as Error, { email: normalizedEmail });
      throw new AuthenticationError(ERROR_MESSAGES.generic.somethingWentWrong, 'SIGN_IN_ERROR');
    }
  },

  async signUp(name: string, username: string, email: string, password: string): Promise<User> {
    const trimmedName = name.trim();
    const normalizedEmail = emailValidator.validateOrThrow(email);
    const normalizedUsername = usernameValidator.validateOrThrow(username);

    passwordValidator.validateOrThrow(password, {
      email: normalizedEmail,
      username: normalizedUsername,
      name: trimmedName,
    });

    try {
      const users = await secureStorage.getItem<StoredUser[]>(USERS_KEY) || [];

      const emailExists = users.some((u) => u.email === normalizedEmail);
      if (emailExists) {
        throw new AuthenticationError(ERROR_MESSAGES.auth.emailAlreadyExists, 'EMAIL_EXISTS');
      }

      const usernameExists = users.some((u) => u.username === normalizedUsername);
      if (usernameExists) {
        throw new AuthenticationError(ERROR_MESSAGES.auth.usernameAlreadyExists, 'USERNAME_EXISTS');
      }

      const passwordHash = await passwordHasher.hash(password);

      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: trimmedName,
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date(),
        activeDays: 1,
        lastAccessDate: new Date().toISOString(),
      };

      users.push(newUser);
      await secureStorage.setItem(USERS_KEY, users);

      const { passwordHash: _, ...userWithoutPassword } = newUser;
      await sessionManager.saveSession(userWithoutPassword);

      errorLogger.info('User signed up successfully', { userId: newUser.id, email: normalizedEmail });

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      errorLogger.error('Sign up failed', error as Error, { email: normalizedEmail, username: normalizedUsername });
      throw new AuthenticationError(ERROR_MESSAGES.generic.somethingWentWrong, 'SIGN_UP_ERROR');
    }
  },

  async signOut(): Promise<void> {
    try {
      await sessionManager.clearSession();
      errorLogger.info('User signed out successfully');
    } catch (error) {
      errorLogger.error('Sign out failed', error as Error);
      throw error;
    }
  },

  async signInWithProvider(provider: 'apple' | 'google'): Promise<User> {
    try {
      const mockUser: User = {
        id: `${provider}_${Date.now()}`,
        name: provider === 'apple' ? 'Apple User' : 'Google User',
        username: `${provider}_user_${Date.now()}`,
        email: `user@${provider}.com`,
        createdAt: new Date(),
        activeDays: 1,
        lastAccessDate: new Date().toISOString(),
      };

      await sessionManager.saveSession(mockUser);

      errorLogger.info(`User signed in with ${provider}`, { userId: mockUser.id });

      return mockUser;
    } catch (error) {
      errorLogger.error(`${provider} sign in failed`, error as Error);
      throw new AuthenticationError(`Erro ao fazer login com ${provider}`, 'PROVIDER_SIGN_IN_ERROR');
    }
  },

  async loadSession(): Promise<User | null> {
    return await sessionManager.loadSession();
  },

  async refreshSession(user: User): Promise<void> {
    await sessionManager.refreshSession(user);
  },
};
