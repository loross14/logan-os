import type { Command } from '@/types';

interface CommandCallbacks {
  addLine: (text: string, cls?: string) => void;
  toggleAccentMode: () => void;
  toggleBlueprintMode: () => void;
  toggleExpand: () => void;
  clearTerminal: () => void;
  triggerFarewell: () => void;
}

export function createCommands(callbacks: CommandCallbacks): Command[] {
  const { addLine, toggleAccentMode, toggleBlueprintMode, toggleExpand, clearTerminal, triggerFarewell } = callbacks;

  return [
    {
      name: 'look around',
      aliases: ['help', 'commands', 'menu', 'options', 'what', 'hi', 'hello', 'hey', '?', 'start'],
      desc: 'see what you can do here',
      run: () => {
        addLine('');
        addLine("Here's what you can ask me:", 'green');
        addLine('');
        addLine('  about         who I am');
        addLine('  work          what I\'ve built');
        addLine('  tools         what I build with');
        addLine('  say hello     get in touch');
        addLine('  change mood   shift the colors');
        addLine('  expand        fill the room');
        addLine('  shrink        back to the window');
        addLine('  start over    clear the screen');
        addLine('  leave         say goodbye');
        addLine('');
        addLine("  secret        ...you didn't hear this from me", 'accent');
        addLine('');
        addLine('Or just type whatever feels right.', 'dim');
      }
    },
    {
      name: 'about',
      aliases: ['who', 'who are you', 'bio', 'info', 'me', 'about me', 'tell me about yourself'],
      desc: 'who I am',
      run: () => {
        addLine('');
        addLine('Logan Ross.');
        addLine('Builder, designer, engineer.');
        addLine('Based in Ann Arbor, Michigan.');
        addLine('');
        addLine('I care about spatial interfaces, generative');
        addLine('systems, and making things that feel handmade');
        addLine("even when they're made of code.");
        addLine('');
      }
    },
    {
      name: 'work',
      aliases: ['projects', 'portfolio', 'what have you built', 'show me', 'show work', 'show me your work', 'what do you do'],
      desc: "what I've built",
      run: () => {
        addLine('');
        addLine('Selected work:', 'green');
        addLine('');
        addLine('  01  Autonomous Trading Dashboard', 'bright');
        addLine('      Real-time portfolio visualization.');
        addLine('      Vanilla JS, every byte earned its place.');
        addLine('');
        addLine('  02  Generative Identity System', 'bright');
        addLine('      A living brand that morphs with weather,');
        addLine('      time, and attention. Never the same twice.');
        addLine('');
        addLine('  03  Spatial Audio Web Engine', 'bright');
        addLine('      Sound exists in 3D space relative to your');
        addLine('      scroll. Move through the story, it surrounds you.');
        addLine('');
      }
    },
    {
      name: 'tools',
      aliases: ['stack', 'tech', 'skills', 'languages', 'what do you use', 'technologies'],
      desc: 'what I build with',
      run: () => {
        addLine('');
        addLine('Things I reach for:', 'green');
        addLine('');
        addLine('  Languages    Rust, TypeScript, Python');
        addLine('  Frontend     Vanilla JS, React, Canvas');
        addLine('  Design       Figma, P5.js, Blender');
        addLine('  Sound        Web Audio API, spatial audio');
        addLine('  Mail Room    WebSockets, WebGL, WASM');
        addLine('');
      }
    },
    {
      name: 'say hello',
      aliases: ['contact', 'email', 'reach', 'hire', 'get in touch', 'reach out', 'mail', 'connect'],
      desc: 'get in touch',
      run: () => {
        addLine('');
        addLine("I'd love to hear from you.", 'green');
        addLine('');
        addLine('  Email    loross@umich.edu', 'accent');
        addLine('  GitHub   github.com/loganross');
        addLine('');
        addLine('The door is always open.', 'dim');
        addLine('');
      }
    },
    {
      name: 'change mood',
      aliases: ['theme', 'color', 'colors', 'mood', 'change colors', 'change the lights', 'lights', 'vibe', 'warm'],
      desc: 'shift the colors',
      run: () => {
        toggleAccentMode();
      }
    },
    {
      name: 'expand',
      aliases: ['fullscreen', 'maximize', 'full', 'bigger'],
      desc: 'fill the room',
      run: () => {
        const isExpanded = document.body.classList.contains('terminal-expanded');
        if (!isExpanded) {
          toggleExpand();
          addLine('');
          addLine('Filled the room.', 'green');
          addLine('');
        } else {
          addLine('');
          addLine('Already there.', 'dim');
          addLine('');
        }
      }
    },
    {
      name: 'shrink',
      aliases: ['window', 'minimize', 'smaller', 'float'],
      desc: 'back to the window',
      run: () => {
        const isExpanded = document.body.classList.contains('terminal-expanded');
        if (isExpanded) {
          toggleExpand();
          addLine('');
          addLine('Back to the window.', 'green');
          addLine('');
        } else {
          addLine('');
          addLine('Already floating.', 'dim');
          addLine('');
        }
      }
    },
    {
      name: 'start over',
      aliases: ['clear', 'reset', 'clean', 'fresh', 'new'],
      desc: 'clear the screen',
      run: () => {
        clearTerminal();
        addLine('Fresh start.', 'green');
        addLine('');
      }
    },
    {
      name: 'leave',
      aliases: ['exit', 'close', 'quit', 'bye', 'goodbye', 'go', 'done'],
      desc: 'say goodbye',
      run: () => {
        addLine('');
        addLine('Thanks for stopping by.', 'green');
        addLine('');
        triggerFarewell();
      }
    },
    {
      name: 'secret',
      aliases: ['secrets', 'hidden', 'surprise', 'easter egg'],
      desc: '???',
      hidden: true,
      run: () => {
        addLine('');
        addLine('  "Less is only more where more', 'accent');
        addLine('   is no good."', 'accent');
        addLine('');
        addLine('            — Frank Lloyd Wright', 'accent');
        addLine('');
        addLine('You found one of three hidden things.', 'green');
        addLine("The other two aren't in here.", 'dim');
        addLine('');
      }
    },
    {
      name: 'konami',
      aliases: ['cheat', 'cheat code'],
      desc: 'cheat code',
      hidden: true,
      run: () => {
        document.body.classList.add('accent-mode');
        addLine('');
        addLine('You know the code. Welcome to the inner circle.', 'green');
        addLine('');
      }
    },
    {
      name: 'sudo rm -rf /',
      aliases: ['sudo', 'rm -rf', 'delete everything', 'destroy'],
      desc: '',
      hidden: true,
      run: () => {
        addLine('');
        addLine('Nope.', 'accent');
        addLine("Frank wouldn't approve of demolition without a blueprint.", 'dim');
        addLine('');
      }
    },
    {
      name: 'blueprint',
      aliases: ['draft', 'plans', 'cyanotype', 'drawing'],
      desc: 'toggle the blueprint',
      hidden: true,
      run: () => {
        toggleBlueprintMode();
      }
    },
    {
      name: 'frank',
      aliases: ['wright', 'frank lloyd wright', 'flw', 'taliesin', 'fallingwater'],
      desc: '',
      hidden: true,
      run: () => {
        addLine('');
        addLine("  \"An architect's most useful tools", 'accent');
        addLine('   are an eraser at the drafting board,', 'accent');
        addLine('   and a wrecking ball at the site."', 'accent');
        addLine('');
        addLine('            — Frank Lloyd Wright', 'accent');
        addLine('');
        addLine('You speak the language.', 'green');
        addLine('');
      }
    },
  ];
}

export function buildCommandLookup(commands: Command[]): Record<string, Command> {
  const lookup: Record<string, Command> = {};
  commands.forEach(cmd => {
    lookup[cmd.name] = cmd;
    cmd.aliases.forEach(alias => {
      lookup[alias] = cmd;
    });
  });
  return lookup;
}

export function buildCompletionPool(commands: Command[]): string[] {
  const completions: string[] = [];

  // Add visible command names and aliases (length > 2)
  commands.filter(c => !c.hidden).forEach(c => {
    completions.push(c.name);
    c.aliases.filter(a => a.length > 2).forEach(a => completions.push(a));
  });

  // Add hidden command names (but not aliases)
  commands.filter(c => c.hidden).forEach(c => {
    completions.push(c.name);
  });

  return completions;
}
