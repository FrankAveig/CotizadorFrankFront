import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';

export async function login(credentials) {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
}

export async function getProfile() {
  const response = await api.get(ENDPOINTS.AUTH.ME);
  return response.data;
}
