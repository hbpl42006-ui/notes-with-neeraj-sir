import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Courses
  getCourses: () => api.get('/courses/'),
  getCourse: (id) => api.get(`/courses/${id}/`),
  getCourseModules: (id) => api.get(`/courses/${id}/modules/`),
  createCourse: (data) => api.post('/courses/', data),
  updateCourse: (id, data) => api.put(`/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}/`),
  
  // Modules
  getModules: (params) => api.get('/modules/', { params }),
  getModule: (id) => api.get(`/modules/${id}/`),
  getModuleMaterials: (id) => api.get(`/modules/${id}/materials/`),
  createModule: (data) => api.post('/modules/', data),
  updateModule: (id, data) => api.put(`/modules/${id}/`, data),
  deleteModule: (id) => api.delete(`/modules/${id}/`),
  
  // Study Materials
  getMaterials: (params) => api.get('/materials/', { params }),
  getMaterial: (id) => api.get(`/materials/${id}/`),
  createMaterial: (data) => api.post('/materials/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMaterial: (id, data) => api.put(`/materials/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMaterial: (id) => api.delete(`/materials/${id}/`),
  searchMaterials: (params) => api.get('/materials/search/', { params }),
  
  // Syllabus
  getSyllabus: (params) => api.get('/syllabus/', { params }),
  createSyllabus: (data) => api.post('/syllabus/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSyllabus: (id, data) => api.put(`/syllabus/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Academic Events
  getEvents: (params) => api.get('/events/', { params }),
  getEvent: (id) => api.get(`/events/${id}/`),
  createEvent: (data) => api.post('/events/', data),
  updateEvent: (id, data) => api.put(`/events/${id}/`, data),
  deleteEvent: (id) => api.delete(`/events/${id}/`),
  
  // Dashboard
  getDashboard: () => api.get('/dashboard/'),
  getAdminDashboard: () => api.get('/admin/dashboard/'),
  getStats: () => api.get('/stats/'),
  
  // Profile
  getProfile: () => api.get('/profile/'),
  
  // Auth
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/me/'),
};

export default api;
