'use client';

export function Tagline() {
  return (
    <p className="text-[14px] text-body leading-[1.7] max-w-[480px] mb-12">
      I build things at the intersection of{' '}
      <span className="highlight text-text border-b border-ghost transition-all duration-300 cursor-default hover:text-bright hover:border-muted">
        design
      </span>
      ,{' '}
      <span className="highlight text-text border-b border-ghost transition-all duration-300 cursor-default hover:text-bright hover:border-muted">
        engineering
      </span>
      , and{' '}
      <span className="highlight text-text border-b border-ghost transition-all duration-300 cursor-default hover:text-bright hover:border-muted">
        craft
      </span>
      . Currently interested in spatial interfaces, generative systems, and
      making software that feels like it was made by a human.
    </p>
  );
}
