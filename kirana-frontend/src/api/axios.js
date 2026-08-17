// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sachin-kirana-store.onrender.com', // Aapke Express server ka URL
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Token ko localStorage se retrieve karein
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;