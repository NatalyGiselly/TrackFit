import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateActiveDaysStreak } from '../utils/date-helpers';

type UserProgress = {
  activeDays: number;
  lastAccessDate: string | null;
  workoutCount: number;
  calories: number;
  minutes: number;
};

type UserState = UserProgress;

type UserActions = {
  updateActiveDays: () => void;
  updateProgress: (data: Partial<UserProgress>) => void;
  incrementWorkout: () => void;
  addCalories: (calories: number) => void;
  addMinutes: (minutes: number) => void;
  reset: () => void;
};

export type UserStore = UserState & UserActions;

const initialState: UserProgress = {
  activeDays: 0,
  lastAccessDate: null,
  workoutCount: 0,
  calories: 0,
  minutes: 0,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateActiveDays: () => {
        const state = get();
        const newStreak = calculateActiveDaysStreak(
          state.lastAccessDate,
          state.activeDays
        );

        set({
          activeDays: newStreak,
          lastAccessDate: new Date().toISOString(),
        });
      },

      updateProgress: (data) => {
        set((state) => ({
          ...state,
          ...data,
        }));
      },

      incrementWorkout: () => {
        set((state) => ({
          workoutCount: state.workoutCount + 1,
        }));
      },

      addCalories: (calories) => {
        set((state) => ({
          calories: state.calories + calories,
        }));
      },

      addMinutes: (minutes) => {
        set((state) => ({
          minutes: state.minutes + minutes,
        }));
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const selectActiveDays = (state: UserStore) => state.activeDays;
export const selectWorkoutCount = (state: UserStore) => state.workoutCount;
export const selectCalories = (state: UserStore) => state.calories;
export const selectMinutes = (state: UserStore) => state.minutes;
export const selectProgress = (state: UserStore) => ({
  workoutCount: state.workoutCount,
  calories: state.calories,
  minutes: state.minutes,
});
