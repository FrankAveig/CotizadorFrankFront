import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';

export const getDocumentById = (id) =>
  api.get(ENDPOINTS.DOCUMENTS.BY_ID(id));

export const getDocumentDownloadUrl = (id) =>
  api.get(ENDPOINTS.DOCUMENTS.DOWNLOAD_URL(id));
