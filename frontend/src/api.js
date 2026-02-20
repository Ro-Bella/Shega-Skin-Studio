import axios from 'axios';

// Get the backend API URL from environment variables.
// Vite uses import.meta.env instead of process.env
// Also, variables must start with VITE_ to be exposed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create a centralized Axios instance.
// The error "process is not defined" happens because Vite does not support process.env by default.
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// OPTIONAL: Add an interceptor to include the auth token in every request.
// This is a good practice for protected routes.
api.interceptors.request.use(config => {
  const adminInfo = localStorage.getItem('adminInfo') 
    ? JSON.parse(localStorage.getItem('adminInfo')) 
    : null;

  if (adminInfo && adminInfo.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
});

export default api;