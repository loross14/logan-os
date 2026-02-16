'use client';

export function TopBar() {
  return (
    <nav className="topbar fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-6 text-[11px] text-muted z-[100] bg-bg/85 backdrop-blur-[12px] border-b border-border tracking-[0.06em]">
      <div className="flex gap-4 items-center">
        <span className="flex items-center">
          <span className="status-dot w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow mr-1 inline-block" />
          logan ross
        </span>
      </div>
      <div className="text-[11px] text-ghost tracking-[0.08em] cursor-pointer transition-colors duration-300 hover:text-muted">
        press <kbd className="inline-block px-1.5 py-0.5 border border-ghost rounded text-[10px] text-muted font-mono">`</kbd> to begin
      </div>
    </nav>
  );
}
