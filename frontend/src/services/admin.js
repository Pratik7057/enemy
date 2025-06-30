import axios from './axiosConfig';

// Admin dashboard stats
export const getDashboardStats = async () => {
  return axios.get('/admin/dashboard');
};

// User management
export const getAllUsers = async () => {
  return axios.get('/admin/users');
};

export const getUserById = async (id) => {
  return axios.get(`/admin/users/${id}`);
};

export const updateUser = async (id, userData) => {
  return axios.put(`/admin/users/${id}`, userData);
};

// Service management
export const addService = async (serviceData) => {
  return axios.post('/admin/services', serviceData);
};

// Order management
export const updateOrderStatus = async (id, status) => {
  return axios.put(`/admin/orders/${id}/status`, { status });
};

// API key management
export const getAllApiKeys = async (params = {}) => {
  return axios.get('/admin/api-keys', { params });
};

export const getApiKeyDetails = async (id) => {
  return axios.get(`/admin/api-keys/${id}`);
};

export const toggleApiKeyStatus = async (id) => {
  return axios.put(`/admin/api-keys/${id}/toggle-status`);
};

export const getApiUsageStats = async () => {
  return axios.get('/admin/api-keys/stats');
};
