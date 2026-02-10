import { useState, useEffect } from 'react';

interface ScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollSpy = (sectionIds: string[], options: ScrollSpyOptions = {}) => {
  const [activeId, setActiveId] = useState<string>('');

  const {
    threshold = 0.5,
    rootMargin = '-100px 0px -60% 0px' // Top margin for navbar, bottom margin to prevent multiple active sections
  } = options;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    // Create observer for each section
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(handleIntersect, {
          threshold,
          rootMargin
        });
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds, threshold, rootMargin]);

  return activeId;
};
