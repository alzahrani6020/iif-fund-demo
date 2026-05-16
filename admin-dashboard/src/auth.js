/**
 * Auth Module - Client-side session management
 * NOTE: For production, replace with backend JWT authentication
 */

const AUTH_KEY = 'iif-auth-token';
const USER_KEY = 'iif-user';

export const Auth = {
  isLoggedIn() {
    try {
      return !!localStorage.getItem(AUTH_KEY);
    } catch (e) {
      return false;
    }
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  login(email, token) {
    try {
      localStorage.setItem(AUTH_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify({ email }));
      return true;
    } catch (e) {
      return false;
    }
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  },

  // Simple hash-based token (demo only - use JWT in production)
  generateToken(email) {
    const random = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    return btoa(`${email}:${timestamp}:${random}`);
  },
};
