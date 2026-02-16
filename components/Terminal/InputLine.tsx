'use client';

import { useState, type RefObject, type KeyboardEvent } from 'react';

interface InputLineProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
}

export function InputLine({ inputRef, onSubmit }: InputLineProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="flex items-center gap-0 px-4 pb-4 pt-2 text-[13px] border-t border-border">
      <span className="text-green mr-2">~$</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        className="bg-transparent border-none outline-none font-mono text-[13px] text-text flex-1 caret-accent"
        placeholder=""
      />
    </div>
  );
}
