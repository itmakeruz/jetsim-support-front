import axios from "axios";
import { LANG_KEY, TOKEN_KEY } from "@/constants/staticDatas";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env dan oladi
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const lang = localStorage.getItem(LANG_KEY) || "ru";
  if (lang) {
    config.headers["Accept-Language"] = lang;
  }

  // Set Content-Type to application/json only if not FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept-Language"] = lang;
  }

  return config;
});

export default instance;
