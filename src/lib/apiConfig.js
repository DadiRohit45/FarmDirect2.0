/**
 * FarmDirect 2.0 — Backend API Configuration
 *
 * Directs API calls to:
 * - Local Django backend in development: http://127.0.0.1:8000
 * - Deployed Render Django backend in production: VITE_DJANGO_API_URL
 */

export const DJANGO_API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DJANGO_API_URL)
  ? import.meta.env.VITE_DJANGO_API_URL.replace(/\/+$/, '')
  : 'http://127.0.0.1:8000';

/**
 * Helper to construct full backend API endpoints
 * @param {string} endpoint - Path such as '/api/health/' or '/api/farmers/'
 */
export function getBackendUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${DJANGO_API_BASE_URL}${cleanEndpoint}`;
}
