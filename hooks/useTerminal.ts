'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { OutputLine } from '@/types';
import { TYPE_SPEED } from '@/lib/constants';
import { createCommands, buildCommandLookup, buildCompletionPool } from '@/lib/commands';

let lineIdCounter = 0;

function generateId(): string {
  return `line-${++lineIdCounter}`;
}

interface UseTerminalProps {
  onToggleAccentMode: () => void;
  onToggleBlueprintMode: () => void;
  isAccentMode: boolean;
  isBlueprintMode: boolean;
}

export function useTerminal({
  onToggleAccentMode,
  onToggleBlueprintMode,
  isAccentMode,
  isBlueprintMode,
}: UseTerminalProps) {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFarewell, setIsFarewell] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command history for arrow keys
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const historyIndexRef = useRef(-1);

  // Typing queue
  const typeQueueRef = useRef<{ text: string; cls: string; resolve: () => void }[]>([]);
  const isTypingRef = useRef(false);

  const typeNextLine = useCallback(() => {
    if (typeQueueRef.current.length === 0) {
      isTypingRef.current = false;
      return;
    }

    isTypingRef.current = true;
    const { text, cls, resolve } = typeQueueRef.current.shift()!;
    const id = generateId();

    // Add empty line immediately
    setHistory((prev) => [...prev, { id, text: '', color: (cls || 'default') as OutputLine['color'] }]);

    let i = 0;
    const tick = () => {
      if (i < text.length) {
        i++;
        const currentText = text.substring(0, i);
        setHistory((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((line) => line.id === id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], text: currentText };
          }
          return updated;
        });
        setTimeout(tick, TYPE_SPEED);
      } else {
        resolve();
        typeNextLine();
      }
    };

    if (text.length === 0) {
      resolve();
      typeNextLine();
    } else {
      tick();
    }
  }, []);

  const addLine = useCallback((text: string, cls: string = '') => {
    return new Promise<void>((resolve) => {
      typeQueueRef.current.push({ text, cls, resolve });
      if (!isTypingRef.current) {
        typeNextLine();
      }
    });
  }, [typeNextLine]);

  const addLineInstant = useCallback((text: string, cls: string = '') => {
    const id = generateId();
    setHistory((prev) => [...prev, { id, text, color: (cls || 'default') as OutputLine['color'] }]);
  }, []);

  const clearTerminal = useCallback(() => {
    setHistory([]);
    typeQueueRef.current = [];
    isTypingRef.current = false;
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('terminal-expanded');
      } else {
        document.body.classList.remove('terminal-expanded');
      }
      return next;
    });
  }, []);

  const triggerFarewell = useCallback(() => {
    setTimeout(() => {
      document.body.classList.add('farewell');
      setIsFarewell(true);
    }, 800);

    setTimeout(() => {
      const comeback = () => {
        document.body.classList.remove('farewell');
        setIsFarewell(false);
        document.removeEventListener('keydown', comeback);
        document.removeEventListener('click', comeback);
        clearTerminal();
        addLine('');
        addLine('Welcome back.', 'green');
        addLine('');
        setTimeout(() => inputRef.current?.focus(), 50);
      };
      document.addEventListener('keydown', comeback);
      document.addEventListener('click', comeback);
    }, 1600);
  }, [addLine, clearTerminal]);

  // Create commands with callbacks
  const commands = createCommands({
    addLine: (text, cls) => { addLine(text, cls || ''); },
    toggleAccentMode: () => {
      onToggleAccentMode();
      const nextState = !isAccentMode;
      addLine('');
      addLine(nextState ? 'Warmed things up.' : 'Back to the cool tones.', 'accent');
      addLine(nextState ? 'Gold suits you.' : 'Green it is.', 'dim');
      addLine('');
    },
    toggleBlueprintMode: () => {
      onToggleBlueprintMode();
      const nextState = !isBlueprintMode;
      addLine('');
      addLine(nextState ? 'Switched to blueprint. White lines on blue.' : 'Back to the dark room.', 'accent');
      addLine('');
    },
    toggleExpand,
    clearTerminal,
    triggerFarewell,
  });

  const cmdLookup = buildCommandLookup(commands);
  const completionPool = buildCompletionPool(commands);

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [...prev, cmd]);
    historyIndexRef.current = cmdHistory.length + 1;

    const match = cmdLookup[cmd];
    if (match) {
      match.run();
    } else {
      addLine('');
      addLine("Hmm, I don't know that one yet.");
      addLine('Type "look around" to see what I understand.', 'dim');
      addLine('');
    }
  }, [cmdLookup, addLine, cmdHistory.length]);

  const showWelcome = useCallback(() => {
    addLine('');
    addLine('Welcome.', 'green');
    addLine('Type something. See what happens.', '');
    addLine('');
    addLine('Not sure where to start? Try "look around".', 'dim');
    addLine('');
  }, [addLine]);

  // History navigation
  const navigateHistoryUp = useCallback((): string => {
    if (cmdHistory.length === 0) return '';
    historyIndexRef.current = Math.max(0, historyIndexRef.current - 1);
    return cmdHistory[historyIndexRef.current] || '';
  }, [cmdHistory]);

  const navigateHistoryDown = useCallback((): string => {
    historyIndexRef.current = Math.min(cmdHistory.length, historyIndexRef.current + 1);
    if (historyIndexRef.current === cmdHistory.length) {
      return '';
    }
    return cmdHistory[historyIndexRef.current] || '';
  }, [cmdHistory]);

  const getCompletion = useCallback((partial: string): string | null => {
    if (!partial) return null;
    const lower = partial.toLowerCase();
    const match = completionPool.find(c => c.startsWith(lower) && c !== lower);
    return match || null;
  }, [completionPool]);

  // Auto-focus and welcome on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      showWelcome();
    }, 100);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  // Re-focus on click anywhere
  useEffect(() => {
    const handleClick = () => {
      if (!isFarewell) {
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isFarewell]);

  return {
    history,
    inputRef,
    isExpanded,
    isFarewell,
    processCommand,
    addLineInstant,
    toggleExpand,
    navigateHistoryUp,
    navigateHistoryDown,
    getCompletion,
  };
}
