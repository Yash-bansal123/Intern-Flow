import axiosInstance from './axiosInstance';

export const internshipApi = {
  // Fetch ALL internships (admin / mentor / coordinator)
  getAllInternships: async () => {
    const response = await axiosInstance.get('/internships/all');
    return response.data.data;
  },

  getUserInternships: async (userId = 'me') => {
    const response = await axiosInstance.get(`/internships/user/${userId}`);
    return response.data.data;
  },
  
  getInternshipById: async (id) => {
    const response = await axiosInstance.get(`/internships/${id}`);
    return response.data.data;
  },

  getInternshipLogs: async (id) => {
    const response = await axiosInstance.get(`/internships/${id}/logs`);
    return response.data.data;
  },

  addDailyLog: async (id, logData) => {
    const response = await axiosInstance.post(`/internships/${id}/logs`, logData);
    return response.data.data;
  },

  getFeedback: async (id) => {
    const response = await axiosInstance.get(`/feedback/internship/${id}/mentor`);
    return response.data.data;
  },

  getEvaluations: async (id) => {
    const response = await axiosInstance.get(`/feedback/internship/${id}/weekly`);
    return response.data.data;
  }
};
