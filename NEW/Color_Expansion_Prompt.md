# Prompt: Color Palette Expansion — Two New Tokens

Two new CSS custom properties drawn from Frank Lloyd Wright's actual material palette. Each fills a real gap in the existing color system. No existing tokens change.

---

## New Tokens

Add these two lines to the `:root` block, after `--green` and before the closing `}`:

```css
--clay: #5c4033;
--deep: #1a3a4a;
```

- **`--clay`** — Warm brown. Covered Wagon from the FLW palette. Sits between `--ghost` (#2a2a2a) and `--muted` (#555555) but carries warmth where those are neutral gray. Think aged leather, walnut trim, Taliesin hallway floors.
- **`--deep`** — Cool teal-navy. Blue Lava from the FLW palette. A second accent that contrasts the warm gold of `--accent`. Think prairie sky at dusk, the deep water at Fallingwater.

### Blueprint mode overrides

Inside the `body.blueprint-mode` block, add overrides so the new tokens adapt to the blue context:

```css
--clay: #4a6070;
--deep: #1a4a5a;
```

In blueprint mode, `--clay` shifts cooler (becomes a muted slate) and `--deep` brightens slightly to stay visible against the blue background.

---

## Where to Use Them

### `--clay` — The warm mid-tone

**1. New output class: `.out.warm`**

Add this CSS rule alongside the other `.terminal-body .out.*` classes:

```css
.terminal-body .out.warm { color: var(--clay); }
```

Use this class for lines that should feel organic and secondary — metadata, parenthetical thoughts, things that are informative but shouldn't demand attention. For example, the boot sequence could use it instead of `dim` if you want the startup to feel warmer rather than ghostly.

**2. The blueprint cartouche text**

The `.blueprint-cartouche` currently uses `color: var(--ghost)`. Change it to:

```css
.blueprint-cartouche {
  color: var(--clay);
}
```

The cartouche ("LOGAN ROSS / SHEET NO. 1 / 2026") is an architectural stamp — it should read as aged ink on paper, not as a ghost. `--clay` gives it that warmth.

**3. Scrollbar thumb**

The scrollbar currently uses `--ghost`. A subtle upgrade:

```css
html {
  scrollbar-color: var(--clay) var(--bg);
}
```

The scroll handle picks up the warmth of the rest of the palette instead of being cold gray.

### `--deep` — The cool accent

**1. Terminal box-shadow tint**

The `.terminal-window` box-shadow is currently pure black (`rgba(0,0,0,0.5)`). Add a faint teal tint:

```css
box-shadow: 0 20px 80px rgba(26,58,74,0.3);
```

That's `--deep` as an RGB value at 30% opacity. The shadow now has a subtle coolness — like the terminal is sitting in pooled blue light. Very faint, but it adds depth.

**2. Blueprint mode border**

In the `body.blueprint-mode` block, the border overrides to `--border` which becomes `#1a3050`. Consider making the border use `--deep` instead for a richer separation:

```css
body.blueprint-mode .terminal-window {
  border-color: var(--deep);
}
```

**3. Future use: external links**

When/if the portfolio adds clickable links (in the `work` or `say hello` commands), `--deep` is the right color for link text — it's clearly different from `--accent` gold and `--green`, signaling "this goes somewhere else" without clashing.

---

## Updated Color Hierarchy

After these additions, the full system looks like this:

```
Darkest                                              Brightest
──────────────────────────────────────────────────────────────
--bg       #0a0a0a   background
--surface  #111111   raised surfaces
--border   #1e1e1e   lines, dividers
--ghost    #2a2a2a   dimmest text, whispers
--clay     #5c4033   warm secondary text      ← NEW
--deep     #1a3a4a   cool accent, shadows     ← NEW
--muted    #555555   default output text
--body     #888888   body text
--green    #5a9a7a   headings, confirmations
--text     #b0b0b0   input text
--bright   #d4d0c8   echoed commands, titles
--accent   #c9a96e   gold highlights
--red      #9B2335   traffic dot, warnings
--white    #eae6de   brightest text
```

`--clay` and `--deep` don't replace anything — they fill the gap between structural grays and content colors, giving the palette warmth and a cool counterpoint it was missing.

---

## What NOT to Change

- Do not modify any existing token values. The original 12 tokens stay exactly as they are.
- Do not use `--clay` or `--deep` for any text that needs to be easily readable. They're accent and atmosphere colors — secondary roles only.
- Do not introduce more than these two tokens. The palette should feel curated, not sprawling.

---

## How to Verify

1. **Cartouche:** Toggle blueprint mode. The stamp text at the bottom-right of the terminal should feel like aged ink — warm brown in dark mode, muted slate in blueprint mode.
2. **Shadow:** Look at the terminal's drop shadow on a large monitor. It should carry a faint cool tint rather than pure black — noticeable if you compare side-by-side, invisible if you don't.
3. **Scrollbar:** Scroll through a long command output (try `look around` then `work` then `tools`). The scrollbar thumb should be a warm brown, not cold gray.
4. **Overall impression:** The page should feel slightly warmer and more dimensional than before, without any single element screaming "new color."
