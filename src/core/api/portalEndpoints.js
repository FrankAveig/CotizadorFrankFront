export const PORTAL_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  QUOTES: {
    BASE: '/quotes',
    BY_ID: (id) => `/quotes/${id}`,
    ACCEPT: (id) => `/quotes/${id}/accept`,
    REJECT: (id) => `/quotes/${id}/reject`,
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
  },
  DOCUMENTS: {
    BASE: '/documents',
    DOWNLOAD_URL: (id) => `/documents/${id}/download-url`,
  },
};
