import { useSite } from '../context/SiteContext';

/**
 * Custom hook for site content management.
 * Provides content state and update helpers.
 */
export const useContent = () => {
  const {
    content, updateContent,
    updateServiceCard, moveServiceCard,
    saveContent, resetContent, saveStatus,
  } = useSite();
  return {
    content, updateContent,
    updateServiceCard, moveServiceCard,
    saveContent, resetContent, saveStatus,
  };
};

export default useContent;
