import axiosInstance from './axiosInstance';

export const skillApi = {
  getMasterSkills: async () => {
    const response = await axiosInstance.get('/skills/master');
    return response.data.data;
  },
  
  getUserSkills: async (userId = 'me') => {
    const response = await axiosInstance.get(`/skills/user/${userId}`);
    return response.data.data;
  },

  addUserSkill: async (skillData) => {
    const response = await axiosInstance.post('/skills/user', skillData);
    return response.data.data;
  },

  updateProgress: async (progressData) => {
    const response = await axiosInstance.post('/skills/progress', progressData);
    return response.data.data;
  }
};
