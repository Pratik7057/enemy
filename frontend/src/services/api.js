import axios from './axiosConfig';

// Authentication API calls
export const login = async (email, password) => {
  return axios.post('/auth/login', { email, password });
};

export const register = async (username, email, password) => {
  return axios.post('/auth/register', { username, email, password });
};

export const getProfile = async () => {
  return axios.get('/auth/me');
};

// User API calls
export const generateApiKey = async () => {
  return axios.post('/user/api-key/generate');
};

export const getApiKeyDetails = async () => {
  return axios.get('/user/api-key');
};

export const addBalance = async (amount) => {
  return axios.post('/user/balance/add', { amount });
};

export const getTransactions = async () => {
  return axios.get('/user/transactions');
};

// Orders API calls
export const getServices = async () => {
  return axios.get('/orders/services');
};

export const placeOrder = async (serviceId, quantity, link) => {
  return axios.post('/orders', { serviceId, quantity, link });
};

export const getUserOrders = async () => {
  return axios.get('/orders');
};

export const getOrderById = async (id) => {
  return axios.get(`/orders/${id}`);
};

// YouTube API calls
export const getApiUsageLogs = async () => {
  return axios.get('/youtube/logs');
};
