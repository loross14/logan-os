'use client';

export function StatusLine() {
  return (
    <div className="status-line flex gap-6 text-[11px] text-muted tracking-[0.08em]">
      <span className="flex items-center gap-1.5">
        <span className="indicator-on w-[5px] h-[5px] rounded-full bg-green inline-block" />
        Available for work
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-[5px] h-[5px] rounded-full bg-muted inline-block" />
        Ann Arbor, MI
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-[5px] h-[5px] rounded-full bg-muted inline-block" />
        loross@umich.edu
      </span>
    </div>
  );
}
