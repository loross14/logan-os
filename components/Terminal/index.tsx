'use client';

import type { OutputLine } from '@/types';
import type { RefObject } from 'react';
import { TitleBar } from './TitleBar';
import { Body } from './Body';
import { InputLine } from './InputLine';
import { Cartouche } from './Cartouche';

interface TerminalProps {
  history: OutputLine[];
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
  onExpandToggle: () => void;
  onHistoryUp: () => string;
  onHistoryDown: () => string;
  onGetCompletion: (partial: string) => string | null;
}

export function Terminal({
  history,
  inputRef,
  onSubmit,
  onExpandToggle,
  onHistoryUp,
  onHistoryDown,
  onGetCompletion,
}: TerminalProps) {
  return (
    <div className="page">
      <div className="terminal-window">
        <TitleBar onExpandToggle={onExpandToggle} />
        <Body history={history} />
        <InputLine
          inputRef={inputRef}
          onSubmit={onSubmit}
          onHistoryUp={onHistoryUp}
          onHistoryDown={onHistoryDown}
          onGetCompletion={onGetCompletion}
        />
        <Cartouche />
      </div>
    </div>
  );
}
