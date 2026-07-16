import { useSite } from '../context/SiteContext';

/**
 * Custom hook for inbox/message management.
 */
export const useInbox = () => {
  const { inbox, addMessage, markMessageRead, deleteMessage } = useSite();
  return { inbox, addMessage, markMessageRead, deleteMessage };
};

export default useInbox;
