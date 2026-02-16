'use client';

import { useEffect, useRef, useCallback } from 'react';
import { KONAMI_SEQUENCE } from '@/lib/constants';

interface UseKonamiCodeProps {
  onComplete: () => void;
  disabled?: boolean;
}

export function useKonamiCode({ onComplete, disabled = false }: UseKonamiCodeProps) {
  const indexRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) {
        indexRef.current = 0;
        return;
      }

      if (e.key === KONAMI_SEQUENCE[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === KONAMI_SEQUENCE.length) {
          onComplete();
          indexRef.current = 0;
        }
      } else {
        indexRef.current = 0;
      }
    },
    [onComplete, disabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
