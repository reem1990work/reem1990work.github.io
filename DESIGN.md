# DESIGN.md — Reem Sayed Mohammed Portfolio

Updated: 2026-11-17

## Direction

- **Concept:** A campaign call sheet prepared after a regional launch: structured, concise, and warm with the confidence of an experienced marketing lead.
- **Scene:** A recruiter or potential client reviewing Reem's work between meetings, looking for credible experience and an easy way to start a conversation.
- **Built:** Rank #6 of 7 from direction deal `fa77d9bc`; road not taken: a conventional image-led personal-brand showcase.
- **Qualities:** precise, capable, internationally aware.
- **Avoid:** beauty-category pink, generic portfolio card grids, invented proof or metrics.
- **Motion:** Corporate and restrained. Controls answer immediately; sections enter only when useful. No ambient movement.
- **Signature details:** Call-sheet ledger in the hero and editorial experience rows. No pool effects.

## Code tokens

| Platform | File | Naming |
| --- | --- | --- |
| Web | `style.css` | CSS custom properties in `:root` |

Units: CSS pixels and rems.

## Fonts

| Role | Family | Fallback | Weights | Loading |
| --- | --- | --- | --- | --- |
| Display | Barlow Condensed | Impact, sans-serif | 500, 600, 700 | Google Fonts |
| UI / text | DM Sans | Arial, sans-serif | 400, 500, 600, 700 | Google Fonts |

No other type families. Barlow Condensed gives campaign headings the compression of a production call sheet; DM Sans keeps experience details direct and readable.

## Type scale

| Role | Token | Usage |
| --- | --- | --- |
| Display | `clamp(5rem, 12.5vw, 10rem)` | Hero name |
| Section heading | `clamp(3.1rem, 6.5vw, 5.7rem)` | Section ideas |
| Item heading | `clamp(1.7rem, 2.4vw, 2.35rem)` | Experience and expertise |
| Body | `1rem / 1.58` | Supporting copy |
| Label | `0.86rem` | Section kickers and ledger labels |

## Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `--color-paper` | `#f1f3ee` | Page background |
| Surface | `--color-surface` | `#fafbf8` | Light sections and scope cards |
| Ink | `--color-ink` | `#173d44` | Hero, headers, primary action |
| Deep ink | `--color-ink-deep` | `#0e2a31` | High-contrast text and dark section |
| Signal | `--color-signal` | `#e6c45e` | Call-sheet highlight and action |
| Muted | `--color-muted` | `#dbe3dc` | Section background |
| Border | `--color-line` | `#91a39c` | Structural dividers |
| Focus | `--color-focus` | `#d2862c` | Visible focus ring |

Measured intent: deep ink on paper and white on ink are reserved for normal text; signal is never used as small text on paper. Focus uses a 3px ring and is not color-only feedback.

## Spacing, geometry, and layout

- Scale: `4, 8, 12, 16, 24, 32, 48, 72, 112` px through `--space-1` to `--space-9`.
- Content width: `76rem`; page gutters: `1.5rem` phone, `2rem` desktop.
- Breakpoints: `28rem` and `48rem`; the layout becomes single-column at `48rem`.
- Experience rows use three keylines: date, content, and scope note. On mobile they become a readable vertical sequence.
- Reading text stays within approximately 43rem.

## Components

- Controls use `--radius-control: 0.35rem`, a minimum 44px target, visible focus, and one consistent press response.
- Containers use `--radius-container: 0.75rem`; no nested card stacks.
- Primary actions use deep ink or signal surfaces with action-specific text.

## Motion

- Press: `--motion-press: 90ms` scale response; return is handled by the same named transition.
- Micro: `--motion-micro: 160ms` for color, underline, focus, and menu state.
- Section entry: `--motion-medium: 320ms` with `--ease-enter` and an 0.75rem transform only when JavaScript and reduced-motion settings allow it.
- Reduced motion removes spatial transitions while preserving focus, state, and the copy confirmation.

## Voice and copy

- Tone: direct, practical, confident, specific.
- Use sentence case. Do not add invented results, client logos, testimonials, pricing, or generic marketing claims.
- The visitor's job is **hire**; the page ends with a plain email and phone action rather than a stock newsletter form.

## Prohibited in this project

- `slop:identical-card-grid`, `slop:split-hero-reflex`, `slop:stock-close`, `slop:ai-palette`, `slop:category-hue`, `slop:gradient-text`, `slop:emoji-icon`, `slop:scroll-reveal-all`, `slop:generic-claims`.
- Decorative movement, looping status indicators, and dead controls.
