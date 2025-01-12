import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IAuth } from "../domain/auth";
interface UserState {
  user: IAuth;
  setUser: (user: IAuth) => void;
}

export const useUserStore = create<UserState>()(
  persist<UserState>(
    (set) => ({
      user: {} as IAuth,
      setUser: (user: IAuth) => set({ user }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
