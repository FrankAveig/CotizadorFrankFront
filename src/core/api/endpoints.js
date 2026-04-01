export const ENDPOINTS = {
  AUTH: { LOGIN: '/auth/login', ME: '/users/me' },
  CLIENTS: { BASE: '/clients', BY_ID: (id) => `/clients/${id}` },
  QUOTES: {
    BASE: '/quotes',
    BY_ID: (id) => `/quotes/${id}`,
    ISSUE: (id) => `/quotes/${id}/issue`,
    SEND: (id) => `/quotes/${id}/send`,
    ACCEPT: (id) => `/quotes/${id}/accept`,
    ITEMS: (id) => `/quotes/${id}/items`,
    DOCUMENTS: (id) => `/quotes/${id}/documents`,
    GENERATE_PDF: (id) => `/quotes/${id}/generate-pdf`,
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    STATUS: (id) => `/projects/${id}/status`,
    PAYMENTS: (id) => `/projects/${id}/payments`,
    DOCUMENTS: (id) => `/projects/${id}/documents`,
    INVOICES: (id) => `/projects/${id}/invoices`,
    ITEM_STATUS: (projectId, itemId) =>
      `/projects/${projectId}/items/${itemId}/status`,
  },
  PAYMENTS: { BASE: '/payments' },
  DOCUMENTS: {
    BY_ID: (id) => `/documents/${id}`,
    DOWNLOAD_URL: (id) => `/documents/${id}/download-url`,
  },
};
