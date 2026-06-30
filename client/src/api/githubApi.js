import axiosInstance from './axiosInstance';

export const githubApi = {
  getMyStats: async () => {
    const response = await axiosInstance.get('/github/my-stats');
    return response.data.data;
  },
  
  getUserStats: async (uuid) => {
    const response = await axiosInstance.get(`/github/user/${uuid}`);
    return response.data.data;
  },

  getStatsByUsername: async (username) => {
    const response = await axiosInstance.get(`/github/stats/${username}`);
    return response.data.data;
  }
};
