# `packages/ui`

Supabase's shared React component library. Built on [Radix UI](https://www.radix-ui.com/) primitives and [shadcn/ui](https://ui.shadcn.com/), styled with Tailwind CSS, and used across all Supabase apps.

## Usage

Import from the `'ui'` package alias:

```tsx
import { Badge, Button, Input } from 'ui'
```

Some of the components have the `_Shadcn_` suffix. These components should be preferred, they're in a process of replacing the other ones.

### Utilities

```tsx
import { cn, copyToClipboard, mergeDeep } from 'ui'

copyToClipboard('hello')
```

`copyToClipboard` accepts a string or `Promise<string>`.
Pass a promise directly when resolving text asynchronously so Safari can keep the clipboard write within the user gesture.
If the rich `ClipboardItem` write path is unavailable or rejects, the helper falls back to `writeText`.
The optional callback runs after a successful write.

## Styling conventions

- Tailwind only — no inline styles or CSS modules.
- Prefer shadcn semantic pairs (`bg-card text-card-foreground`, `bg-muted text-muted-foreground`,
  `bg-tertiary text-tertiary-foreground`) over hardcoded colors. Legacy utilities such as
  `text-foreground-light` and `border-default` are compatibility aliases only.
- Control surface roles (`bg-field`, `bg-control-raised`, `border-control-hover`; CSS
  `--control` aliases raised) live in [`build/css/source/semantic.css`](./build/css/source/semantic.css).
  Prefer those over inventing fills. Legacy `bg-control` is still the accent wash alias.
- Themes set the core `--hue` (or the split `--surface-hue` / `--primary-hue`), `--chroma`,
  `--surface`, `--foreground-lightness`, and `--contrast` inputs, plus their
  `--muted-foreground-level` and `--tertiary-foreground-level` hierarchy.
  Semantic colors are derived from them in OKLCH; `--contrast: 1` is the baseline and the supported
  adjustment range is `0.75` to `1.25`.
- The workspace root owns the actual `tailwind.config.js`. The file in this package is a stub for IntelliSense only.
