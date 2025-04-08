// Simple authentication utilities for demo purposes
// In a real application, this would connect to a backend API

// Mock user database
const mockUsers = [
  { username: 'admin', password: 'demo', role: 'admin', name: 'Admin User' },
  { username: 'teacher1', password: 'demo', role: 'teacher', name: 'Jamie Smith' },
  { username: 'teacher2', password: 'demo', role: 'teacher', name: 'Alex Johnson' }
];

/**
 * Authenticate a user with username and password
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Object|null} - User object if authenticated, null if not
 */
export const authenticateUser = (username, password) => {
  const user = mockUsers.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );
  
  return user || null;
};

/**
 * Get current authenticated user data
 * @returns {Object|null} - User object if user is authenticated, null if not
 */
export const getCurrentUser = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return null;
  
  const username = localStorage.getItem('user');
  const role = localStorage.getItem('userRole');
  
  return { username, role };
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated, false if not
 */
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Check if user is an admin
 * @returns {boolean} - True if user is an admin, false if not
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

/**
 * Log in a user
 * @param {Object} user - The user object to log in
 */
export const loginUser = (user) => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', user.name || user.username);
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userId', user.username);
};

/**
 * Log out a user
 */
export const logoutUser = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
};

export default {
  authenticateUser,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  loginUser,
  logoutUser
}; 