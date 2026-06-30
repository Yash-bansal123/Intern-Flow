import axiosInstance from './axiosInstance';

export const placementApi = {
  getProgress: async (userId = 'me') => {
    const response = await axiosInstance.get(`/placement/progress/${userId}`);
    return response.data.data;
  },
  
  updateProgress: async (progressData) => {
    const response = await axiosInstance.put('/placement/progress', progressData);
    return response.data.data;
  },

  getInterviews: async (userId = 'me') => {
    const response = await axiosInstance.get(`/placement/interviews/${userId}`);
    return response.data.data;
  },

  scheduleInterview: async (userId, interviewData) => {
    const response = await axiosInstance.post(`/placement/interviews/${userId}`, interviewData);
    return response.data.data;
  },

  completeInterview: async (interviewId, data) => {
    const response = await axiosInstance.put(`/placement/interviews/${interviewId}`, data);
    return response.data.data;
  },

  getInternSkillsMatrix: async () => {
    const response = await axiosInstance.get('/placement/skills-matrix');
    return response.data.data;
  },

  getTopInterns: async () => {
    const response = await axiosInstance.get('/placement/top-interns');
    return response.data.data;
  },

  uploadResume: async (formData) => {
    const response = await axiosInstance.post('/placement/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
};
