'use client';

import { useCallback } from 'react';
import { BlueprintCanvas } from '@/components/BlueprintCanvas';
import { Terminal } from '@/components/Terminal';
import { CursorTrail } from '@/components/CursorTrail';
import { useTerminal } from '@/hooks/useTerminal';
import { useAccentMode } from '@/hooks/useAccentMode';
import { useBlueprintMode } from '@/hooks/useBlueprintMode';
import { useKonamiCode } from '@/hooks/useKonamiCode';

export default function Home() {
  const { isAccentMode, toggleAccentMode, enableAccentMode } = useAccentMode();
  const { isBlueprintMode, toggleBlueprintMode } = useBlueprintMode();

  const {
    history,
    inputRef,
    processCommand,
    addLineInstant,
    toggleExpand,
    navigateHistoryUp,
    navigateHistoryDown,
    getCompletion,
  } = useTerminal({
    onToggleAccentMode: toggleAccentMode,
    onToggleBlueprintMode: toggleBlueprintMode,
    isAccentMode,
    isBlueprintMode,
  });

  const handleKonamiComplete = useCallback(() => {
    enableAccentMode();
  }, [enableAccentMode]);

  useKonamiCode({
    onComplete: handleKonamiComplete,
    disabled: false,
  });

  const handleSubmit = useCallback((cmd: string) => {
    addLineInstant('~$ ' + cmd, 'bright');
    processCommand(cmd);
  }, [addLineInstant, processCommand]);

  return (
    <>
      <BlueprintCanvas />
      <Terminal
        history={history}
        inputRef={inputRef}
        onSubmit={handleSubmit}
        onExpandToggle={toggleExpand}
        onHistoryUp={navigateHistoryUp}
        onHistoryDown={navigateHistoryDown}
        onGetCompletion={getCompletion}
      />
      <CursorTrail />
    </>
  );
}
