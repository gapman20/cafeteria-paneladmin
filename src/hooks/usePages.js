import { useSite } from '../context/SiteContext';

/**
 * Custom hook for page/menu management.
 */
export const usePages = () => {
  const { pages, createPage, updatePage, deletePage, movePage } = useSite();
  return { pages, createPage, updatePage, deletePage, movePage };
};

export default usePages;
