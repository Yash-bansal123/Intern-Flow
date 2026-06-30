import axiosInstance from './axiosInstance';

export const commentApi = {
  getTaskComments: async (taskId) => {
    const response = await axiosInstance.get(`/comments/task/${taskId}`);
    return response.data.data;
  },
  
  createComment: async (commentData) => {
    const response = await axiosInstance.post('/comments', commentData);
    return response.data.data;
  },

  updateComment: async (id, content) => {
    const response = await axiosInstance.put(`/comments/${id}`, { content });
    return response.data.data;
  },

  deleteComment: async (id) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data.data;
  }
};
