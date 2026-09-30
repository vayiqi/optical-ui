# Components

Import from the folder you copied into your app. Wrap the components in `OpticalProvider` to share the theme. Each component's TypeScript definition is the complete prop reference.

## Controls

| Component | Usage |
| --- | --- |
| `Button` | Native button props. `variant`: `solid`, `soft`, `glass`, or `ghost`. `pending` shows activity. |
| `IconButton` | Button props with a required accessible `label`. Add `feedback` for press feedback. |
| `ButtonGroup` | Related buttons with a shared highlight. Requires `label` and children. |
| `Switch`, `Checkbox` | `label`, optional `description`, and Base UI root props. Use `checked` / `onCheckedChange` or `defaultChecked`. |
| `RadioGroup`, `SegmentedControl` | `label`, `options`, and Base UI radio-group props. Each option has `value`, `label`, optional `description` and `disabled`. |
| `Slider`, `RangeSlider` | `label` and Base UI slider props. Use a number for Slider and a two-number array for RangeSlider. Slider also accepts `unit`. |
| `TextField`, `TextArea` | Native input / textarea props with `label`, optional `description` and `error`. |
| `Select` | Native select props, `label`, and `options` with `value`, `label`, and optional `disabled`. |
| `Combobox` | `label`, `items: string[]`, `value`, `onValueChange`, and optional `placeholder`. |
| `NumberField` | `label` and Base UI number-field props, including `min`, `max`, `step`, and `onValueChange`. |
| `SearchField` | `label`, `value`, `onValueChange`, and optional `placeholder`. |

## Navigation

| Component | Usage |
| --- | --- |
| `Tabs` | Base UI tabs props and `items: { value, label, content }[]`. |
| `Accordion` | Base UI accordion props and `items: { value, title, content }[]`. |
| `Breadcrumbs` | `items: { label, href? }[]`. The last item is the current location. |
| `Pagination` | `page`, `total`, and `onPageChange`. |
| `DataTable` | `columns: { key, label }[]`, `rows`, and optional `caption`. Sorting happens locally. |
| `CommandMenu` | `commands: { label, run }[]`. Supply the action in `run`. |

## Feedback and overlays

| Component | Usage |
| --- | --- |
| `ToastProvider`, `useToast` | Wrap once, then call `useToast().add({ title, description })`. |
| `Alert` | `title`, children, optional `action` and `onDismiss`. |
| `Progress` | `value` from 0–100 and optional `label`. |
| `Skeleton` | A placeholder with div props. Set dimensions and put `aria-busy` on the loading content container. |
| `Badge` | Children, optional `tone` (`accent`, `neutral`, `success`) and `onRemove`. |
| `Avatar` | `name`, optional `src` and `size`. Initials are the image fallback. |
| `Tooltip` | `content` and children. The component supplies a focusable trigger. |
| `Popover` | `trigger`, `title`, and children. |
| `Dialog`, `Drawer` | `trigger`, `title`, `description`, and children. Optional `open` / `onOpenChange`. |
| `DropdownMenu` | `label` and `items: { label, onClick, disabled? }[]`. |

## Motion helpers

`ActionGlyph`, `IconStateGlyph`, `MorphLabel`, and `SteppingNumber` are available for composing state changes. See the Button, Icon button, and Button group examples in `src/system/examples.tsx` for complete usage.

`SteppingNumber` reshapes nonnegative integer digits. Other numeric values display as ordinary text. `IconStateGlyph` uses a bookmark for saving, a speaker for sound, and a check for completion; keep its meaning aligned with the action.

## Complete examples

These examples include their own demonstration content and state. Copy them and adapt the event handlers to your application.

```tsx
import { AdvancedExample, OpticalExample, OpticalProvider } from './components/optical-ui';

<OpticalProvider>
  <AdvancedExample name="selection-tray" />
  <OpticalExample name="context" />
</OpticalProvider>
```

**Signature examples:** `precision-fader`, `step-slider`, `timeline-wheel`, `glass-shutter`, `focus-lens`, `contact-sheet`, `selection-tray`, `collection-stack`, `version-rail`, `transform-pad`.

**Interaction patterns:** `optics`, `instrument`, `folio`, `contour`, `trace`, `field`, `context`, `interrupt`, `branch`, `intent`, `evidence`, `handoff`, `context-fan`, `branch-graph`.

For photo-based patterns, also copy `public/ui-examples/` into your app's public directory, or change the image paths in the source.

**Standalone HTML:** `public/material/pocket.html`, `spool.html`, `index.html`, and `press.html`. They need no React setup. For an iframe, add `?embedded=1` and give it an explicit width and height.
