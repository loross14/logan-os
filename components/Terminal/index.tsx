'use client';

import type { OutputLine } from '@/types';
import type { RefObject } from 'react';
import { TitleBar } from './TitleBar';
import { Body } from './Body';
import { InputLine } from './InputLine';

interface TerminalProps {
  isOpen: boolean;
  history: OutputLine[];
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
}

export function Terminal({ isOpen, history, inputRef, onSubmit }: TerminalProps) {
  return (
    <div
      className={`fixed inset-0 z-[9000] bg-bg/95 backdrop-blur-[8px] flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-[560px] max-w-[90vw] bg-bg border border-border shadow-[0_20px_80px_rgba(0,0,0,0.5)] text-[13px]">
        <TitleBar />
        <Body history={history} />
        <InputLine inputRef={inputRef} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
