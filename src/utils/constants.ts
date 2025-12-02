export const API_BASE_URL = 'http://localhost:5000/api';

export const QUERY_KEYS = {
  AUTH: ['auth'],
  USERS: ['users'],
  ARTICLES: ['articles'],
  CATEGORIES: ['categories'],
  TAGS: ['tags'],
  COMMENTS: ['comments'],
  MEDIA: ['media'],
  DASHBOARD_STATS: ['dashboard-stats'],
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  USERS: '/users',
  ARTICLES: '/articles',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  COMMENTS: '/comments',
  MEDIA: '/media',
} as const;
