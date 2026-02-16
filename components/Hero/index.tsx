'use client';

import { PromptLine } from './PromptLine';
import { HeroName } from './HeroName';
import { Tagline } from './Tagline';
import { StatusLine } from './StatusLine';
import { CliHint } from '@/components/CliHint';

interface HeroProps {
  terminalOpen: boolean;
  onGlitch: () => void;
}

export function Hero({ terminalOpen, onGlitch }: HeroProps) {
  return (
    <section className="hero-section h-screen flex flex-col justify-center px-10 pt-20 max-w-[720px] mx-auto relative">
      <PromptLine />
      <HeroName onGlitch={onGlitch} />
      <Tagline />
      <StatusLine />
      <CliHint visible={!terminalOpen} />
    </section>
  );
}
