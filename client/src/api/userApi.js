import axiosInstance from './axiosInstance';

export const userApi = {
  getAllUsers: async (params) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.data;
  },

  updateProfile: async (id, profileData) => {
    const response = await axiosInstance.put(`/users/${id}`, profileData);
    return response.data.data;
  },

  getPortfolioByUuid: async (uuid) => {
    const response = await axiosInstance.get(`/users/portfolio/${uuid}`);
    return response.data.data;
  },

  uploadAvatar: async (id, formData) => {
    const response = await axiosInstance.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
};
