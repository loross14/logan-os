'use client';

import { useState, useCallback, useEffect } from 'react';

export function useAccentMode() {
  const [isAccentMode, setIsAccentMode] = useState(false);

  useEffect(() => {
    if (isAccentMode) {
      document.body.classList.add('accent-mode');
    } else {
      document.body.classList.remove('accent-mode');
    }
  }, [isAccentMode]);

  const toggleAccentMode = useCallback(() => {
    setIsAccentMode((prev) => !prev);
  }, []);

  const enableAccentMode = useCallback(() => {
    setIsAccentMode(true);
  }, []);

  return { isAccentMode, toggleAccentMode, enableAccentMode };
}
