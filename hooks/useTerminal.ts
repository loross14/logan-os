'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { OutputLine, OutputColor } from '@/types';

let lineIdCounter = 0;

function generateId(): string {
  return `line-${++lineIdCounter}`;
}

interface UseTerminalProps {
  onToggleAccentMode: () => void;
  isAccentMode: boolean;
}

export function useTerminal({ onToggleAccentMode, isAccentMode }: UseTerminalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([
    { id: generateId(), text: "Welcome. Type 'help' for commands.", color: 'green' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((text: string, color: OutputColor = 'default') => {
    setHistory((prev) => [...prev, { id: generateId(), text, color }]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([{ id: generateId(), text: 'Terminal cleared.', color: 'green' }]);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const processCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      addLine('~$ ' + cmd, 'bright');

      const commands: Record<string, () => void> = {
        help: () => {
          addLine('Available commands:', 'green');
          addLine('  about     — who is this person');
          addLine('  stack     — what I build with');
          addLine('  contact   — how to reach me');
          addLine('  theme     — toggle accent mode');
          addLine('  clear     — clear terminal');
          addLine('  exit      — close terminal');
          addLine('  secret    — ???', 'accent');
        },
        about: () => {
          addLine('Logan Ross. Builder. Designer. Engineer.');
          addLine('Based in Ann Arbor, MI.');
          addLine('Interested in spatial interfaces,');
          addLine('generative systems, and craft.');
        },
        stack: () => {
          addLine('Languages: Rust, TypeScript, Python');
          addLine('Frontend:  Vanilla JS, React, Canvas');
          addLine('Design:    Figma, P5.js, Blender');
          addLine('Audio:     Web Audio API, HRTF');
          addLine('Other:     WebSockets, WebGL, WASM');
        },
        contact: () => {
          addLine('Email: loross@umich.edu', 'accent');
          addLine('GitHub: github.com/loganross');
        },
        theme: () => {
          onToggleAccentMode();
          const nextState = !isAccentMode;
          addLine(
            nextState ? 'Accent mode enabled.' : 'Accent mode disabled.',
            'accent'
          );
        },
        clear: () => {
          clearHistory();
        },
        exit: () => {
          close();
        },
        secret: () => {
          addLine('');
          addLine('  "The details are not the details.', 'accent');
          addLine('   They make the design."', 'accent');
          addLine('              — Charles Eames', 'accent');
          addLine('');
          addLine('You found one of three. Keep looking.', 'green');
        },
        konami: () => {
          onToggleAccentMode();
          addLine('Cheat code accepted.', 'green');
        },
        'sudo rm -rf /': () => {
          addLine('Nice try.', 'accent');
        },
      };

      if (commands[trimmed]) {
        commands[trimmed]();
      } else {
        addLine('Command not found: ' + trimmed);
        addLine("Type 'help' for available commands.");
      }
    },
    [addLine, clearHistory, close, onToggleAccentMode, isAccentMode]
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        if (e.target instanceof HTMLInputElement) return;
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close]);

  return {
    isOpen,
    history,
    inputRef,
    toggle,
    close,
    processCommand,
  };
}
