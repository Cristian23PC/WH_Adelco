import { refreshToken } from '@/api/Keycloak';
import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await refreshToken();
    }

    return Promise.reject(error);
  }
);

export const setToken = (token?: string, refreshToken?: string) => {
  if (token) {
    localStorage.setItem('access_token', token);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('access_token');
    axiosInstance.defaults.headers.common.Authorization = undefined;
  }

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  } else {
    localStorage.removeItem('refresh_token');
  }
};

export default axiosInstance;
