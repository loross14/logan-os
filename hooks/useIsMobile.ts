'use client';

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };

    checkMobile();

    const mediaQuery = window.matchMedia('(hover: none)');
    mediaQuery.addEventListener('change', checkMobile);

    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  return isMobile;
}
