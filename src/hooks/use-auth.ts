import { useAuthStore } from '../stores/auth-store';
import { useUserStore } from '../stores/user-store';
import { useLoadingStore } from '../stores/loading-store';
import { authService } from '../services/auth/auth-service';
import { errorLogger } from '../services/errors/error-logger';
import { useCallback, useEffect } from 'react';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const setUser = useAuthStore((state) => state.setUser);
  const signOutStore = useAuthStore((state) => state.signOut);
  const initialize = useAuthStore((state) => state.initialize);

  const updateActiveDays = useUserStore((state) => state.updateActiveDays);
  const setOperationLoading = useLoadingStore((state) => state.setOperationLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await authService.loadSession();
        if (sessionUser) {
          setUser(sessionUser);
          updateActiveDays();
        }
      } catch (error) {
        errorLogger.error('Failed to initialize auth', error as Error);
      } finally {
        await initialize();
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setOperationLoading('signIn', true);
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      updateActiveDays();
    } finally {
      setOperationLoading('signIn', false);
    }
  }, [setUser, setOperationLoading, updateActiveDays]);

  const signUp = useCallback(async (name: string, username: string, email: string, password: string) => {
    setOperationLoading('signUp', true);
    try {
      const user = await authService.signUp(name, username, email, password);
      setUser(user);
      updateActiveDays();
    } finally {
      setOperationLoading('signUp', false);
    }
  }, [setUser, setOperationLoading, updateActiveDays]);

  const signOut = useCallback(async () => {
    setOperationLoading('signOut', true);
    try {
      await authService.signOut();
      signOutStore();
    } finally {
      setOperationLoading('signOut', false);
    }
  }, [signOutStore, setOperationLoading]);

  const signInWithApple = useCallback(async () => {
    setOperationLoading('signInWithApple', true);
    try {
      const user = await authService.signInWithProvider('apple');
      setUser(user);
      updateActiveDays();
    } finally {
      setOperationLoading('signInWithApple', false);
    }
  }, [setUser, setOperationLoading, updateActiveDays]);

  const signInWithGoogle = useCallback(async () => {
    setOperationLoading('signInWithGoogle', true);
    try {
      const user = await authService.signInWithProvider('google');
      setUser(user);
      updateActiveDays();
    } finally {
      setOperationLoading('signInWithGoogle', false);
    }
  }, [setUser, setOperationLoading, updateActiveDays]);

  return {
    user,
    isAuthenticated,
    isInitializing,
    signIn,
    signUp,
    signOut,
    signInWithApple,
    signInWithGoogle,
  };
}
