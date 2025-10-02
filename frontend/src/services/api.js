import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Voice Command API
export const voiceApi = {
  processVoiceCommand: (data) => api.post('/voice/process', data),
  testEndpoint: () => api.get('/voice/test'),
};

// Sales Data API
export const salesApi = {
  getAllSalesData: () => api.get('/sales/data'),
  getSalesDataByDateRange: (startDate, endDate) => 
    api.get(`/sales/data/date-range?startDate=${startDate}&endDate=${endDate}`),
  getSalesDataByCategory: (category) => api.get(`/sales/data/category/${category}`),
};

export default api;
