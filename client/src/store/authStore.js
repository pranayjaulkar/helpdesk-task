import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (credentials) => {
        const { data } = await authApi.login(credentials);
        set({ user: data.data.user, token: data.data.token });
      },

      register: async (payload) => {
        const { data } = await authApi.register(payload);
        set({ user: data.data.user, token: data.data.token });
      },

      logout: () => set({ user: null, token: null }),
    }),
    { name: "helpdesk-auth" },
  ),
);
