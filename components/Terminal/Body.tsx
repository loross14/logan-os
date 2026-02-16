'use client';

import { useEffect, useRef } from 'react';
import type { OutputLine } from '@/types';

interface BodyProps {
  history: OutputLine[];
}

export function Body({ history }: BodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div ref={bodyRef} className="terminal-body">
      {history.map((line) => (
        <div key={line.id} className={`out ${line.color !== 'default' ? line.color : ''}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}
