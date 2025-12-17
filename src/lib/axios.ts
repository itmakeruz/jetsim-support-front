import axios from "axios";
export const API_VERSION = "/api/v1";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + API_VERSION, // .env dan oladi
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("e_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const lang = localStorage.getItem("e_langauge");
  if (lang) {
    config.headers["Accept-Language"] = lang;
  }

  // Set Content-Type to application/json only if not FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default instance;
