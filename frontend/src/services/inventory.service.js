import api from "./api";
export const getInventory = async (params = {}) =>
  (await api.get("/inventory", { params })).data;
export const stockIn = async (data) =>
  (await api.post("/inventory/stock-in", data)).data;
export const stockOut = async (data) =>
  (await api.post("/inventory/stock-out", data)).data;
export const getMovements = async (params = {}) =>
  (await api.get("/inventory/movements", { params })).data;
