# Prompt: Terminal Sizing — Desktop Immersion Fix

The terminal window feels too small on desktop monitors. At a fixed `560px` width, it reads like a widget floating in a void rather than a space you're standing inside. This is a one-line CSS fix.

---

## The Change

In `index.html`, find `.terminal-window` (around line 82):

```css
.terminal-window {
  width: 560px;
  max-width: 90vw;
  max-height: 85vh;
```

Replace those three lines with:

```css
.terminal-window {
  width: clamp(560px, 55vw, 860px);
  max-width: 90vw;
  max-height: 88vh;
```

That's it. Two values changed.

---

## What This Does

- **`clamp(560px, 55vw, 860px)`** — the terminal now scales with the viewport. On a 1024px screen it stays at 560px (the old size). On a 1440px display it grows to ~790px. On a 1920px ultrawide it caps at 860px before it starts feeling like a spreadsheet. One function, no media queries.
- **`max-height: 85vh` → `88vh`** — a small bump that gives the conversation more vertical breathing room. Three extra viewport-height percent worth of scroll space.

---

## What NOT to Touch

- The mobile breakpoint at `@media (max-width: 640px)` already forces `width: 100vw` and `max-width: 100vw`. That override still wins on small screens. Leave it alone.
- The `body.terminal-expanded .terminal-window` rules already set `width: 100vw` and `max-height: 100vh` for the expanded state. Those still win when expanded. Leave them alone.
- The `max-width: 90vw` stays as a safety net for tablet-sized screens between 640px and 1024px where `55vw` would be fine but `90vw` prevents any horizontal overflow edge cases.

---

## How to Verify

1. Open the page at 1440px viewport width. The terminal should be noticeably wider than before — roughly 790px, filling more of the room.
2. Resize to 1024px. The terminal should be 560px — unchanged from the old behavior.
3. Resize to 1920px. The terminal should cap at 860px, not keep growing.
4. Resize below 640px. The terminal should still snap to full-width (mobile breakpoint takes over).
5. Type `expand`. The terminal should still fill the entire viewport. Type `shrink`. It should return to the `clamp`-calculated size.
