import { useSite } from '../context/SiteContext';

/**
 * Custom hook for authentication logic.
 * Wraps SiteContext auth methods into a focused API.
 */
export const useAuth = () => {
  const { isAuthenticated, login, logout, changePassword } = useSite();
  return { isAuthenticated, login, logout, changePassword };
};

export default useAuth;
