import { useSite } from '../context/SiteContext';

/**
 * Custom hook for site content management.
 * Provides content state and update helpers.
 */
export const useContent = () => {
  const {
    content, updateContent,
    updateServiceCard, moveServiceCard,
    saveContent, saveDraft, discardDraft, resetContent, saveStatus,
    draftMode, setDraftMode, isDirty,
  } = useSite();
  return {
    content, updateContent,
    updateServiceCard, moveServiceCard,
    saveContent, saveDraft, discardDraft, resetContent, saveStatus,
    draftMode, setDraftMode, isDirty,
  };
};

export default useContent;
