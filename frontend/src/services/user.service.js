import api from "./api";
export const getUsers = async (params = {}) =>
  (await api.get("/users", { params })).data;
export const createUser = async (data) => (await api.post("/users", data)).data;
export const updateUser = async (id, data) =>
  (await api.put(`/users/${id}`, data)).data;
export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;
export const getActivities = async (params = {}) =>
  (await api.get("/activities", { params })).data;
