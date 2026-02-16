'use client';

export function PromptLine() {
  return (
    <div className="text-[13px] text-muted mb-8 flex items-center">
      <span className="prompt-dir text-green">~</span>
      <span className="text-ghost mx-0.5">/</span>
      <span className="text-body">portfolio</span>
      <span className="inline-block w-[7px] h-[15px] bg-body ml-[3px] animate-blink" />
    </div>
  );
}
