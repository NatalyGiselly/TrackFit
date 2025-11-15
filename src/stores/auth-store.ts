import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/auth';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initStartTime: number;
};

type AuthActions = {
  setUser: (user: User | null) => void;
  signOut: () => void;
  initialize: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
};

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      initStartTime: Date.now(),

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      initialize: async () => {
        const MIN_SPLASH_DURATION = 1000; // 1 segundo
        const startTime = get().initStartTime;
        const elapsed = Date.now() - startTime;

        // Se passou menos de 1 segundo, aguardar o tempo restante
        if (elapsed < MIN_SPLASH_DURATION) {
          const remainingTime = MIN_SPLASH_DURATION - elapsed;
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        set({ isInitializing: false });
      },

      updateUser: (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: { ...currentUser, ...data },
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsInitializing = (state: AuthStore) => state.isInitializing;
