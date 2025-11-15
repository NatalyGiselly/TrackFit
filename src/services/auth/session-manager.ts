import { secureStorage } from '../storage/secure-storage';
import type { User } from '../../types/auth';
import { errorLogger } from '../errors/error-logger';

const SESSION_KEY = 'session';
const SESSION_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type SessionData = {
  user: User;
  expiresAt: number;
};

export const sessionManager = {
  async saveSession(user: User): Promise<void> {
    try {
      const sessionData: SessionData = {
        user,
        expiresAt: Date.now() + SESSION_TIMEOUT_MS,
      };

      await secureStorage.setItem(SESSION_KEY, sessionData);
    } catch (error) {
      errorLogger.error('Failed to save session', error as Error, { userId: user.id });
      throw error;
    }
  },

  async loadSession(): Promise<User | null> {
    try {
      const sessionData = await secureStorage.getItem<SessionData>(SESSION_KEY);

      if (!sessionData) {
        return null;
      }

      if (Date.now() > sessionData.expiresAt) {
        await this.clearSession();
        return null;
      }

      return sessionData.user;
    } catch (error) {
      errorLogger.error('Failed to load session', error as Error);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      await secureStorage.removeItem(SESSION_KEY);
    } catch (error) {
      errorLogger.error('Failed to clear session', error as Error);
      throw error;
    }
  },

  async refreshSession(user: User): Promise<void> {
    await this.saveSession(user);
  },

  async isSessionValid(): Promise<boolean> {
    const user = await this.loadSession();
    return user !== null;
  },
};
