import { useSite } from '../context/SiteContext';

/**
 * Custom hook for analytics data.
 */
export const useAnalytics = () => {
  const { analytics, trackAnalytics } = useSite();
  return { analytics, trackAnalytics };
};

export default useAnalytics;
