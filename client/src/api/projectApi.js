import axiosInstance from './axiosInstance';

export const projectApi = {
  getAllProjects: async (params) => {
    const response = await axiosInstance.get('/projects', { params });
    return response.data.data;
  },
  
  getProjectById: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data.data;
  },

  createProject: async (projectData) => {
    const response = await axiosInstance.post('/projects', projectData);
    return response.data.data;
  },

  updateProject: async (id, projectData) => {
    const response = await axiosInstance.put(`/projects/${id}`, projectData);
    return response.data.data;
  },

  addMember: async (projectId, memberData) => {
    const response = await axiosInstance.post(`/projects/${projectId}/members`, memberData);
    return response.data.data;
  },

  deleteProject: async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data.data;
  },

  getProjectMembers: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}/members`);
    return response.data.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
    return response.data.data;
  }
};
