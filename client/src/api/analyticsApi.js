import axiosInstance from './axiosInstance';

export const analyticsApi = {
  getSystemOverview: async () => {
    const response = await axiosInstance.get('/analytics/overview');
    return response.data.data;
  },
  
  getUserAnalytics: async (userId = 'me') => {
    const response = await axiosInstance.get(`/analytics/user/${userId}`);
    return response.data.data;
  },

  getInternProgress: async () => {
    const response = await axiosInstance.get('/analytics/intern-progress');
    return response.data.data;
  }
};
