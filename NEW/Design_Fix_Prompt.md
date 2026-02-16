# Prompt: Design Fix — Canvas Loudness + Text Color Hierarchy

The current build has two problems visible in the screenshot: the blueprint background canvas is far too prominent, and the terminal text has lost its color hierarchy. This prompt fixes both.

---

## Problem 1: The Canvas Is Shouting

The radial lines and concentric circles in the background canvas are way too opaque. They're competing with the terminal for attention instead of sitting as a quiet atmospheric layer. The canvas should be barely perceptible — something you feel more than see.

**In the canvas draw function (`drawFrame` inside the `initBlueprintCanvas` IIFE), check and correct these opacity values:**

### Radial lines (dark mode — not blueprint mode)
The `lineAlpha` value for the non-blueprint state must be `0.06`. If it's any higher, dial it back:

```javascript
const lineAlpha = bp ? 0.18 : 0.06;
```

That `0.06` is critical. The dark-mode lines should be barely visible — ghostly traces, not a compass rose.

### Concentric circles (dark mode)
The circle base alpha must be `0.04` with a breath modulation of `0.03`:

```javascript
const circleBaseAlpha = bp ? 0.1 : 0.04;
const circleBreathAlpha = bp ? 0.06 : 0.03;
```

At peak breath, dark-mode circles hit `0.07` opacity total. If your values are higher than this, they'll read as visible rings instead of subtle atmosphere.

### Compass ticks (dark mode)
```javascript
const tickAlpha = bp ? 0.25 : 0.08;
```

### Center dot (dark mode)
```javascript
ctx.fillStyle = 'rgba(201,169,110,0.15)';
```

### Line widths
All canvas strokes (radial lines, circles, ticks) should be `0.5` lineWidth, not `1` or higher. Thicker lines multiply the perceived opacity.

### The color itself
In dark mode, canvas lines should use `rgba(40,40,40,...)` for radial lines and `rgba(50,50,50,...)` for circles — essentially near-black grays. If the canvas is using lighter grays, whites, or the accent gold for the main geometry, that's the root cause. The geometry should be barely distinguishable from the `#0a0a0a` background.

**Quick self-test:** Squint at the page. If you can still clearly see the canvas geometry, the opacities are too high. You should have to look for it.

---

## Problem 2: Terminal Text Has No Hierarchy

The terminal output should have clear visual layers. Right now everything appears to be roughly the same color. Here's the correct mapping — verify each CSS class produces a visibly different shade:

### `.out` (base output class)
```css
.terminal-body .out { color: var(--muted); margin-bottom: 4px; }
```
`--muted` is `#555555`. This is the default — mid-gray, readable but not bright.

### `.out.green`
```css
.terminal-body .out.green { color: var(--green); }
```
`--green` is `#5a9a7a`. Headings like "Welcome." and "Here's what you can ask me:" should be this soft green.

### `.out.accent`
```css
.terminal-body .out.accent { color: var(--accent); }
```
`--accent` is `#c9a96e`. Gold. Used for the secret FLW quotes and the email address.

### `.out.bright`
```css
.terminal-body .out.bright { color: var(--bright); }
```
`--bright` is `#d4d0c8`. Warm near-white. Used for the user's echoed commands (`~$ look around`) and project titles.

### `.out.dim`
```css
.terminal-body .out.dim { color: var(--ghost); font-size: 12px; }
```
`--ghost` is `#2a2a2a`. Almost invisible — this is intentional. Boot sequence lines, hint text, and suggestions should be very faint. The `font-size: 12px` makes dim lines slightly smaller than the 13px default, reinforcing the whisper.

**The hierarchy from faintest to brightest should be:**

```
dim (#2a2a2a)  →  muted (#555555)  →  body (#888888)  →  green (#5a9a7a)  →  text (#b0b0b0)  →  bright (#d4d0c8)  →  accent (#c9a96e)  →  white (#eae6de)
```

### Check the CSS custom properties

Make sure the `:root` block has exactly these values:

```css
:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --border: #1e1e1e;
  --ghost: #2a2a2a;
  --muted: #555555;
  --body: #888888;
  --text: #b0b0b0;
  --bright: #d4d0c8;
  --white: #eae6de;
  --accent: #c9a96e;
  --red: #9B2335;
  --green: #5a9a7a;
}
```

If any of these have been changed (especially `--ghost`, `--muted`, or `--green`), that explains the flat look. These values were carefully chosen so each step in the hierarchy is distinguishable on a dark `#0a0a0a` background.

### Check that classes are actually being applied

In the `addLine` function, the second argument is the CSS class. Verify these calls produce the right class attribute:

- `addLine('initializing structure...', 'dim')` → should render `<div class="out dim">`
- `addLine('Welcome.', 'green')` → should render `<div class="out green">`
- `addLine('Not sure where to start?...', 'dim')` → should render `<div class="out dim">`

If the class string isn't being appended to `"out"`, all lines will render as `.out` (muted gray) regardless of what class was passed.

The `addLine` function should build the element like this:

```javascript
div.className = 'out' + (cls ? ' ' + cls : '');
```

If it's just `div.className = 'out'` or `div.className = cls`, the hierarchy breaks.

---

## How to Verify

1. **Canvas:** The background geometry should be barely visible in dark mode — faint gray traces behind the terminal. You should need to look for them deliberately.
2. **Boot lines:** "initializing structure..." should be extremely faint (`#2a2a2a` on `#0a0a0a` — nearly invisible).
3. **Welcome:** "Welcome." should be soft green, clearly different from the dim boot lines above it.
4. **Hint text:** "Not sure where to start?" should match the dim boot lines — very faint, smaller font.
5. **User echo:** When you type a command and hit Enter, the echoed `~$ command` should be bright warm-white, the brightest non-accent text on screen.
6. **Overall impression:** The terminal should have visible depth — whisper-quiet dim lines, calm mid-gray defaults, punchy green headings, warm bright echoes. Not a flat wall of same-colored text.
