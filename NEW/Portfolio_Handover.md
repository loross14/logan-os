# Portfolio Handover — Logan Ross

**CLI-First Terminal Experience**
Single-file HTML · Zero dependencies · 884 lines · February 2026

*This document is intended for a coding agent or developer inheriting the project.*

---

## Section 1: System Prompt for Coding Agent

Copy the text below verbatim into the coding agent's system prompt or context window. It gives the agent everything it needs to understand the project, make safe changes, and match the existing voice.

**BEGIN PROMPT** — copy from here —

```
You are the coding agent for Logan Ross's personal portfolio website.

## What this is
A single-file HTML page (index.html, ~884 lines) that serves as a personal
portfolio. The ONLY interface element is a terminal window. There is no hero
section, no navigation bar, no visible name on the page. The visitor lands
on a floating terminal centered over a dark background with a slowly rotating
radial blueprint animation (canvas). Everything is discovered by typing commands.

## Architecture
- Single file: all CSS, HTML, and JS inline. No build step, no bundler.
- Only external dependency: Google Fonts (IBM Plex Mono).
- CSS custom properties (12 tokens in :root) control the full color system.
- Body class toggles for state: accent-mode, blueprint-mode, terminal-expanded, farewell.
- Terminal is always visible. No open/close. Input auto-focuses on load.
- Canvas element (z-index 0) behind terminal draws animated radial geometry.

## Design philosophy
This site channels Frank Lloyd Wright's "less is only more where more is no
good." Every element earns its place. The tone is warm, mysterious, and human.
Error messages say "Hmm, I don't know that one yet" not "Command not found."
Commands use spatial metaphors ("look around", "say hello", "change mood").
Technical jargon is avoided in user-facing text.

## Terminal command system
The COMMANDS array holds all commands. Each entry has:
  { name: string, aliases: string[], desc: string, hidden?: boolean, run: () => void }
The cmdLookup dictionary maps every name and alias to its command object.
Tab completion draws from allCompletions (visible names + long aliases + hidden names).

## How to add a new command
1. Add an object to the COMMANDS array with name, aliases, desc, and run().
2. Set hidden: true if it should not appear in "look around".
3. If visible, add a line to the "look around" command's run() function.
4. The cmdLookup and allCompletions are built automatically from the COMMANDS array.

## Key functions
- addLine(text, cls): Queues a line for typing animation (14ms/char). Returns Promise.
- addLineInstant(text, cls): Adds a line instantly (used for user input echo).
- typeNextLine(): Processes the typing queue. Do not call directly.
- processCommand(raw): Lowercases input, looks up in cmdLookup, runs or shows error.
- toggleExpand(): Toggles body.terminal-expanded.
- showWelcome(): Types the initial welcome message. Called once on load.

## CSS output classes
- .out (default): --muted color
- .out.green: --green (success, welcome)
- .out.accent: --accent gold (quotes, highlights)
- .out.bright: --bright (user echo)
- .out.dim: --ghost, 12px (hints, secondary)

## Body state classes
- .accent-mode: Swaps green prompt/dots to gold. Toggled by "change mood".
- .blueprint-mode: Swaps all 12 CSS variables to blue palette. Intensifies canvas.
- .terminal-expanded: Terminal fills viewport. Toggled by "expand"/"shrink".
- .farewell: Fades terminal to 0 opacity. Set by "leave", removed on comeback.

## Blueprint background canvas
The <canvas id="blueprintBg"> draws at z-index 0 behind the terminal.
It renders: 36 radial lines (18 on mobile), 5 concentric circles (3 on mobile),
4 compass ticks, and a center dot. Rotates at ~1 deg/sec. Throttled to 15fps.
In blueprint-mode: lines brighten, circles intensify, center becomes a pulsing ring,
and a "24'-0"" dimension label appears. In dark mode: whisper-level opacity.

## Rules
1. Never add external dependencies. Everything stays in one file.
2. Never expose the user's name outside of the "about" command.
3. Keep the warm, human tone. No technical jargon in user-facing text.
4. New commands must have natural-language aliases (5+ where possible).
5. Always test that addLine output includes empty-line padding above and below.
6. The terminal should never feel hostile, broken, or empty.
7. Blueprint mode and accent mode must be able to stack (both active).
8. Canvas must stay below 2% CPU. Keep the 15fps throttle.
9. When in doubt, remove rather than add. Less is more.
```

**END PROMPT** — end copy —

---

## Section 2: Architecture Overview

### Visual Layer Stack

| Z-Index | Element | Description |
|---------|---------|-------------|
| 9999 | `.trail-dot` | Cursor trail dots (fixed, pointer-events: none) |
| 1 | `.page` | Flex container centering the terminal window |
| 0 | `#blueprintBg` | Canvas with animated radial blueprint geometry |

### HTML Structure

```
<body>
  <canvas id="blueprintBg">          // Background animation
  <div class="page">                  // Flex centering container
    <div class="terminal-window">     // The terminal
      <div class="terminal-titlebar"> // Traffic light dots + label
      <div class="terminal-body">     // Scrollable output
      <div class="terminal-input-line">// ~$ prompt + input
      <div class="blueprint-cartouche">// Hidden title block (blueprint mode)
  <!-- trail-dots injected by JS -->
</body>
```

### State Machine

The page has four boolean states, all controlled via CSS classes on `<body>`:

| Class | Trigger | Effect |
|-------|---------|--------|
| `.accent-mode` | "change mood" or Konami | Green prompt/dots become gold |
| `.blueprint-mode` | "blueprint" command | All 12 CSS vars swap to blue palette, canvas intensifies |
| `.terminal-expanded` | "expand" / red dot click | Terminal fills viewport edge-to-edge |
| `.farewell` | "leave" command | Terminal fades out, comeback listener waits |

---

## Section 3: Color System

### Default (Dark Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0a0a` | Page background |
| `--surface` | `#111111` | Panel backgrounds |
| `--border` | `#1e1e1e` | Structural lines |
| `--ghost` | `#2a2a2a` | Inactive, dim hints |
| `--muted` | `#555555` | Secondary text |
| `--body` | `#888888` | Primary body text |
| `--text` | `#b0b0b0` | Emphasized text |
| `--bright` | `#d4d0c8` | User echo, hover |
| `--white` | `#eae6de` | Headings (unused in CLI-only) |
| `--accent` | `#c9a96e` | Gold interactive accent |
| `--red` | `#9B2335` | Terminal close dot |
| `--green` | `#5a9a7a` | Status, prompt prefix |

### Blueprint Mode Overrides

When `body.blueprint-mode` is active, all variables shift to this blue palette. The `--accent` token stays gold (pencil-on-blueprint warmth).

| Token | Blueprint Hex |
|-------|---------------|
| `--bg` | `#0b1a2e` |
| `--border` | `#1a3050` |
| `--ghost` | `#2a4060` |
| `--muted` | `#4a7090` |
| `--body` | `#6a8faa` |
| `--text` | `#8bb0cc` |
| `--bright` | `#a8cce0` |
| `--white` | `#d4e8f4` |
| `--green` | `#6ab0a0` |
| `--red` | `#7a4455` |

---

## Section 4: Command Reference

### Visible Commands (10)

These appear when a visitor types "look around":

| Name | Aliases | Behavior |
|------|---------|----------|
| `look around` | help, commands, menu, options, what, hi, hello, hey, ?, start | Lists all visible commands |
| `about` | who, who are you, bio, info, me, about me, tell me about yourself | Name, role, location, philosophy |
| `work` | projects, portfolio, what have you built, show me, show work | Three selected projects with descriptions |
| `tools` | stack, tech, skills, languages, what do you use, technologies | Languages, frontend, design, sound, infra |
| `say hello` | contact, email, reach, hire, get in touch, reach out, mail, connect | Email + GitHub links |
| `change mood` | theme, color, colors, mood, lights, vibe, warm | Toggles `body.accent-mode` (gold prompt) |
| `expand` | fullscreen, maximize, full, bigger | Adds `body.terminal-expanded` (fills viewport) |
| `shrink` | window, minimize, smaller, float | Removes `body.terminal-expanded` (floating) |
| `start over` | clear, reset, clean, fresh, new | Clears terminal body, resets type queue |
| `leave` | exit, close, quit, bye, goodbye, go, done | Farewell + fade out + comeback listener |

### Hidden Commands (5)

These are discoverable by experimentation. They do not appear in "look around":

| Name | Aliases | Behavior |
|------|---------|----------|
| `secret` | secrets, hidden, surprise, easter egg | FLW quote + "one of three hidden things" |
| `konami` | cheat, cheat code | Enables accent mode |
| `sudo rm -rf /` | sudo, rm -rf, delete everything, destroy | Humorous refusal |
| `blueprint` | draft, plans, cyanotype, drawing | Toggles `body.blueprint-mode` + canvas response |
| `frank` | wright, frank lloyd wright, flw, taliesin, fallingwater | FLW quote + "you speak the language" |

---

## Section 5: Blueprint Background Canvas

The canvas draws a slowly rotating radial pattern inspired by Frank Lloyd Wright's Grover Residence circular Usonian plan. It sits at z-index 0 behind the terminal.

### Geometry

- 36 radial lines from center (18 on mobile), every 10°, rotating at ~1°/sec
- 5 concentric circles at even intervals (3 on mobile), breathing pulse over ~8 seconds
- 4 compass tick marks at cardinal directions on the outermost circle
- Center point: 2px gold dot in dark mode, pulsing ring in blueprint mode
- Blueprint mode adds a "24'-0"" dimension label rotating along one radial

### Performance

- `requestAnimationFrame` loop, throttled to ~15fps via timestamp check
- DPR-aware canvas sizing (crisp on Retina)
- Resizes on `window.resize`
- Reads `body.classList` each frame to respond to blueprint mode toggle
- Target: < 2% CPU at idle

### Opacity Levels

| Element | Dark Mode | Blueprint Mode |
|---------|-----------|----------------|
| Radial lines | `rgba(40,40,40, 0.06)` | `rgba(100,160,200, 0.18)` |
| Circles (base) | `0.04 + breath*0.03` | `0.10 + breath*0.06` |
| Compass ticks | `rgba(60,60,60, 0.08)` | `rgba(130,180,220, 0.25)` |
| Center point | gold @ 0.15 | gold ring @ 0.20–0.35 |

---

## Section 6: JavaScript Function Reference

All functions live in a single `<script>` block. There are no modules, no imports, no classes.

### Core Functions

| Function | Description |
|----------|-------------|
| `addLine(text, cls)` | Queues line for typing animation (14ms/char). Returns Promise that resolves when typing completes. |
| `addLineInstant(text, cls)` | Adds line immediately with no animation. Used for echoing user input. |
| `typeNextLine()` | Internal: processes next item in typeQueue. Do not call directly. |
| `processCommand(raw)` | Lowercases input, looks up in cmdLookup, calls run() or shows friendly error. |
| `showWelcome()` | Types the initial welcome sequence. Called once on page load. |
| `toggleExpand()` | Toggles `body.terminal-expanded` class. |
| `initBlueprintCanvas()` | IIFE: sets up canvas, resize handler, and requestAnimationFrame loop. |
| `drawFrame(timestamp)` | Internal to canvas IIFE: renders one frame of the radial animation. |
| `resize()` | Internal to canvas IIFE: handles DPR-aware canvas sizing. |

### Global Variables

| Variable | Description |
|----------|-------------|
| `isMobile` | Boolean. True if `(hover: none)` matches. Set once on load. |
| `terminalInput` | DOM ref to the `<input>` element. |
| `terminalBody` | DOM ref to the scrollable output area. |
| `history[]` | Array of previously entered commands (strings). |
| `historyIndex` | Current position in history for arrow key navigation. |
| `typeQueue[]` | Array of `{ text, cls, resolve }` objects waiting to be typed. |
| `isTyping` | Boolean. True when typing animation is in progress. |
| `TYPE_SPEED` | Constant: 14 (milliseconds per character). |
| `COMMANDS[]` | Array of command objects with name, aliases, desc, hidden, run. |
| `cmdLookup{}` | Dictionary mapping every name + alias string to its command object. |
| `allCompletions[]` | Array of strings for tab completion. |
| `konamiIndex` | Current position in Konami code sequence detection. |

---

## Section 7: Ground Rules for Changes

These rules protect the project's identity. Any agent or developer working on this file should follow them:

1. **Single file, zero dependencies.** Everything stays in index.html. No build step, no npm, no external JS. The only import is the Google Fonts stylesheet for IBM Plex Mono.

2. **The terminal is the only interface.** Never add visible UI elements outside the terminal window. No headers, no footers, no floating buttons. The page is a dark room with a terminal and a canvas.

3. **Maximum mystery.** The visitor's name "Logan Ross" should never be visible on the page unless someone types "about". The title tag says "Logan Ross" for SEO but nothing on-screen reveals it.

4. **Warm, human tone.** All user-facing text should feel like a calm conversation. Use spatial metaphors. "Hmm, I don't know that one yet" not "Error: command not found." "Filled the room" not "Fullscreen enabled."

5. **New commands need aliases.** Every new command should have at least 5 natural-language aliases. Think about what a non-technical visitor might type. "who are you", "tell me about yourself", "bio" should all reach the same place.

6. **Output padding.** Every command's `run()` function should start and end with `addLine('')` for visual breathing room between command outputs.

7. **Modes must stack.** Accent mode and blueprint mode can both be active simultaneously. Any new mode must also stack gracefully with existing modes.

8. **Canvas stays cheap.** The blueprint background must stay below 2% CPU. Keep the 15fps throttle. If adding new geometry, reduce complexity on mobile. Test with DevTools Performance panel.

9. **When in doubt, remove.** This project's design ethos is subtraction. If a feature doesn't earn its place, cut it. "Less is only more where more is no good." — FLW

---

*— End of Handover Document —*
