import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        const newToken = await refreshToken();

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        const { logoutUser } = useAuthStore.getState();
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
