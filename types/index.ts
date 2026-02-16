export type OutputColor = 'green' | 'accent' | 'bright' | 'dim' | 'warm' | 'default';

export interface OutputLine {
  id: string;
  text: string;
  color: OutputColor;
}

export interface TrailDot {
  el: HTMLDivElement;
  x: number;
  y: number;
}

export interface Command {
  name: string;
  aliases: string[];
  desc: string;
  hidden?: boolean;
  run: () => void;
}

export interface TypeQueueItem {
  text: string;
  cls: string;
  resolve: () => void;
}
