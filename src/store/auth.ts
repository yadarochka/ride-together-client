import { create } from "zustand";
import { type UserDto } from "../api/type";

interface AuthState {
  isAuth: boolean;
  user: UserDto | null;
  login: (user: UserDto) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuth: JSON.parse(localStorage.getItem("user")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  login: (user) => {
    set({ isAuth: true, user });
  },
  logout: () => {
    set({ isAuth: false, user: null });
  },
}));

useAuthStore.subscribe((state) => {
  localStorage.setItem("user", JSON.stringify(state.user));
  localStorage.setItem("isAuth", JSON.stringify(state.isAuth));
});

export default useAuthStore;
