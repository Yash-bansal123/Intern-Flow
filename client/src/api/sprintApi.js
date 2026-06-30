import axiosInstance from './axiosInstance';

export const sprintApi = {
  getProjectSprints: async (projectId) => {
    const response = await axiosInstance.get(`/sprints/project/${projectId}`);
    return response.data.data;
  },

  createSprint: async (sprintData) => {
    const response = await axiosInstance.post('/sprints', sprintData);
    return response.data.data;
  },

  getSprintById: async (id) => {
    const response = await axiosInstance.get(`/sprints/${id}`);
    return response.data.data;
  },

  updateSprint: async (id, sprintData) => {
    const response = await axiosInstance.put(`/sprints/${id}`, sprintData);
    return response.data.data;
  },

  deleteSprint: async (id) => {
    const response = await axiosInstance.delete(`/sprints/${id}`);
    return response.data.data;
  }
};
