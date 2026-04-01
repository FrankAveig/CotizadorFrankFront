import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';

export const createPayment = (data) =>
  api.post(ENDPOINTS.PAYMENTS.BASE, data);
