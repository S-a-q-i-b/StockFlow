import api from "./api";
export const loginUser = async (payload) =>
  (await api.post("/auth/login", payload)).data;
export const registerUser = async (payload) =>
  (await api.post("/auth/register", payload)).data;
export const logoutUser = async () => (await api.post("/auth/logout")).data;
export const getCurrentUser = async () => (await api.get("/auth/me")).data;
export const updateProfile = async (payload) =>
  (await api.put("/auth/profile", payload)).data;
export const changePassword = async (payload) =>
  (await api.put("/auth/password", payload)).data;

export const removeProfileImage = async () =>
  (await api.delete("/auth/profile/image")).data;
