'use client';

interface CliHintProps {
  visible: boolean;
}

export function CliHint({ visible }: CliHintProps) {
  return (
    <div
      className="absolute bottom-8 left-1/2 text-[10px] text-ghost tracking-[0.15em] animate-drift flex items-center gap-2 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <kbd className="inline-block px-1.5 py-0.5 border border-ghost rounded text-[10px] text-muted font-mono">
        `
      </kbd>{' '}
      open terminal
    </div>
  );
}
