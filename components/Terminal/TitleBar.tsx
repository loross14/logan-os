'use client';

export function TitleBar() {
  return (
    <div className="px-3 py-2 flex items-center gap-1.5 border-b border-border text-[11px] text-muted">
      <span className="w-2 h-2 rounded-full bg-red" />
      <span className="w-2 h-2 rounded-full bg-accent" />
      <span className="w-2 h-2 rounded-full bg-green" />
      <span className="ml-2">logan@portfolio</span>
    </div>
  );
}
