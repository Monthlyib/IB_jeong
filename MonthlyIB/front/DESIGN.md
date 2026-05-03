# Monthly IB Design System

## 1. Visual Theme & Atmosphere

Monthly IB is an editorial learning platform for IB students and parents. The UI should feel premium, calm, and academic without becoming heavy. Keep the existing purple brand signal, but use it as an action and identity color rather than flooding whole pages with purple.

The design direction combines:
- Notion-like soft cards and pastel learning surfaces.
- Cal.com-like clean scheduling/product UI density.
- Stripe-like crisp dashboard cards, tabular numbers, and blue-purple tinted shadows.

## 2. Color Tokens

Use these semantic roles in CSS as `--mi-*` variables.

| Token | Value | Role |
| --- | --- | --- |
| `--mi-brand` | `#51346c` | Primary Monthly IB purple. CTAs, active state, key icons. |
| `--mi-brand-deep` | `#241832` | Deep ink for headings and dark surfaces. |
| `--mi-brand-mid` | `#6b4d87` | Secondary purple, hover and decorative marks. |
| `--mi-brand-green` | `#51ae80` | Support/accent success green. |
| `--mi-ink` | `#22182f` | Main text and title color. |
| `--mi-body` | `#4f465c` | Body copy. |
| `--mi-muted` | `#786e86` | Secondary copy, labels. |
| `--mi-canvas` | `#ffffff` | Cards and primary surfaces. |
| `--mi-paper` | `#fdfbff` | Page background. |
| `--mi-surface` | `#f6f1fb` | Light lavender section/card surface. |
| `--mi-surface-strong` | `#eee6f6` | Stronger lavender borders/fills. |
| `--mi-border` | `#e7deef` | Default hairline border. |
| `--mi-border-strong` | `#d5c7e2` | Active borders and controls. |
| `--mi-pastel-peach` | `#ffe9d8` | Warm feature tint. |
| `--mi-pastel-mint` | `#dcf4e6` | Success/guide tint. |
| `--mi-pastel-sky` | `#e0efff` | Info tint. |
| `--mi-pastel-yellow` | `#fff6bf` | Highlight/today tint. |
| `--mi-success` | `#258b5a` | Success text. |
| `--mi-warning` | `#b66a18` | Warning text. |
| `--mi-error` | `#bd3d3d` | Error text. |

## 3. Typography

Primary font is Pretendard with system fallbacks. Use high contrast and good Korean readability.

| Role | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | --- | --- |
| Display | `clamp(4.2rem, 6vw, 7.2rem)` | 800-900 | `0.98-1.05` | `-0.06em` |
| Page Title | `clamp(3rem, 4vw, 4.8rem)` | 800 | `1.08` | `-0.04em` |
| Section Title | `clamp(2.4rem, 3vw, 3.6rem)` | 800 | `1.14` | `-0.03em` |
| Card Title | `1.8rem-2.2rem` | 700-800 | `1.3` | `-0.02em` |
| Body | `1.5rem-1.7rem` | 400-500 | `1.65-1.8` | `0` |
| Caption | `1.2rem-1.35rem` | 600-700 | `1.45` | `0.08em` for uppercase labels |
| Button | `1.4rem-1.55rem` | 700-800 | `1` | `0` |

## 4. Components

### Buttons
- Primary: `--mi-brand`, white text, 12-16px radius, 44-52px height.
- Secondary: white or translucent white background, `--mi-border`, `--mi-brand` text.
- Destructive: soft red background for subtle actions, solid red only for final confirmation.
- Do not use oversized pills everywhere. Pills are for badges/tabs only.

### Cards
- Standard cards use white background, `--mi-border`, 18-26px radius, and soft purple-tinted shadows.
- Feature cards can use pastel tints, but text must remain `--mi-ink`.
- Dashboard/data cards should be denser: smaller padding, tabular numbers, clear row boundaries.

### Inputs
- Inputs use white or `--mi-paper`, 1px border, 14-18px radius, minimum 44px height.
- Focus state uses a visible purple ring: `0 0 0 4px rgba(81,52,108,.10)`.

### Tables
- Header text is uppercase or compact bold, muted purple-gray.
- Rows must preserve readable height but avoid excessive whitespace.
- Pagination should stay near the table, not at the bottom of large empty cards.

### Calendar & Scheduling
- Calendar should feel like a product widget: compact, white card, clear selected/today/weekend states.
- Time slots use 2 columns on iPhone and 3 columns on desktop.
- Disabled slots must be visibly disabled and not clickable.

### AI Tools
- AI tool pages use a consistent tool-card system: hero card, input panel, result panel.
- Long AI responses must be readable on white/paper surfaces with strong text contrast.
- History cards should never use low-contrast purple text on dark purple backgrounds.

## 5. Layout

- Desktop container: `min(148rem, calc(100% - 4.8rem))` for dashboards, `118-126rem` for content pages.
- Mobile gutters: 16px at iPhone widths.
- Header is fixed; every page must respect `--appHeaderHeight`.
- No horizontal scroll on `375 / 390 / 430px` widths.
- Major cards should collapse to one column below 768px.

## 6. Do's and Don'ts

### Do
- Use purple as the brand action signal, not a full-page wash.
- Keep text contrast high, especially in AI history and admin tables.
- Use pastel accents to separate content types.
- Use tabular numbers for finance/admin metrics.
- Keep modals above the fixed header and scroll inside the modal body.

### Don't
- Do not copy another brand identity verbatim.
- Do not use body text on dark purple cards unless the text is white and high contrast.
- Do not add new UI libraries for this design pass.
- Do not alter API contracts or business logic while applying this system.
