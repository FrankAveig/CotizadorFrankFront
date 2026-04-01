import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getProjects = (params = {}) => {
  const query = buildQueryParams(params);
  return api.get(`${ENDPOINTS.PROJECTS.BASE}${query}`);
};

export const getProjectById = (id) => api.get(ENDPOINTS.PROJECTS.BY_ID(id));

export const updateProjectStatus = (id, data) =>
  api.patch(ENDPOINTS.PROJECTS.STATUS(id), data);

export const getProjectPayments = (id) =>
  api.get(ENDPOINTS.PROJECTS.PAYMENTS(id));

export const getProjectDocuments = (id) =>
  api.get(ENDPOINTS.PROJECTS.DOCUMENTS(id));

/** multipart/form-data: file (required), invoiceNumber, notes (optional) */
export const uploadProjectInvoice = (projectId, formData) =>
  api.post(ENDPOINTS.PROJECTS.INVOICES(projectId), formData);

export const updateProjectItemStatus = (projectId, itemId, data) =>
  api.patch(ENDPOINTS.PROJECTS.ITEM_STATUS(projectId, itemId), data);
