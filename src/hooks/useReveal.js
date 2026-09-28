import { useEffect, useRef } from 'react';

// Marks an element as revealable. Attach the returned ref to any element;
// once it scrolls into view it gets the 'is-visible' class (see the
// [data-reveal] / .is-visible rules in index.css), which drives the
// opacity/transform transition. Mirrors the original site's IntersectionObserver
// setup, but scoped per-element via a ref instead of a global querySelectorAll pass.
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -18% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
