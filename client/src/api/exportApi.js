import axiosInstance from './axiosInstance';

export const exportApi = {
  downloadCsv: async () => {
    const response = await axiosInstance.get('/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'internflow_data.csv');
    document.body.appendChild(link);
    link.click();
  },
  
  downloadPdf: async () => {
    const response = await axiosInstance.get('/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'internflow_report.pdf');
    document.body.appendChild(link);
    link.click();
  }
};
