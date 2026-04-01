import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getPortalDocuments = (params = {}) => {
  const query = buildQueryParams(params);
  return portalApi.get(`${PORTAL_ENDPOINTS.DOCUMENTS.BASE}${query}`);
};

export const getPortalDocumentDownloadUrl = (id) =>
  portalApi.get(PORTAL_ENDPOINTS.DOCUMENTS.DOWNLOAD_URL(id));
