import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Câu hỏi cơ bản về công nghệ
  askQuestion: async (question) => {
    const response = await api.post('/api/chatbot', { question });
    return response.data;
  },

  // Câu hỏi tùy ý về LLSX - QHSX
  askFreeQuestion: async (question) => {
    const response = await api.post('/api/ask', { question });
    return response.data;
  },

  // So sánh 2 công nghệ
  compareTechnologies: async (tech1, tech2) => {
    const response = await api.post('/api/compare', { tech1, tech2 });
    return response.data;
  },

  // Phân tích timeline
  analyzeTimeline: async (year, technology) => {
    const response = await api.post('/api/timeline', { year, technology });
    return response.data;
  },

  // Gợi ý chính sách
  getPolicySuggestions: async (technology, context = '') => {
    const response = await api.post('/api/policy', { technology, context });
    return response.data;
  },

  // Upload và phân tích file
  uploadAndAnalyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;

