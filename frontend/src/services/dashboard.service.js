import api from "./api";
export const getDashboard = async (params = {}) =>
  (await api.get("/dashboard", { params })).data;
