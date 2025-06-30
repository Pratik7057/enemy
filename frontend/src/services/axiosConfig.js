import axios from 'axios';

// Determine the base URL for API requests
// In production, this will use the REACT_APP_API_URL environment variable
// In development, it will default to http://localhost:5001/api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
