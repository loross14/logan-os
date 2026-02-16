# Logan Ross Portfolio - Codebase Overview & Function Stubs

## Architecture Overview

A Next.js 14+ portfolio website with a terminal-inspired dark aesthetic. The app is viewport-locked (no scrolling) with a hidden terminal overlay triggered by keyboard input. Built with TypeScript, Tailwind CSS v4, and React hooks for state management.

### Visual Layer Stack (z-index)
- `z-9999` — Cursor trail dots (fixed, pointer-events: none)
- `z-9000` — Terminal overlay (modal with backdrop blur)
- `z-100` — TopBar navigation (fixed header)
- `z-0` — Hero section (main content)

---

## Directory Structure

```
logan-portfolio/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── Hero/              # Hero section (5 components)
│   └── Terminal/          # Terminal system (4 components)
├── hooks/                  # Custom React hooks (5 hooks)
├── lib/                    # Constants and utilities
└── types/                  # TypeScript type definitions
```

---

## Types (`types/index.ts`)

```typescript
type OutputColor = 'green' | 'accent' | 'bright' | 'default';

interface OutputLine {
  id: string;       // Unique line identifier
  text: string;     // Display text
  color: OutputColor; // Color class mapping
}

interface TrailDot {
  el: HTMLDivElement;  // DOM element reference
  x: number;           // Current X position
  y: number;           // Current Y position
}

type CommandHandler = () => OutputLine[];
interface Command { handler: CommandHandler; }
type Commands = Record<string, Command>;
```

---

## Constants (`lib/constants.ts`)

```typescript
KONAMI_SEQUENCE: readonly string[]  // ['ArrowUp', 'ArrowUp', ...]
TRAIL_COUNT: number                 // 5 dots in cursor trail
TRAIL_SPEEDS: number[]              // [0.15, 0.13, 0.11, 0.09, 0.07]
TRAIL_OPACITIES: number[]           // [0.3, 0.24, 0.18, 0.12, 0.06]
TRAIL_SCALES: number[]              // [1.0, 0.85, 0.7, 0.55, 0.4]
CLICK_THRESHOLD: number             // 3 clicks for triple-click
CLICK_TIMEOUT: number               // 500ms window
GLITCH_DURATION: number             // 300ms animation
MOUSE_IDLE_TIMEOUT: number          // 100ms before trail fades
```

---

## Hooks

### `useAccentMode()`
Manages the alternate color theme by toggling a CSS class on the document body.

```typescript
function useAccentMode(): {
  isAccentMode: boolean;      // Current theme state
  toggleAccentMode: () => void; // Toggle between modes
  enableAccentMode: () => void; // Force enable accent mode
}
```

### `useTerminal(props)`
Controls terminal visibility, command history, and command processing.

```typescript
interface UseTerminalProps {
  onToggleAccentMode: () => void;
  isAccentMode: boolean;
}

function useTerminal(props: UseTerminalProps): {
  isOpen: boolean;                    // Terminal visibility
  history: OutputLine[];              // Command output history
  inputRef: RefObject<HTMLInputElement>; // Input element ref
  toggle: () => void;                 // Toggle terminal
  close: () => void;                  // Close terminal
  processCommand: (cmd: string) => void; // Execute command
}

// Internal functions:
function generateId(): string;           // Creates unique line IDs
function addLine(text, color?): void;    // Appends to history
function clearHistory(): void;           // Resets to welcome message

// Supported commands: help, about, stack, contact, theme, clear, exit, secret, konami, 'sudo rm -rf /'
```

### `useKonamiCode(props)`
Listens for the Konami code sequence and triggers a callback on completion.

```typescript
interface UseKonamiCodeProps {
  onComplete: () => void;  // Called when sequence completes
  disabled?: boolean;      // Disable detection (e.g., when terminal open)
}

function useKonamiCode(props: UseKonamiCodeProps): void;

// Internal: Tracks keydown events against KONAMI_SEQUENCE
```

### `useTripleClick(props)`
Detects rapid clicks within a time window and triggers a callback.

```typescript
interface UseTripleClickProps {
  onTripleClick: () => void;  // Called on 3 clicks within 500ms
}

function useTripleClick(props: UseTripleClickProps): {
  handleClick: () => void;  // Attach to onClick
}
```

### `useIsMobile()`
Detects touch-only devices using media query.

```typescript
function useIsMobile(): boolean;  // true if device has no hover capability
```

---

## Components

### `TopBar`
Fixed navigation bar at viewport top.

```typescript
function TopBar(): JSX.Element;

// Renders:
// - Left: Pulsing green dot + "logan ross" label
// - Right: Keyboard hint "press ` to begin"
// - 40px height, backdrop blur, border bottom
```

### `CliHint`
Floating hint at bottom of hero section.

```typescript
interface CliHintProps {
  visible: boolean;  // Controls opacity (fades when terminal opens)
}

function CliHint(props: CliHintProps): JSX.Element;

// Renders: kbd element with backtick + "open terminal"
// Animated with CSS drift animation
```

### `CursorTrail`
Creates 5 trailing dots that follow the mouse cursor (desktop only).

```typescript
function CursorTrail(): JSX.Element | null;

// Returns null on mobile devices
// Creates DOM elements imperatively via useEffect
// Uses requestAnimationFrame for smooth animation
// Each dot lerps toward the previous dot's position
```

### Hero Components

#### `Hero`
Container for the hero section.

```typescript
interface HeroProps {
  terminalOpen: boolean;  // Passed to CliHint for visibility
  onGlitch: () => void;   // Callback when glitch triggers
}

function Hero(props: HeroProps): JSX.Element;

// Composes: PromptLine, HeroName, Tagline, StatusLine, CliHint
```

#### `PromptLine`
Terminal-style path display with blinking cursor.

```typescript
function PromptLine(): JSX.Element;

// Renders: ~/portfolio with animated cursor block
```

#### `HeroName`
The main heading with triple-click glitch easter egg.

```typescript
interface HeroNameProps {
  onGlitch: () => void;
}

function HeroName(props: HeroNameProps): JSX.Element;

// Internal state: isGlitching (boolean)
// Uses useTripleClick hook for detection
// Applies animate-glitch class when triggered
```

#### `Tagline`
Bio paragraph with highlighted keywords.

```typescript
function Tagline(): JSX.Element;

// Renders: Paragraph with hover-interactive "design", "engineering", "craft" spans
```

#### `StatusLine`
Availability indicators mimicking a system tray.

```typescript
function StatusLine(): JSX.Element;

// Renders: 3 status items with colored dots
// - Green dot: "Available for work"
// - Gray dot: "Ann Arbor, MI"
// - Gray dot: "loross@umich.edu"
```

### Terminal Components

#### `Terminal`
Full-screen overlay containing the terminal window.

```typescript
interface TerminalProps {
  isOpen: boolean;
  history: OutputLine[];
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
}

function Terminal(props: TerminalProps): JSX.Element;

// Composes: TitleBar, Body, InputLine
// Backdrop blur, opacity transition based on isOpen
```

#### `TitleBar`
macOS-style window header with traffic light dots.

```typescript
function TitleBar(): JSX.Element;

// Renders: Red/Yellow/Green dots + "logan@portfolio" label
```

#### `Body`
Scrollable command output area.

```typescript
interface BodyProps {
  history: OutputLine[];
}

function Body(props: BodyProps): JSX.Element;

// Maps history to colored div elements
// Auto-scrolls to bottom on new content
// Color mapping: green/accent/bright/default -> Tailwind classes
```

#### `InputLine`
Command input with prompt prefix.

```typescript
interface InputLineProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (cmd: string) => void;
}

function InputLine(props: InputLineProps): JSX.Element;

// Renders: "~$" prefix + controlled text input
// Calls onSubmit with value on Enter key
```

---

## Page Composition (`app/page.tsx`)

```typescript
export default function Home(): JSX.Element;

// Hooks used:
// - useAccentMode() -> theme state
// - useTerminal() -> terminal state & commands
// - useKonamiCode() -> easter egg detection

// Render order (z-index layering):
// 1. CursorTrail (highest z-index, follows mouse)
// 2. Terminal (modal overlay)
// 3. TopBar (fixed header)
// 4. Hero (main content)
```

---

## CSS Animations (in `globals.css`)

| Animation | Duration | Description |
|-----------|----------|-------------|
| `pulse` | 3s ease-in-out | Status dot breathing (opacity 0.4→1→0.4) |
| `blink` | 1s step-end | Cursor hard blink (opacity 1→0→1) |
| `drift` | 2.5s ease-in-out | CLI hint vertical float (6px travel) |
| `glitchText` | 0.3s | Name distortion (translate + hue-rotate cascade) |

---

## Color System (12 tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | #0a0a0a | Page background |
| `surface` | #111111 | Card/panel backgrounds |
| `border` | #1e1e1e | Structural lines |
| `ghost` | #2a2a2a | Inactive elements |
| `muted` | #555555 | Secondary text |
| `body` | #888888 | Primary body text |
| `text` | #b0b0b0 | Emphasized text |
| `bright` | #d4d0c8 | Hover states |
| `white` | #eae6de | Headings |
| `accent` | #c9a96e | Interactive accent (gold) |
| `red` | #9B2335 | Terminal dot, selection (accent mode) |
| `green` | #5a9a7a | Status indicators, prompts |
