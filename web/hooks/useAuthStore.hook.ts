import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token?: string;
  userId?: number;
  roles?: string[];

  actions: {
    setUser: (token: string, userId: number, roles: string[]) => void;
  };
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      userId: undefined,
      roles: undefined,

      actions: {
        setUser: (token, userId, roles) => set({ token, userId, roles }),
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
