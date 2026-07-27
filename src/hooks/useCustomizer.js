import { useSite } from '../context/SiteContext';

/**
 * Custom hook for drink customizer option management.
 */
export const useCustomizer = () => {
  const {
    customizerOptions, updateCustomizerOption, addCustomizerOption,
    removeCustomizerOption, toggleCustomizerOption, moveCustomizerOption,
  } = useSite();
  return {
    customizerOptions, updateCustomizerOption, addCustomizerOption,
    removeCustomizerOption, toggleCustomizerOption, moveCustomizerOption,
  };
};

export default useCustomizer;
