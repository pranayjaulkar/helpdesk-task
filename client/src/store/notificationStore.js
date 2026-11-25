import { create } from "zustand";
import { notificationApi } from "../api";

export const useNotificationStore = create((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    const { data } = await notificationApi.list();
    set({ notifications: data.data });
  },

  markRead: async (id) => {
    await notificationApi.markRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n,
      ),
    }));
  },

  markAllRead: async () => {
    await notificationApi.markAllRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
}));
