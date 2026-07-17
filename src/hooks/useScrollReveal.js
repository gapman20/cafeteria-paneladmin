import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that uses IntersectionObserver to reveal elements on scroll.
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (default 0.15 = 15%)
 * @param {string} options.rootMargin - Root margin (default '0px 0px -50px 0px')
 * @returns {{ ref, isVisible }} - ref to attach to element, isVisible boolean
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
