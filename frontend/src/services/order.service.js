import api from "./api";
export const getOrders = async (params = {}) =>
  (await api.get("/orders", { params })).data;
export const getOrder = async (id) => (await api.get(`/orders/${id}`)).data;
export const createOrder = async (data) =>
  (await api.post("/orders", data)).data;
export const updateOrder = async (id, data) =>
  (await api.put(`/orders/${id}`, data)).data;
export const deleteOrder = async (id) =>
  (await api.delete(`/orders/${id}`)).data;
