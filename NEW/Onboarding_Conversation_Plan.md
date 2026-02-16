# Onboarding Conversation Plan

The CLI greets every visitor like Frank welcoming a guest into Taliesin — curious, warm, dignified. Two to three questions, then the doors open. The building remembers what it learns.

---

## Philosophy

A portfolio that asks your name before showing you anything is making a statement: *you matter more than the work.* The conversation isn't a form. It's a handshake. The CLI should feel like it's genuinely interested, not collecting data.

The tone is a warm architect — someone who's built the room you're standing in and wants to know what brought you through the door.

---

## What Gets Remembered

Three things persist for the entire session and get woven into responses:

- **Name** — used sparingly in command outputs (never every line, that feels robotic)
- **What brings them here** — maps to an intent: `curious`, `hiring`, `collaborating`, or `wandering`
- **What they care about** — a life-goal or interest signal that colors the farewell, the about section, and the tone of suggestions

These are stored as simple JS variables (`visitorName`, `visitorIntent`, `visitorInterest`). Nothing leaves the browser. Nothing persists after refresh.

---

## The Flow

### Phase 0: Boot Sequence (unchanged)

The existing boot lines play first to set the stage:

```
initializing structure...
loading materials...
opening doors...
```

Brief pause. Then Phase 1 begins instead of the current welcome message.

---

### Phase 1: The Name

The terminal types:

```
Before we begin — what should I call you?
```

The input placeholder changes from `try typing something...` to a gentle nudge — something like `your name` or `just a first name is fine`.

**Handling the response:**

| What they type | What happens |
|---|---|
| A name (any single word or two words) | Store it. Move to Phase 2. |
| Nothing (just hits Enter) | `That's alright. I'll call you "visitor."` → store `"visitor"`, move to Phase 2. |
| A command (like `help`, `about`, `work`) | `We'll get to that. But first — what's your name?` Gentle redirect, stay on Phase 1. |
| Something rude or absurd | Accept it gracefully. If someone wants to be called `asdf`, that's their prerogative. The building doesn't judge. |

**Response after receiving a name:**

```
[Name]. Welcome.
```

One beat. Then Phase 2.

---

### Phase 2: The Intent

```
What brings you to the door today?
```

This is a free-text question, but the CLI maps the answer to one of four intents. The mapping doesn't need to be perfect — it's about energy, not precision.

**Intent mapping logic:**

| Keywords / patterns | Mapped intent | CLI response |
|---|---|---|
| `work`, `portfolio`, `projects`, `see`, `look`, `built`, `show` | `curious` | `A fellow admirer of the craft. Let me show you around.` |
| `hire`, `hiring`, `job`, `opportunity`, `position`, `recruit`, `team` | `hiring` | `Glad you came. I've left the best rooms unlocked for you.` |
| `collab`, `partner`, `build`, `together`, `project`, `idea`, `pitch` | `collaborating` | `Now that's interesting. Pull up a chair.` |
| `just looking`, `browsing`, `curious`, `wandering`, `idk`, `dunno`, `not sure` | `wandering` | `No agenda needed. Wander freely.` |
| Anything else / no clear match | `wandering` | `No agenda needed. Wander freely.` |
| Empty (just Enter) | `wandering` | `Understood. The doors are all open.` |

The response is one line, typed. One beat. Then Phase 3.

---

### Phase 3: The Interest

This question is softer — it's the one that makes the experience feel human. It asks about *them*, not about the portfolio.

```
One more thing — what's on your mind lately? Could be anything.
```

Placeholder shifts to something like `a dream, a problem, a project...`

**This is fully free-text.** The CLI doesn't try to categorize or map it. It stores the raw string in `visitorInterest` and responds warmly:

| What they type | Response |
|---|---|
| Anything substantive (3+ characters) | `[Interest]. I like that. Let's see what we find.` |
| Empty (just Enter) | `Fair enough. Some things don't need names yet.` |
| A command | Same gentle redirect as Phase 1: `Almost there. What's been on your mind?` |

After the response, one final beat:

```
You're in. Type "look around" when you're ready.
```

The input placeholder reverts to `try typing something...` and the normal CLI command system activates.

---

## How Memory Weaves In

Once the conversation is over, the three stored values subtly color the rest of the session. The key word is *subtly* — don't overdo it.

### Name usage

Sprinkle, don't flood. Examples of where the name appears:

- **`about` command:** `"Logan Ross. Builder, designer, engineer."` stays the same — but a new line appears at the end: `"Glad you asked, [Name]."`
- **`leave` command:** `"Thanks for stopping by, [Name]."` instead of the generic `"Thanks for stopping by."`
- **`start over` command:** `"Fresh start, [Name]."` instead of `"Fresh start."`
- **Comeback (after farewell):** `"[Name]. Welcome back."` instead of `"Welcome back."`
- **`say hello` command:** `"I'd love to hear from you, [Name]."` — makes the contact page feel like a real invitation

If `visitorName` is `"visitor"`, skip personalization — don't say "Thanks for stopping by, visitor." Just use the default lines.

### Intent usage

The intent tailors *which commands get suggested*, not the commands themselves.

- **After Phase 3 completes**, the "You're in" message can add a contextual nudge:
  - `curious` → `Try "work" first.`
  - `hiring` → `Try "about" to start.`
  - `collaborating` → `Try "say hello" — let's talk.`
  - `wandering` → No nudge. Just `Type "look around" when you're ready.`

- **In the `look around` output**, the command list stays the same for everyone. But a dim line at the bottom can say:
  - `curious` → `Since you came to see the work — "work" is a good place to start.` (dim)
  - `hiring` → `Looking to hire? "about" and "work" tell the story.` (dim)
  - `collaborating` → `Got an idea? "say hello" — I'm listening.` (dim)
  - `wandering` → no extra line

### Interest usage

The interest is the most personal piece. Use it only twice, both times at high-emotion moments:

1. **The `leave` / farewell command:** After `"Thanks for stopping by, [Name]."` add a dim line: `"Keep chasing [interest]."` — or if the interest is too long (>40 chars), just: `"Keep going."`

2. **The comeback (after farewell):** After `"[Name]. Welcome back."` add: `"Still thinking about [interest]?"` (dim)

If `visitorInterest` is empty, these lines don't appear.

---

## Edge Cases

### Returning visitors (same session)
If someone types `start over`, the conversation does NOT replay. They've already introduced themselves. Clear the terminal, say `"Fresh start, [Name]."` and drop them into the normal CLI.

### The `leave` → comeback → `start over` loop
Memory persists until page refresh. The name, intent, and interest survive `start over` and farewell cycles. Only a hard refresh resets the introduction.

### Very long names or interests
Truncate display at 30 characters for names, 50 for interests. Store the full string but clip what gets typed into responses so the terminal lines don't wrap awkwardly.

### The visitor who skips everything
If they hit Enter through all three phases, they get: name = `"visitor"`, intent = `wandering`, interest = empty. The experience gracefully degrades to exactly what exists today — no personalization, no awkwardness.

### Mobile / touch
The onboarding works identically on mobile. The auto-focus and tap-to-focus behaviors already handle keyboard activation. The placeholder text changes are the only UX difference.

---

## Conversation Flow Diagram

```
BOOT SEQUENCE
  │
  ▼
"Before we begin — what should I call you?"
  │
  ├── [name entered] ──→ store name ──→ "[Name]. Welcome."
  ├── [empty Enter] ──→ store "visitor" ──→ "That's alright."
  └── [command typed] ──→ gentle redirect ──→ (stay on Phase 1)
        │
        ▼
"What brings you to the door today?"
  │
  ├── [curious keywords] ──→ intent = curious ──→ "A fellow admirer..."
  ├── [hiring keywords] ──→ intent = hiring ──→ "Glad you came..."
  ├── [collab keywords] ──→ intent = collaborating ──→ "Pull up a chair."
  ├── [vague / empty] ──→ intent = wandering ──→ "No agenda needed."
  └── [command typed] ──→ (accept as-is, map to wandering)
        │
        ▼
"One more thing — what's on your mind lately?"
  │
  ├── [anything typed] ──→ store interest ──→ "[Interest]. I like that."
  ├── [empty Enter] ──→ interest = null ──→ "Some things don't need names yet."
  └── [command typed] ──→ gentle redirect ──→ (stay on Phase 3)
        │
        ▼
"You're in. Type 'look around' when you're ready."
  + optional intent-based nudge
        │
        ▼
  ┌─────────────────────────────────┐
  │   NORMAL CLI (commands active)  │
  │   Memory colors responses:      │
  │   • Name in greetings/farewells │
  │   • Intent in suggestions       │
  │   • Interest in farewell/return │
  └─────────────────────────────────┘
```

---

## Implementation Notes

**New JS variables (top of script, global scope):**

```
let visitorName = null;
let visitorIntent = null;   // 'curious' | 'hiring' | 'collaborating' | 'wandering'
let visitorInterest = null;
let onboardingPhase = 0;    // 0 = boot, 1 = name, 2 = intent, 3 = interest, 4 = done
```

**Input handling during onboarding:** While `onboardingPhase < 4`, the Enter key routes to an `handleOnboarding(input)` function instead of `processCommand(input)`. Once Phase 3 completes, set `onboardingPhase = 4` and all future input goes through the normal command system.

**No new HTML elements needed.** The existing terminal body, input, and placeholder are sufficient. The only DOM changes during onboarding are placeholder text swaps.

**Total estimated addition:** ~60–80 lines of JS, 0 lines of CSS.
