import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const assetOrigin = baseURL.replace(/\/api\/?$/, "");

const normalizeAssets = (value) => {
  if (Array.isArray(value)) return value.map(normalizeAssets);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeAssets(item)]),
    );
  if (typeof value === "string" && value.startsWith("/uploads/"))
    return `${assetOrigin}${value}`;
  return value;
};

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use((response) => {
  response.data = normalizeAssets(response.data);
  return response;
});

export default api;
