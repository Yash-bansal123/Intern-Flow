import axios from 'axios';
import { store } from '../store/store';
import { logout, setCredentials } from '../store/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        store.dispatch(setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken
        }));
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
