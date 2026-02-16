# Responsive Rules

Sizing and interaction rules for the CLI-first portfolio across screen sizes. The terminal is the only interface element — it must feel natural whether someone is on a 27" monitor or holding a phone sideways.

---

## Breakpoints

Three tiers. No in-between states, no breakpoint soup. The terminal either floats or fills.

| Tier | Width | Terminal Behavior |
|------|-------|-------------------|
| Desktop | > 1024px | Floating window, 560px wide, centered. Background canvas visible on all sides. |
| Tablet | 641px–1024px | Floating window, 90vw wide (the existing `max-width: 90vw` handles this naturally). Canvas still visible at edges. |
| Mobile | ≤ 640px | Terminal fills the entire viewport. No border, no shadow, no float. Canvas hidden behind the terminal. Functionally identical to the expanded state. |

The existing CSS already handles the mobile tier via `@media (max-width: 640px)`. The tablet tier needs no special rules — `max-width: 90vw` on the terminal window scales it fluidly between 560px and full-width.

---

## Terminal Window Sizing

**Floating state (desktop/tablet):**
- `width: 560px` — the ideal reading width for monospaced text at 13px. Roughly 65 characters per line.
- `max-width: 90vw` — prevents overflow on narrow viewports while leaving canvas breathing room.
- `max-height: 85vh` — leaves vertical space so the terminal never touches the top/bottom edges.
- `min-height: 200px` on `.terminal-body` — prevents the terminal from collapsing to just the titlebar and input when output is empty.

**Expanded state (any viewport) and mobile default:**
- `width: 100vw`, `max-width: 100vw`, `max-height: 100vh`.
- `border: none`, `box-shadow: none` — no decorative frame when edge-to-edge.
- `.terminal-window` gets `flex: 1` so it stretches to fill the `.page` container.

**Rule:** The terminal should never be narrower than 280px (the smallest reasonable phone width). At 13px monospaced, that's ~30 characters per line — tight but usable. Command output lines should be written with this minimum in mind: keep the longest unbroken string under 30 characters, or accept that it will soft-wrap.

---

## Touch Interaction

**The problem:** There is no backtick key on a phone. There is no hover. There is no tab key. The CLI must work without any of these.

**Input auto-focus.** On page load, `terminalInput.focus()` fires after 100ms. This should pull up the keyboard on most mobile browsers. If it doesn't (Safari sometimes blocks this), clicking anywhere on the page re-focuses the input via the global click listener.

**Re-focus on click.** The global `document.addEventListener('click', ...)` calls `terminalInput.focus()` after 10ms. This ensures that tapping anywhere — the terminal body, the titlebar, empty space — always returns focus to the input. The 10ms delay is intentional: it lets the browser process the click event before stealing focus.

**No hover-dependent UI.** The current build has no hover-only interactions. The traffic light dots have a hover opacity change (0.7), but this is decorative — the dots are still fully visible and tappable without it. If adding new interactive elements, they must work identically on touch and pointer devices.

**Tap targets.** The red expand/shrink dot is 8px diameter, which is below the recommended 44px minimum. This is acceptable because it's a secondary control (the `expand`/`shrink` commands are the primary interface). If this becomes a usability issue, increase the dot's hit area with padding or an invisible larger container — don't increase the visual size.

**Virtual keyboard.** When the mobile keyboard opens, it steals roughly 40–50% of the viewport. The terminal body's `overflow-y: auto` and `flex: 1` handle this naturally: the output area shrinks, the input line stays pinned at the bottom, and the user can scroll up to see earlier output. No special handling needed, but test this on iOS Safari (which handles viewport resizing differently than Chrome).

---

## Typography Scaling

**No scaling.** Font sizes are fixed, not responsive. The base is 13px for terminal text across all viewports. This is intentional: monospaced text at a consistent size is the entire visual identity. Scaling it up on mobile would break the terminal aesthetic.

| Element | Size | All viewports |
|---------|------|---------------|
| Terminal body text | 13px | Fixed |
| Titlebar label | 11px | Fixed |
| Dim hints (`.out.dim`) | 12px | Fixed |
| Input placeholder | 13px (inherits) | Fixed |
| Blueprint cartouche | 8px | Fixed |

**Rule:** Never use `clamp()`, `vw` units, or media queries on font sizes. If text overflows on a small screen, the solution is shorter copy or line wrapping — not larger type.

---

## Output Line Length

Terminal output is plain text with manual spacing (two-space indents for structured data like the work list or tools list). On narrow screens, long lines will soft-wrap at the terminal body's edge.

**Guidelines for writing command output:**
- Keep unindented lines under 55 characters (fits the 560px window at 13px without wrapping).
- Keep indented lines under 50 characters.
- For mobile tolerance, no single word should exceed 25 characters (prevents awkward mid-word breaks).
- When listing structured data (like the work command), use two-space indent for labels and four-space indent for descriptions. This stays readable when it wraps.

**What to avoid:**
- ASCII art or box-drawing characters — they break on wrap.
- Right-aligned text — it loses meaning on wrap.
- Fixed-width column layouts wider than 50 characters — they collapse into nonsense on mobile.

---

## Canvas Responsiveness

**Sizing.** The canvas fills the viewport (`position: fixed; inset: 0`) and sizes itself to `window.innerWidth * devicePixelRatio` by `window.innerHeight * devicePixelRatio` for Retina clarity. On resize, it recalculates and redraws.

**Geometry scaling.** The radial pattern's `maxR` is `Math.min(w, h) * 0.42`, so it scales proportionally to the smaller viewport dimension. On a tall phone, the circle is based on the width. On a wide monitor, it's based on the height. This keeps the pattern from overflowing.

**Mobile simplification.** When `isMobile` is true (detected via `(hover: none)` media query at page load):
- Radial lines reduce from 36 to 18.
- Concentric circles reduce from 5 to 3.
- This cuts draw calls roughly in half.

**Visibility.** On mobile, the terminal fills the entire viewport, so the canvas is fully occluded. It still renders (the RAF loop doesn't stop), but nothing is visible. If performance becomes a concern on low-end phones, consider pausing the canvas loop when mobile is detected and the terminal is not in floating mode. Currently not implemented because the 15fps throttle keeps CPU usage negligible.

---

## State Interactions at Different Sizes

**Expand/shrink on mobile.** The expand command works on mobile but has no visible effect — the terminal is already full-viewport. The shrink command also has no visible effect. Both still print their feedback messages. This is acceptable: the commands exist primarily for desktop, and mobile visitors are unlikely to type them. If this feels wrong, the commands could detect mobile and respond with something like "Already filling the room on this screen" instead.

**Blueprint mode on mobile.** Works identically. The CSS variable swap applies regardless of viewport. The canvas geometry responds. The cartouche appears. The only difference is the canvas is hidden behind the full-viewport terminal, so the background visual shift is only visible if the user later types `shrink` (which on mobile does nothing) or if they rotate to landscape on a tablet where the terminal is floating.

**Farewell on mobile.** The terminal fades to opacity 0, revealing the canvas behind it. On mobile the canvas was always fully occluded, so the farewell state reveals the blueprint background for the first time — this is actually a nice moment. The comeback listener (keypress or tap) works identically.

---

## Orientation

No orientation-specific rules currently. The terminal adapts fluidly because it uses `max-width: 90vw` (floating) or `width: 100vw` (mobile/expanded), and the canvas scales via `Math.min(w, h)`.

**Landscape phone edge case.** On a phone in landscape (~640x360), the terminal fills the viewport but `max-height: 100vh` means it gets very short. The terminal body's `min-height: 200px` prevents it from disappearing, but the usable output area above the input line is tight (~150px after titlebar and input). The virtual keyboard makes this worse. There is no clean fix for this — landscape phones and virtual keyboards are fundamentally at odds. Recommendation: accept the tight space. The user can scroll the terminal body.

---

## Rule Summary

1. Three tiers: desktop (>1024), tablet (641–1024), mobile (≤640). No intermediate breakpoints.
2. Terminal floats on desktop/tablet, fills on mobile. The `max-width: 90vw` handles the transition fluidly.
3. Font sizes are fixed across all viewports. Never scale type responsively.
4. Auto-focus the input on load and re-focus on every click. The keyboard must always be one tap away.
5. No hover-dependent interactions. Everything must work with touch alone.
6. Keep output lines under 55 characters. No single word over 25 characters.
7. Canvas scales geometrically via `Math.min(w, h)` and reduces complexity on mobile (18 lines, 3 circles).
8. The expand/shrink commands gracefully no-op on mobile. Don't hide them — just let them respond honestly.
9. Test the farewell state on mobile — it's one of the few moments the canvas becomes visible.
10. Accept that landscape phones with virtual keyboards are cramped. Don't fight it.
