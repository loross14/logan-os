export type OutputColor = 'green' | 'accent' | 'bright' | 'default';

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

export type CommandHandler = () => OutputLine[];

export interface Command {
  handler: CommandHandler;
}

export type Commands = Record<string, Command>;
