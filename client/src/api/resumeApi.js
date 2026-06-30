import axiosInstance from './axiosInstance';

export const resumeApi = {
  getContributions: async (userId = 'me') => {
    const response = await axiosInstance.get(`/resume/user/${userId}`);
    return response.data.data;
  },
  
  generateContribution: async (data) => {
    const response = await axiosInstance.post('/resume/generate', data);
    return response.data.data;
  },

  generateAllContributions: async () => {
    const response = await axiosInstance.post('/resume/generate-all');
    return response.data;
  },

  updateContribution: async (id, text) => {
    const response = await axiosInstance.put(`/resume/${id}`, { contribution_text: text });
    return response.data.data;
  },

  deleteContribution: async (id) => {
    const response = await axiosInstance.delete(`/resume/${id}`);
    return response.data.data;
  }
};
