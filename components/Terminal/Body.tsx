'use client';

import { useEffect, useRef, useState } from 'react';
import type { OutputLine } from '@/types';

interface BodyProps {
  history: OutputLine[];
}

export function Body({ history }: BodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // Track new lines and apply entering animation
  useEffect(() => {
    const prevLength = prevLengthRef.current;
    const newLines = history.slice(prevLength);

    // Only animate first 4 new lines per batch
    const linesToAnimate = newLines.slice(0, 4);

    if (linesToAnimate.length > 0) {
      const newIds = new Set(linesToAnimate.map((line) => line.id));
      setEnteringIds(newIds);

      // Remove entering class after animation completes (300ms max)
      const timer = setTimeout(() => {
        setEnteringIds(new Set());
      }, 350);

      return () => clearTimeout(timer);
    }

    prevLengthRef.current = history.length;
  }, [history]);

  // Update ref after render
  useEffect(() => {
    prevLengthRef.current = history.length;
  });

  return (
    <div ref={bodyRef} className="terminal-body">
      {history.map((line) => {
        const isEntering = enteringIds.has(line.id);
        const colorClass = line.color !== 'default' ? line.color : '';
        const className = `out ${colorClass}${isEntering ? ' entering' : ''}`.trim();

        return (
          <div key={line.id} className={className}>
            {line.text}
          </div>
        );
      })}
    </div>
  );
}
