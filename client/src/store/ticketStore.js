import { create } from "zustand";
import { ticketApi } from "../api";

export const useTicketStore = create((set, get) => ({
  tickets: [],
  ticket: null,
  activity: [],
  loading: false,

  fetchTickets: async (filters = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v),
    );
    set({ loading: true });
    try {
      const { data } = await ticketApi.list(params);
      set({ tickets: data.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchTicket: async (id) => {
    set({ loading: true, ticket: null, activity: [] });
    try {
      const { data } = await ticketApi.get(id);
      set({ ticket: data.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchActivity: async (id) => {
    const { data } = await ticketApi.activity(id);
    set({ activity: data.data });
  },

  createTicket: async (payload) => {
    const { data } = await ticketApi.create(payload);
    return data.data;
  },

  updateTicket: async (id, payload) => {
    const { data } = await ticketApi.update(id, payload);
    return data.data;
  },

  deleteTicket: async (id) => {
    await ticketApi.remove(id);
    set((state) => ({
      tickets: state.tickets.filter((t) => t._id !== id),
      ticket: null,
    }));
  },

  changeStatus: async (id, status) => {
    const { data } = await ticketApi.updateStatus(id, status);
    set((state) => ({
      ticket: {
        ...state.ticket,
        status: data.data.status,
        resolvedAt: data.data.resolvedAt,
      },
    }));
    get().fetchActivity(id);
  },

  changePriority: async (id, priority) => {
    const { data } = await ticketApi.updatePriority(id, priority);
    set((state) => ({
      ticket: { ...state.ticket, priority: data.data.priority },
    }));
    get().fetchActivity(id);
  },

  addComment: async (id, message) => {
    const { data } = await ticketApi.addComment(id, message);
    set((state) => ({
      ticket: {
        ...state.ticket,
        comments: [...state.ticket.comments, data.data],
      },
    }));
    get().fetchActivity(id);
  },
}));
