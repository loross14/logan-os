'use client';

import { useState, useCallback, useEffect } from 'react';

export function useBlueprintMode() {
  const [isBlueprintMode, setIsBlueprintMode] = useState(false);

  useEffect(() => {
    if (isBlueprintMode) {
      document.body.classList.add('blueprint-mode');
    } else {
      document.body.classList.remove('blueprint-mode');
    }
  }, [isBlueprintMode]);

  const toggleBlueprintMode = useCallback(() => {
    setIsBlueprintMode((prev) => !prev);
  }, []);

  const enableBlueprintMode = useCallback(() => {
    setIsBlueprintMode(true);
  }, []);

  const disableBlueprintMode = useCallback(() => {
    setIsBlueprintMode(false);
  }, []);

  return {
    isBlueprintMode,
    toggleBlueprintMode,
    enableBlueprintMode,
    disableBlueprintMode,
  };
}
