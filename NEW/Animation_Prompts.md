# Animation Implementation Prompts

Four surgical animations to make the portfolio feel alive. Each prompt is self-contained — implement them independently, in any order. All edits target the single file `index.html`.

---

## 1. The Building Breathes

**What it does:** The terminal window pulses imperceptibly at a human breathing rhythm — a scale shift so small you'd never consciously notice, but it makes the page feel organic rather than static.

**The CSS addition (add after line 93, inside the `<style>` block, after `.terminal-window` closing brace):**

```css
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.002); }
}

.terminal-window {
  animation: breathe 8s ease-in-out infinite;
}
```

**Important constraints:**

- The scale value must be `1.002` — no higher. This should be felt, not seen. If you can visually detect the pulse, it's too much.
- Duration is 8 seconds. This mimics a resting breath cycle.
- Use `ease-in-out` for organic acceleration/deceleration.
- The `.terminal-window` already has a `transition` property on line 91. The `animation` property does not conflict with `transition` — they coexist. Do not remove the existing transition.
- Do not apply this animation during the farewell state. Add this override:

```css
body.farewell .terminal-window {
  animation: none;
}
```

This line should go inside or right after the existing `body.farewell .terminal-window` block at line 195. The existing block sets `opacity: 0` — you can add `animation: none;` to that same rule.

**How to verify:** Open the page. Stare at the terminal border for 10 seconds. You should feel a faint aliveness without being able to pinpoint what's moving. If the movement is obvious, reduce the scale value. If you see nothing at all, it's working.

---

## 2. Light Moves Across the Room

**What it does:** A barely-visible gradient overlay drifts across the terminal background from left to right over 60 seconds, simulating how natural light moves through a room during the day. Think of sunlight slowly crossing a floor.

**The CSS addition (add after the `@keyframes breathe` block you just created):**

```css
@keyframes lightDrift {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
```

**Modify the existing `.terminal-body` rule (line 121–128).** Add a background gradient and animation to it:

```css
.terminal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  line-height: 1.8;
  color: var(--body);
  min-height: 200px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.015) 45%,
    rgba(255,255,255,0.025) 50%,
    rgba(255,255,255,0.015) 55%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightDrift 60s linear infinite;
}
```

**Blueprint mode override (add inside or after the `body.blueprint-mode` block, around line 218):**

```css
body.blueprint-mode .terminal-body {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(100,160,200,0.02) 45%,
    rgba(100,160,200,0.035) 50%,
    rgba(100,160,200,0.02) 55%,
    transparent 100%
  );
  background-size: 200% 100%;
}
```

In blueprint mode the light tints blue instead of white — like moonlight on a drafting table.

**Important constraints:**

- Peak opacity is `0.025` (2.5%). This is a whisper. If you can see a bright band moving, the opacity is too high.
- The gradient must be wide and soft (45%–55% of the sweep), not a hard edge.
- Duration is 60 seconds — glacially slow. It should take a full minute to cross the terminal.
- `linear` timing, not `ease` — light doesn't accelerate.
- The `background` shorthand will work because `.terminal-body` has no existing background set.
- `background-size: 200% 100%` ensures the gradient has room to travel beyond the element bounds.

**How to verify:** Open the page. Wait 30 seconds. You should not notice anything dramatic — but if you look carefully at the terminal body area, you might catch a faint brightening that slowly drifts right. In blueprint mode, the drift should feel cooler/bluer. If you can't see it at all on a calibrated monitor, bump opacity to `0.03` but no higher.

---

## 3. The Canvas Responds to Presence

**What it does:** The blueprint background canvas rotates faster when the mouse is moving and settles back to its idle speed when the mouse stops. The building's blueprint "notices" you — it responds to your presence without being reactive or jumpy.

**The variable you need already exists.** On line 287, inside the cursor trail block:

```javascript
let mouseX = 0, mouseY = 0, isMoving = false, moveTimeout;
```

This `isMoving` boolean flips to `true` on every `mousemove` event and resets to `false` after 100ms of stillness. It's perfect. But it's scoped inside the `if (!isMobile)` block (line 278), so it's not globally accessible.

**Step 1: Make `isMoving` globally accessible.**

Move the `isMoving` declaration outside the `if (!isMobile)` block. Specifically:

Before line 278 (`if (!isMobile) {`), add:

```javascript
let isMoving = false;
```

Then on line 287, change:

```javascript
let mouseX = 0, mouseY = 0, isMoving = false, moveTimeout;
```

to:

```javascript
let mouseX = 0, mouseY = 0, moveTimeout;
```

This makes `isMoving` accessible to both the cursor trail code and the canvas code further down. On mobile (where the cursor trail block doesn't execute), `isMoving` stays `false` permanently — which is correct, the canvas just rotates at idle speed.

**Step 2: Modify the canvas rotation speed.**

In the canvas draw function (line 794, `drawFrame`), find line 805:

```javascript
const rotation = timestamp * 0.001 * (Math.PI / 180); // ~1°/sec
```

Replace it with:

```javascript
const baseSpeed = Math.PI / 180; // 1°/sec idle
const activeSpeed = baseSpeed * 2.5; // 2.5°/sec when mouse moves
const speed = isMoving ? activeSpeed : baseSpeed;
const rotation = timestamp * 0.001 * speed;
```

**Important constraints:**

- The active multiplier is `2.5` — fast enough to notice a subtle quickening, not so fast that the geometry spins dramatically.
- Do NOT add easing/lerping between the speeds. The `isMoving` toggle already has a 100ms timeout buffer (line 292), which creates a natural settle. Adding interpolation on top would over-engineer it.
- On mobile, `isMoving` is always `false`, so the canvas always rotates at idle speed. This is intentional — no touch-based speed changes needed.
- Do not change anything about the concentric circles' breathing animation — only the radial rotation speed is affected.

**How to verify:** Open the page on desktop. Watch the faint radial lines behind the terminal. Move your mouse around — the lines should rotate noticeably faster. Stop moving — they settle back to their glacial drift within ~100ms. The change should feel like the building "noticed" you, not like you're controlling a turntable.

---

## 4. Typing Has Weight

**What it does:** Every keystroke in the terminal input pulses the terminal's border — a brief flash from the default `--border` color to a slightly brighter `--ghost` color and back. Each letter you type registers physically, like a key striking a typewriter plate. The building feels your input.

**The JS addition (add inside the existing `keydown` listener on `terminalInput`, which starts at line 710).**

At the very top of that listener function, before the `if (e.key === 'Enter')` check (line 711), add:

```javascript
// Border pulse on keystroke
const tw = document.querySelector('.terminal-window');
tw.style.borderColor = 'var(--ghost)';
setTimeout(() => { tw.style.borderColor = ''; }, 150);
```

So the listener becomes:

```javascript
terminalInput.addEventListener('keydown', (e) => {
  // Border pulse on keystroke
  const tw = document.querySelector('.terminal-window');
  tw.style.borderColor = 'var(--ghost)';
  setTimeout(() => { tw.style.borderColor = ''; }, 150);

  if (e.key === 'Enter') {
    // ... existing code ...
```

**Performance optimization:** Cache the terminal window reference. The `document.querySelector` call on every keystroke is wasteful. Since `terminalInput` is already cached at line 314, add this line right after it (line 316 area):

```javascript
const terminalWindow = document.querySelector('.terminal-window');
```

Then use `terminalWindow` in the keystroke handler instead of querying the DOM each time:

```javascript
terminalWindow.style.borderColor = 'var(--ghost)';
setTimeout(() => { terminalWindow.style.borderColor = ''; }, 150);
```

**Add a CSS transition for the border color.** The `.terminal-window` already has transitions on line 91 but they target `width`, `max-width`, `max-height`, `border-color`, `box-shadow`, `border-radius` — and `border-color 0.4s ease` is already there. That's too slow for a keystroke pulse. Override the border-color transition duration specifically:

You don't need to change line 91. Instead, the inline `style.borderColor` set via JS will apply instantly (inline styles bypass transitions for the "set" direction). The 150ms `setTimeout` resets it back, and the existing `0.4s` transition on border-color will create a smooth fade-out from `--ghost` back to `--border`. This actually produces a nice asymmetry: instant flash, slow fade. If you want the fade-out to be faster, change the `border-color 0.4s ease` in line 91 to `border-color 0.15s ease`.

**Recommended:** Change `border-color 0.4s ease` to `border-color 0.15s ease` on line 91 so the pulse feels snappy rather than sluggish.

**Important constraints:**

- The flash color is `var(--ghost)` (`#2a2a2a` in dark mode, `#2a4060` in blueprint mode). This is one step brighter than `--border` — barely visible, just enough to register subconsciously.
- Duration is 150ms. This matches the tactile feel of a key bottoming out and rebounding.
- Do NOT pulse on `Enter`, `ArrowUp`, `ArrowDown`, or `Tab` — only on character input. To filter, add a guard:

```javascript
if (e.key.length === 1) {
  terminalWindow.style.borderColor = 'var(--ghost)';
  setTimeout(() => { terminalWindow.style.borderColor = ''; }, 150);
}
```

`e.key.length === 1` is true for printable characters (letters, numbers, symbols, space) and false for special keys like Enter, Tab, Arrow keys, Shift, etc. This is the cleanest filter.

**How to verify:** Open the page. Type a few characters slowly. Watch the terminal border — you should see a faint brightening with each letter. Type fast and the border should stay subtly lit up (the timeouts overlap). Press Enter, arrow keys, Tab — no pulse. In blueprint mode, the pulse should shift to blue tones automatically (since `--ghost` is redefined).

---

## Summary Table

| Animation | Where | Technique | Key Value |
|---|---|---|---|
| Building breathes | CSS on `.terminal-window` | `@keyframes` scale | `1.002` over 8s |
| Light moves | CSS on `.terminal-body` | gradient + `background-position` | 2.5% opacity over 60s |
| Canvas responds | JS in `drawFrame()` | rotation speed × `isMoving` | 2.5× speed multiplier |
| Typing has weight | JS in `keydown` listener | inline `borderColor` flash | `--ghost` for 150ms |

All four are independent. None conflict with each other, with blueprint mode, with accent mode, or with the expand/shrink states. Total addition: ~25 lines of CSS, ~10 lines of JS.
