import { useSite } from '../context/SiteContext';

/**
 * Custom hook for product catalog management.
 */
export const useProducts = () => {
  const {
    products, createProduct, updateProduct,
    deleteProduct, moveProduct,
  } = useSite();
  return {
    products, createProduct, updateProduct,
    deleteProduct, moveProduct,
  };
};

export default useProducts;
