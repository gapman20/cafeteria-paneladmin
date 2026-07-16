import { useSite } from '../context/SiteContext';

/**
 * Custom hook for theme/color management.
 */
export const useTheme = () => {
  const { theme, updateTheme, resetTheme } = useSite();
  return { theme, updateTheme, resetTheme };
};

export default useTheme;
