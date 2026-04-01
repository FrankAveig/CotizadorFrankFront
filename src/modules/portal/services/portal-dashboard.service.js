import portalApi from '../../../core/api/portalAxios';
import { PORTAL_ENDPOINTS } from '../../../core/api/portalEndpoints';

export const getDashboard = () =>
  portalApi.get(PORTAL_ENDPOINTS.DASHBOARD);
