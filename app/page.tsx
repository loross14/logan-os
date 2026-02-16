'use client';

import { useCallback } from 'react';
import { TopBar } from '@/components/TopBar';
import { Hero } from '@/components/Hero';
import { Terminal } from '@/components/Terminal';
import { CursorTrail } from '@/components/CursorTrail';
import { useTerminal } from '@/hooks/useTerminal';
import { useAccentMode } from '@/hooks/useAccentMode';
import { useKonamiCode } from '@/hooks/useKonamiCode';

export default function Home() {
  const { isAccentMode, toggleAccentMode, enableAccentMode } = useAccentMode();

  const {
    isOpen: terminalOpen,
    history,
    inputRef,
    processCommand,
  } = useTerminal({
    onToggleAccentMode: toggleAccentMode,
    isAccentMode,
  });

  const handleKonamiComplete = useCallback(() => {
    enableAccentMode();
  }, [enableAccentMode]);

  useKonamiCode({
    onComplete: handleKonamiComplete,
    disabled: terminalOpen,
  });

  const handleGlitch = useCallback(() => {
    // Glitch animation is handled in HeroName component
  }, []);

  return (
    <>
      <CursorTrail />
      <Terminal
        isOpen={terminalOpen}
        history={history}
        inputRef={inputRef}
        onSubmit={processCommand}
      />
      <TopBar />
      <Hero terminalOpen={terminalOpen} onGlitch={handleGlitch} />
    </>
  );
}
