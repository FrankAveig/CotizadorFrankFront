import api from '../../../core/api/axios';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { buildQueryParams } from '../../../core/utils/queryParams';

export const getQuotes = (params = {}) => {
  const query = buildQueryParams(params);
  return api.get(`${ENDPOINTS.QUOTES.BASE}${query}`);
};

export const getQuoteById = (id) => api.get(ENDPOINTS.QUOTES.BY_ID(id));

export const createQuote = (data) => api.post(ENDPOINTS.QUOTES.BASE, data);

export const updateQuote = (id, data) => api.put(ENDPOINTS.QUOTES.BY_ID(id), data);

export const issueQuote = (id) => api.post(ENDPOINTS.QUOTES.ISSUE(id));

export const sendQuote = (id) => api.post(ENDPOINTS.QUOTES.SEND(id));

export const acceptQuote = (id, data) => api.post(ENDPOINTS.QUOTES.ACCEPT(id), data);

export const getQuoteItems = (id) => api.get(ENDPOINTS.QUOTES.ITEMS(id));

export const getQuoteDocuments = (id) => api.get(ENDPOINTS.QUOTES.DOCUMENTS(id));

export const generateQuotePdf = (id) => api.post(ENDPOINTS.QUOTES.GENERATE_PDF(id));
