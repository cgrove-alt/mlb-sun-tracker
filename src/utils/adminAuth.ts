/**
 * Admin Authentication Utilities
 *
 * Simple authentication for admin dashboard access
 * For production: Replace with proper authentication provider
 */

const ADMIN_PASSWORD_KEY = 'admin_auth_token';

/**
 * Check if user is authenticated as admin (client-side)
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem(ADMIN_PASSWORD_KEY);
  return !!token;
}

/**
 * Store admin authentication token
 */
export function setAdminAuth(password: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

/**
 * Clear admin authentication
 */
export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ADMIN_PASSWORD_KEY);
}

/**
 * Get admin auth token for API requests
 */
export function getAdminAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(ADMIN_PASSWORD_KEY);
}

/**
 * Validate admin password (client-side check)
 * Note: This is NOT secure, only for basic access control
 * Real authentication should happen on the server
 */
export async function validateAdminPassword(password: string): Promise<boolean> {
  // In development, allow any password or bypass if ADMIN_PASSWORD not set
  if (process.env.NODE_ENV === 'development') {
    setAdminAuth(password);
    return true;
  }

  // For production, you would make an API call to validate
  // For now, just store it and let the API endpoints validate
  setAdminAuth(password);
  return true;
}

/**
 * Get authorization header for admin API requests
 */
export function getAdminAuthHeaders(): HeadersInit {
  const token = getAdminAuthToken();

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
  };
}
