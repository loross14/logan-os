'use client';

import { useState, useRef, useEffect, type RefObject, type KeyboardEvent } from 'react';

// Expose interaction timestamps for canvas to read
declare global {
  interface Window {
    keystrokeTime?: number;
    commandSentTime?: number;
  }
}

interface InputLineProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
  onHistoryUp: () => string;
  onHistoryDown: () => string;
  onGetCompletion: (partial: string) => string | null;
}

export function InputLine({
  inputRef,
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  onGetCompletion,
}: InputLineProps) {
  const [value, setValue] = useState('');
  const [promptActive, setPromptActive] = useState(false);
  const [inputFlash, setInputFlash] = useState(false);
  const promptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const borderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Keystroke pulse for printable characters
    if (e.key.length === 1) {
      // Trigger prompt brightening
      setPromptActive(true);
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
      promptTimeoutRef.current = setTimeout(() => setPromptActive(false), 300);

      // Trigger border flash via terminal window
      const tw = document.querySelector('.terminal-window') as HTMLElement;
      if (tw) {
        tw.style.borderColor = 'var(--clay)';
        if (borderTimeoutRef.current) clearTimeout(borderTimeoutRef.current);
        borderTimeoutRef.current = setTimeout(() => {
          tw.style.borderColor = '';
        }, 200);
      }

      // Signal canvas for rotation boost
      window.keystrokeTime = Date.now();
    }

    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        // Command send animation
        setInputFlash(true);
        setTimeout(() => setInputFlash(false), 400);
        window.commandSentTime = Date.now();
        onSubmit(value);
      }
      setValue('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = onHistoryUp();
      setValue(prev);
      // Move cursor to end
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = prev.length;
        }
      }, 0);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = onHistoryDown();
      setValue(next);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = value.trim();
      if (partial) {
        const completion = onGetCompletion(partial);
        if (completion) {
          setValue(completion);
        }
      }
      return;
    }
  };

  return (
    <div className={`terminal-input-line${inputFlash ? ' flash' : ''}`}>
      <span className={`prompt-prefix${promptActive ? ' active' : ''}`}>~$</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        placeholder="try typing something..."
      />
    </div>
  );
}
