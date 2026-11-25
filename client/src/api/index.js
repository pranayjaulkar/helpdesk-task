import api from "./axios";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

export const ticketApi = {
  list: (params) => api.get("/tickets", { params }),
  get: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post("/tickets", data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  remove: (id) => api.delete(`/tickets/${id}`),
  updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  updatePriority: (id, priority) =>
    api.patch(`/tickets/${id}/priority`, { priority }),
  activity: (id) => api.get(`/tickets/${id}/activity`),
  addComment: (id, message) => api.post(`/tickets/${id}/comments`, { message }),
};

export const notificationApi = {
  list: () => api.get("/notifications"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};
