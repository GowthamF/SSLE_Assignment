import { create } from "zustand";

interface AuthState {
  isAuth: boolean;

  actions: {
    setIsAuth: (isAuth: boolean) => void;
  };
}

const useAuthStore = create<AuthState>()((set) => ({
  isAuth: true,

  actions: {
    setIsAuth: (isAuth) => set({ isAuth }),
  },
}));

export default useAuthStore;
