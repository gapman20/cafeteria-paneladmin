import { useSite } from '../context/SiteContext';

/**
 * Custom hook for blog post management.
 */
export const useBlog = () => {
  const {
    blogPosts, createBlogPost, updateBlogPost,
    deleteBlogPost, duplicateBlogPost,
  } = useSite();
  return {
    blogPosts, createBlogPost, updateBlogPost,
    deleteBlogPost, duplicateBlogPost,
  };
};

export default useBlog;
