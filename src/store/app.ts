import { create } from "zustand";

interface AuthState {
  isLoading: boolean;
  startLoading: () => void;
  endLoading: () => void;
}

const useAppStore = create<AuthState>((set) => ({
  isLoading: false,
  startLoading: () => {
    set({ isLoading: true });
  },
  endLoading: () => {
    set({ isLoading: false });
  },
}));

export default useAppStore;
