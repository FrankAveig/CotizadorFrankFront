import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';

export const loginClient = (credentials) =>
  portalApi.post(PORTAL_ENDPOINTS.AUTH.LOGIN, credentials);

export const changeClientPassword = (data) =>
  portalApi.post(PORTAL_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);

export const getClientProfile = () =>
  portalApi.get(PORTAL_ENDPOINTS.PROFILE);
