# DESIGN.md — Reem Sayed Mohammed Portfolio

Updated: 2026-11-21

## Direction

- **Concept:** A campaign call sheet prepared after a regional launch: structured, concise, and warm with the confidence of an experienced marketing lead.
- **Scene:** A recruiter or potential client reviewing Reem's work between meetings, looking for credible experience and an easy way to start a conversation.
- **Built:** Rank #6 of 7 from direction deal `fa77d9bc`; road not taken: a conventional image-led personal-brand showcase.
- **Qualities:** precise, capable, internationally aware.
- **Avoid:** generic portfolio card grids, invented proof or metrics, low-contrast accents.
- **Palette:** Midnight Rose Dark Luxury. Black and charcoal carry the backgrounds; warm ivory carries readable copy; champagne gold and dusty pink mark actions and selected details.
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
| Display | Sora | Arial, sans-serif | 500, 600, 700 | Google Fonts |
| UI / text | Source Sans 3 | Arial, sans-serif | 400, 500, 600, 700 | Google Fonts |

No other type families. Sora gives the name and section headings a modern, confident form; Source Sans 3 keeps longer experience details easy to read.

## Type scale

| Role | Token | Usage |
| --- | --- | --- |
| Display | `clamp(3.1rem, 5.3vw, 5.3rem)`; mobile `clamp(2.5rem, 8.5vw, 4rem)` | Hero name |
| Section heading | `clamp(2rem, 3.5vw, 3.25rem)` | Section ideas |
| Item heading | `clamp(1.2rem, 1.5vw, 1.45rem)` | Experience and expertise |
| Body | `1.0625rem / 1.65` | Supporting copy |
| Label | `0.86rem` | Section kickers and ledger labels |

## Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `--color-paper` | `#111014` | Page background |
| Surface | `--color-surface` | `#292429` | Alternate sections and scope cards |
| Ink | `--color-ink` | `#292429` | Charcoal backgrounds |
| Deep ink | `--color-ink-deep` | `#111014` | Deep black backgrounds and text on gold |
| Signal | `--color-signal` | `#C7A46B` | Champagne gold accent and action |
| Rose | `--color-signal-dark` | `#D4A0B0` | Dusty pink secondary accent |
| Ivory | `--color-white` | `#F7F3F0` | Readable text |
| Muted | `--color-muted` | `#292429` | Section background |
| Border | `--color-line` | `#D4A0B0` | Structural dividers |
| Focus | `--color-focus` | `#D4A0B0` | Visible focus ring |

Ivory on black/charcoal is used for normal text. Gold and pink on black/charcoal are used for accents and labels. Black on gold is used for the primary button and featured card. Focus uses a 3px pink ring and is not color-only feedback.

## Spacing, geometry, and layout

- Scale: `4, 8, 12, 16, 24, 32, 48, 72, 112` px through `--space-1` to `--space-9`.
- Content width: `72rem`; side gutters: `1rem` on small phones and `1.25rem` to `1.5rem` at larger widths.
- Breakpoints: `28rem` and `48rem`; the layout becomes single-column at `48rem`.
- Experience rows use three keylines: date, content, and scope note. On mobile they become a readable vertical sequence.
- Reading text stays within approximately 43rem.

## Components

- Controls use `--radius-control: 0.35rem`, a minimum 44px target, visible focus, and one consistent press response.
- Containers use `--radius-container: 0.75rem`; no nested card stacks.
- Primary actions use deep ink or signal surfaces with action-specific text.
- Inline Lucide icons support the experience and contact links; selected phrases use bold champagne gold for emphasis.

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
