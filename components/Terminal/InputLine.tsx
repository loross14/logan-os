'use client';

import { useState, type RefObject, type KeyboardEvent } from 'react';

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
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
    <div className="terminal-input-line">
      <span className="prompt-prefix">~$</span>
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
