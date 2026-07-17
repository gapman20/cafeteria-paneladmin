import { useSite } from '../context/SiteContext';

/**
 * Custom hook for menu section and item management.
 */
export const useMenu = () => {
  const {
    menuSections, updateMenuSection, updateMenuItem,
    addMenuItem, removeMenuItem, addMenuSection,
    removeMenuSection, moveMenuSection, moveMenuItem,
  } = useSite();
  return {
    menuSections, updateMenuSection, updateMenuItem,
    addMenuItem, removeMenuItem, addMenuSection,
    removeMenuSection, moveMenuSection, moveMenuItem,
  };
};

export default useMenu;
