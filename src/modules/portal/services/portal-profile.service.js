import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';

export const getProfile = () =>
  portalApi.get(PORTAL_ENDPOINTS.PROFILE);

export const updateProfile = (data) =>
  portalApi.put(PORTAL_ENDPOINTS.PROFILE, data);
