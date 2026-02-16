# Interaction Animation Plan

Noticeably alive. The terminal and canvas both respond to the visitor — typing registers physically, sending a command sends a ripple through the building, and the architecture acknowledges your presence at every step. Nothing flashy, everything earned.

---

## Design Principles

- **Cause and effect.** Every animation is triggered by a visitor action. Nothing fires randomly. The building reacts to *you*.
- **Terminal is local, canvas is ambient.** The terminal handles crisp, immediate feedback. The canvas echoes it with slower, larger gestures — like tapping a wall and hearing it resonate through the room.
- **Fast in, slow out.** Interactions snap to their active state and ease back gently. This feels responsive without being jumpy.
- **Cumulative energy.** Rapid typing builds visual intensity. The more active you are, the more alive the room becomes. Stop, and it settles.

---

## Animation 1: Keystroke Pulse (Terminal)

**Trigger:** Each printable character typed in the input field.

**What happens:**
- The terminal border flashes from `--border` to `--clay` (the new warm brown) and fades back over 200ms.
- The prompt prefix (`~$`) brightens one step — from `--green` to `--bright` — and fades back over 300ms.
- On rapid typing (>4 keys/sec), the border stays warm and the prompt stays bright — the timeouts overlap and the terminal holds its "active" glow until you pause.

**What the canvas does in response:**
- Each keystroke nudges the canvas rotation speed by a tiny burst — like tapping a spinning object. The rotation accelerates by 0.5°/sec for 200ms, then decays back. Rapid typing creates a gentle sustained spin-up.

**What it feels like:** A typewriter striking a plate. Each letter has mass. The room hears you typing.

---

## Animation 2: Command Send (Terminal + Canvas)

**Trigger:** Pressing Enter with a non-empty input.

**What happens in the terminal:**
- The entire input line flashes — background goes from transparent to `rgba(var(--accent-rgb), 0.06)` and fades over 400ms. A warm gold wash that says "received."
- The echoed command (`~$ look around`) types in at double speed compared to normal output — it's *your* words, they should arrive with confidence.
- A subtle horizontal line (1px, `--ghost` color, 40% width, centered) appears between the echoed command and the response output, fading in over 200ms and fading out over 600ms. A visual "breath" between what you said and what the building says back. Think of it as a section divider that dissolves.

**What the canvas does in response:**
- On Enter, the concentric circles emit a single outward pulse — all rings expand by 8–12px over 400ms, then ease back to their original radii over 800ms. Like dropping a stone in water. One pulse per command, not repeating.
- The center dot (or ring in blueprint mode) flares in opacity — from its resting value to 2× brightness, fading back over 600ms. The heart of the blueprint acknowledges the input.

**What it feels like:** You spoke, and the building heard you. The architecture registers the moment, then settles.

---

## Animation 3: Response Arrival (Terminal)

**Trigger:** The first output line appearing after a command is processed.

**What happens:**
- Output lines slide in from 6px below their final position, fading from 0 to full opacity over 250ms. A micro-entrance — like words being placed on a page by an invisible hand.
- Only the first 3–4 lines of a response get this treatment. After that, lines appear normally (typed character by character via the existing `addLine` queue). This prevents long outputs from feeling sluggish.
- Green header lines (like "Here's what you can ask me:") get a slightly larger slide — 10px — and a 50ms longer fade. Headings arrive with a touch more weight.

**What the canvas does:**
- Nothing. The canvas already responded to the Enter keypress. The response arrival is the terminal's moment — keep it local.

**What it feels like:** The building is composing its answer. Words settle into place like type being set on a press.

---

## Animation 4: Traffic Light Hover (Terminal Titlebar)

**Trigger:** Mouse hovering over the three titlebar dots.

**What happens:**
- On hover, the dots scale to 1.3× over 150ms with a soft box-shadow glow in their respective colors — red glows red, yellow glows gold, green glows green. The glow radius is 6px at 30% opacity.
- On hover over the red dot (which doubles as expand toggle), the entire terminal border subtly tints toward that dot's color — a 100ms flash of `--red` at 8% opacity overlaid on the border. A warning whisper: "this does something."
- On click (the red dot's expand/shrink toggle), the terminal's scale animation does a micro-bounce: scale jumps to 1.005, then settles to 1.0 (or the expanded state) over 300ms. The transition between floating and fullscreen feels physical.

**What the canvas does:**
- On the expand/shrink toggle, the canvas line count doubles momentarily (36 → 72 lines) over 500ms, then fades the extras out over 1 second. The blueprint "unfolds" when you expand the room, then simplifies back. Feels like unrolling a larger sheet of paper.

**What it feels like:** The controls are alive. Hovering reveals intention, clicking has consequence.

---

## Animation 5: Farewell Cascade (Terminal + Canvas)

**Trigger:** The `leave` command.

**What happens in the terminal:**
- Instead of a hard opacity fade, the terminal lines dissolve bottom-to-top — each line fades out with a 30ms stagger, starting from the newest output. The terminal empties itself like ink drying in reverse.
- The final line to disappear is the titlebar. The traffic dots fade last, one by one: green → yellow → red. Lights going out.
- The border fades to `--deep` (the cool teal) before disappearing entirely — the room goes cold.

**What the canvas does:**
- The rotation decelerates to zero over 2 seconds (the blueprint stops spinning).
- The concentric circles contract inward — each ring shrinks toward the center over 1.5 seconds with staggered timing. The blueprint folds itself up.
- The center dot is the last thing visible, lingering for 500ms after everything else is gone, then fading. The hearth goes dark.

**On comeback (keypress/click after farewell):**
- Everything reverses. The center dot appears first, then rings expand outward, then rotation resumes. The terminal fades in top-to-bottom (titlebar first, then content). The building wakes up.

**What it feels like:** You didn't close a window. You left a room, and the room noticed.

---

## Animation 6: Canvas Presence Ripple (Canvas)

**Trigger:** Mouse click anywhere on the page (outside the terminal input).

**What happens:**
- A single concentric ring emanates from the click coordinates on the canvas — starting at 0px radius, expanding to 120px, fading from 15% opacity to 0% over 800ms. One ring, one click. Like tapping glass.
- The ring uses `--clay` in dark mode, `--deep` in blueprint mode.
- The existing radial geometry near the click point brightens momentarily — lines within 100px of the click flash to 2× their normal opacity for 300ms. The blueprint "lights up" where you touched it.

**What it feels like:** The blueprint is a surface. You can touch it and it responds. The architecture is interactive even outside the terminal.

---

## State Interactions

| Animation | Works in expanded? | Works in blueprint mode? | Works in accent mode? | Works on mobile? |
|---|---|---|---|---|
| Keystroke pulse | Yes | Yes (border flashes `--deep` instead of `--clay`) | Yes | Yes (no canvas nudge) |
| Command send | Yes | Yes (pulse rings use blueprint colors) | Yes | Yes (no canvas pulse) |
| Response arrival | Yes | Yes | Yes | Yes |
| Traffic light hover | Yes (bounce still fires on toggle) | Yes | Yes | No (no hover on touch) |
| Farewell cascade | Yes (expands back to floating first, then cascades) | Yes (blueprint colors throughout) | Yes | Yes (simplified: no stagger, clean fade) |
| Canvas presence ripple | Yes | Yes (ring uses `--deep`) | Yes | No (touch clicks go to terminal focus) |

---

## Performance Budget

- All terminal animations use CSS transitions or `requestAnimationFrame` — no JS intervals.
- Canvas ripple and pulse use the existing draw loop — add a small array of "active effects" that get drawn each frame and removed when complete. No new `requestAnimationFrame` calls.
- Mobile skips all canvas interaction effects. The terminal-side animations still fire.
- Maximum simultaneous effects: 1 border pulse + 1 canvas pulse + 1 response slide-in. These don't compound into jank.

---

## Implementation Priority

If building these incrementally:

1. **Keystroke pulse** — smallest scope, biggest feel improvement, builds on existing "typing has weight" concept
2. **Command send** — the canvas ring pulse is the signature moment, worth getting right
3. **Response arrival** — the slide-in adds polish to every interaction
4. **Farewell cascade** — the most complex but also the most memorable. Save it for when the basics are solid
5. **Traffic light hover** — nice-to-have, smallest impact
6. **Canvas presence ripple** — delightful but non-essential, add last

---

## Summary

Six animations, two surfaces (terminal + canvas), all triggered by visitor actions. The terminal handles immediate, crisp feedback. The canvas echoes with slower ambient responses. Together they create the sensation that you're not using a website — you're inside a building that knows you're there.
