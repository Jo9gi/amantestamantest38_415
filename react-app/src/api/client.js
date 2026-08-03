import axios from "axios";
import { STORAGE_KEYS, ROUTES } from "../constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'token_not_valid') {
      // Clear invalid tokens
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      // Only redirect if not already on login/register pages
      if (!window.location.pathname.includes(ROUTES.LOGIN) && !window.location.pathname.includes(ROUTES.REGISTER)) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
