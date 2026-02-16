'use client';

import { useState, useCallback } from 'react';
import { useTripleClick } from '@/hooks/useTripleClick';
import { GLITCH_DURATION } from '@/lib/constants';

interface HeroNameProps {
  onGlitch: () => void;
}

export function HeroName({ onGlitch }: HeroNameProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    onGlitch();
    setTimeout(() => setIsGlitching(false), GLITCH_DURATION);
  }, [onGlitch]);

  const { handleClick } = useTripleClick({ onTripleClick: triggerGlitch });

  return (
    <h1
      onClick={handleClick}
      className={`font-serif text-white leading-[1.08] mb-4 tracking-[0.02em] relative cursor-default select-none ${
        isGlitching ? 'animate-glitch' : ''
      }`}
      style={{
        fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
        fontWeight: 600,
      }}
    >
      Logan Ross
    </h1>
  );
}
