import axios from 'axios';

// Create an axios instance configured with credentials support for cookies
const api = axios.create({
  baseURL: '', // Empty base URL will use Vite's proxy path in development
  withCredentials: true, // Crucial to send and receive cookies (JWT token) automatically
});

// Add response interceptor to handle errors globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error response status is 401 (Unauthorized), it might mean token expired or user is logged out
    if (error.response && error.response.status === 401) {
      // Custom handler or just let calling code handle it
    }
    return Promise.reject(error);
  }
);

export default api;
