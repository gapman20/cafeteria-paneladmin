import { useSite } from '../context/SiteContext';

/**
 * Custom hook for image management.
 */
export const useImages = () => {
  const { images, updateImage, removeImage } = useSite();
  return { images, updateImage, removeImage };
};

export default useImages;
