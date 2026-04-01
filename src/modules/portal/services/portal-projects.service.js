import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getPortalProjects = (params = {}) => {
  const query = buildQueryParams(params);
  return portalApi.get(`${PORTAL_ENDPOINTS.PROJECTS.BASE}${query}`);
};

export const getPortalProjectById = (id) =>
  portalApi.get(PORTAL_ENDPOINTS.PROJECTS.BY_ID(id));
