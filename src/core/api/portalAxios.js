import axios from 'axios';
import { ENV } from '../config/env.js';
import { appHref } from '../utils/appBase.js';

const portalApi = axios.create({
  baseURL: ENV.API_BASE_URL + '/client',
});

portalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

portalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_data');
      window.location.href = appHref('/portal/login');
    }
    return Promise.reject(error);
  }
);

export default portalApi;
