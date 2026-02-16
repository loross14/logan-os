'use client';

import { useRef, useCallback } from 'react';
import { CLICK_THRESHOLD, CLICK_TIMEOUT } from '@/lib/constants';

interface UseTripleClickProps {
  onTripleClick: () => void;
}

export function useTripleClick({ onTripleClick }: UseTripleClickProps) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    clickCountRef.current++;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, CLICK_TIMEOUT);

    if (clickCountRef.current >= CLICK_THRESHOLD) {
      onTripleClick();
      clickCountRef.current = 0;
    }
  }, [onTripleClick]);

  return { handleClick };
}
