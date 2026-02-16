'use client';

import { useEffect, useRef } from 'react';
import type { OutputLine } from '@/types';

interface BodyProps {
  history: OutputLine[];
}

const colorClasses: Record<string, string> = {
  green: 'text-green',
  accent: 'text-accent',
  bright: 'text-bright',
  default: 'text-muted',
};

export function Body({ history }: BodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={bodyRef}
      className="p-4 max-h-[400px] overflow-y-auto leading-[1.7] text-body"
    >
      {history.map((line) => (
        <div key={line.id} className={`mb-1 ${colorClasses[line.color]}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}
