import { create } from 'zustand';

type LoadingState = {
  globalLoading: boolean;
  operationLoading: Record<string, boolean>;
};

type LoadingActions = {
  setGlobalLoading: (loading: boolean) => void;
  setOperationLoading: (operation: string, loading: boolean) => void;
  isOperationLoading: (operation: string) => boolean;
};

export type LoadingStore = LoadingState & LoadingActions;

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  globalLoading: false,
  operationLoading: {},

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  setOperationLoading: (operation, loading) => {
    set((state) => ({
      operationLoading: {
        ...state.operationLoading,
        [operation]: loading,
      },
    }));
  },

  isOperationLoading: (operation) => {
    return get().operationLoading[operation] || false;
  },
}));

export const selectGlobalLoading = (state: LoadingStore) => state.globalLoading;
export const selectIsOperationLoading = (operation: string) => (state: LoadingStore) =>
  state.operationLoading[operation] || false;
