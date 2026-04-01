import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getPortalQuotes = (params = {}) => {
  const query = buildQueryParams(params);
  return portalApi.get(`${PORTAL_ENDPOINTS.QUOTES.BASE}${query}`);
};

export const getPortalQuoteById = (id) =>
  portalApi.get(PORTAL_ENDPOINTS.QUOTES.BY_ID(id));

export const acceptPortalQuote = (id, data) =>
  portalApi.post(PORTAL_ENDPOINTS.QUOTES.ACCEPT(id), data);
