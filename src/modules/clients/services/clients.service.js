import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getClients = (params = {}) => {
  const query = buildQueryParams(params);
  return api.get(`${ENDPOINTS.CLIENTS.BASE}${query}`);
};

export const getClientById = (id) => api.get(ENDPOINTS.CLIENTS.BY_ID(id));

export const createClient = (data) => api.post(ENDPOINTS.CLIENTS.BASE, data);

export const updateClient = (id, data) => api.put(ENDPOINTS.CLIENTS.BY_ID(id), data);

export const deleteClient = (id) => api.delete(ENDPOINTS.CLIENTS.BY_ID(id));
