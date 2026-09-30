'use client';
import { RadioSelectionSurface, SelectionMark, SwitchKnob } from './selection-motion';
import { ConnectedActions, SteppingNumber } from './group-motion';
export { SteppingNumber } from './group-motion';
import { IconButtonSurface } from './icon-motion';
export { IconStateGlyph } from './icon-motion';
import { MorphLabel } from './action-motion';
export { ActionGlyph, MorphLabel } from './action-motion';
import './control-motion.css';
import './action-motion.css';
// Portable controls use explicit ARIA for custom material surfaces and initials fallbacks.
/* oxlint-disable jsx-a11y/prefer-tag-over-role, next/no-img-element */
import {
  useId,
  useState,
  type ReactNode,
  type ComponentProps,
  type CSSProperties,
} from 'react';
import { Switch as SwitchBase } from '@base-ui/react/switch';
import { Checkbox as CheckboxBase } from '@base-ui/react/checkbox';
import { Radio as RadioBase } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupBase } from '@base-ui/react/radio-group';
import { Slider as SliderBase } from '@base-ui/react/slider';
import { Tabs as TabsBase } from '@base-ui/react/tabs';
import { Accordion as AccordionBase } from '@base-ui/react/accordion';
import { Combobox as ComboboxBase } from '@base-ui/react/combobox';
import { NumberField as NumberBase } from '@base-ui/react/number-field';
import { Dialog as DialogBase } from '@base-ui/react/dialog';
import { Popover as PopoverBase } from '@base-ui/react/popover';
import { Tooltip as TooltipBase } from '@base-ui/react/tooltip';
import { Menu as MenuBase } from '@base-ui/react/menu';
import { Toast as ToastBase } from '@base-ui/react/toast';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { themeStyle, useOpticalTheme } from './theme';
import './optical-system.css';
import './selection-motion.css';
export * from './theme';
const cx = (...v: (string | undefined | false)[]) =>
  v.filter(Boolean).join(' ');
export function Button({
  children,
  variant = 'solid',
  pending = false,
  pendingLabel = 'Working',
  morphKey,
  complete = false,
  leadingIcon,
  className,
  ...props
}: ComponentProps<'button'> & {
  variant?: 'solid' | 'soft' | 'glass' | 'ghost';
  pending?: boolean;
  pendingLabel?: string;
  morphKey?: string | number;
  complete?: boolean;
  leadingIcon?: ReactNode;
}) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled}
      aria-disabled={pending || props['aria-disabled'] || undefined}
      onClick={(event) => {
        if (
          pending ||
          props['aria-disabled'] === true ||
          props['aria-disabled'] === 'true'
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        props.onClick?.(event);
      }}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
      data-morph={morphKey !== undefined || undefined}
      data-complete={complete || undefined}
      className={cx('opt-button', `opt-button-${variant}`, className)}
    >
      {leadingIcon}
      {morphKey !== undefined ? (
        <MorphLabel stateKey={pending ? '__pending' : morphKey}>
          {pending ? (
            <>
              {!leadingIcon && (
                <LoaderCircle className="opt-spin" aria-hidden="true" />
              )}
              {pendingLabel}
            </>
          ) : (
            children
          )}
        </MorphLabel>
      ) : (
        <span className="opt-button-content">
          <span className="opt-button-spinner" aria-hidden="true">
            <span>
              <LoaderCircle className={pending ? 'opt-spin' : ''} />
            </span>
          </span>
          {children}
        </span>
      )}
    </button>
  );
}
export function IconButton({
  label,
  children,
  feedback = false,
  morph = false,
  ...props
}: Omit<ComponentProps<typeof Button>, 'aria-label'> & {
  label: string;
  feedback?: boolean;
  /** Compatibility alias; prefer feedback for state feedback. */
  morph?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const animated = feedback || morph;
  const unavailable =
    props.disabled ||
    props.pending ||
    props['aria-disabled'] === true ||
    props['aria-disabled'] === 'true';
  return (
    <Button
      {...props}
      aria-label={label}
      data-fluid={animated || undefined}
      data-pressed={(animated && pressed) || undefined}
      onPointerLeave={(event) => {
        setPressed(false);
        props.onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        if (animated && !unavailable && event.button === 0) setPressed(true);
        props.onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setPressed(false);
        props.onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        setPressed(false);
        props.onPointerCancel?.(event);
      }}
      onKeyDown={(event) => {
        if (
          animated &&
          !unavailable &&
          (event.key === ' ' || event.key === 'Enter')
        )
          setPressed(true);
        props.onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        setPressed(false);
        props.onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setPressed(false);
        props.onBlur?.(event);
      }}
      className={cx('opt-icon-button', props.className)}
    >
      {animated && <IconButtonSurface pressed={pressed && !unavailable} />}
      {children}
    </Button>
  );
}
export function ButtonGroup(props: ComponentProps<typeof ConnectedActions>) {
  return <ConnectedActions {...props} />;
}
export function Switch({
  label,
  description,
  ...props
}: SwitchBase.Root.Props & { label: string; description?: string }) {
  const id = useId();
  return (
    <label className="opt-choice-row opt-choice-fluid">
      <span>
        <b>{label}</b>
        {description && <small id={id}>{description}</small>}
      </span>
      <SwitchBase.Root
        {...props}
        aria-describedby={
          [props['aria-describedby'], description ? id : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={(state) =>
          cx(
            'opt-switch opt-switch-fluid',
            typeof props.className === 'function'
              ? props.className(state)
              : props.className,
          )
        }
      >
        <SwitchBase.Thumb
          className="opt-switch-thumb"
          render={(thumbProps, state) => (
            <span {...thumbProps}>
              <SwitchKnob checked={state.checked} />
            </span>
          )}
        />
      </SwitchBase.Root>
    </label>
  );
}
export function Checkbox({
  label,
  description,
  ...props
}: CheckboxBase.Root.Props & { label: string; description?: string }) {
  const id = useId();
  return (
    <label className="opt-check-row opt-check-fluid">
      <CheckboxBase.Root
        {...props}
        aria-describedby={
          [props['aria-describedby'], description ? id : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={(state) =>
          cx(
            'opt-checkbox opt-checkbox-fluid',
            typeof props.className === 'function'
              ? props.className(state)
              : props.className,
          )
        }
      >
        <CheckboxBase.Indicator
          keepMounted
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>
              <SelectionMark
                state={
                  state.indeterminate ? 'mixed' : state.checked ? 'on' : 'off'
                }
              />
            </span>
          )}
        />
      </CheckboxBase.Root>
      <span>
        <b>{label}</b>
        {description && <small id={id}>{description}</small>}
      </span>
    </label>
  );
}
export type Choice = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
export function RadioGroup({
  label,
  options,
  ...props
}: RadioGroupBase.Props & { label: string; options: Choice[] }) {
  return (
    <RadioGroupBase
      {...props}
      aria-label={label}
      className={(state) =>
        cx(
          'opt-radio-group opt-radio-fluid',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className,
        )
      }
    >
      <RadioSelectionSurface />
      {options.map((o) => (
        <label key={o.value} className="opt-radio-row">
          <RadioBase.Root
            value={o.value}
            disabled={o.disabled}
            className="opt-radio"
          >
            <RadioBase.Indicator keepMounted className="opt-radio-dot" />
          </RadioBase.Root>
          <span>
            <b>{o.label}</b>
            {o.description && <small>{o.description}</small>}
          </span>
        </label>
      ))}
    </RadioGroupBase>
  );
}
export function Slider({
  label,
  unit = '',
  ...props
}: SliderBase.Root.Props & { label: string; unit?: string }) {
  const [pointerFocus, setPointerFocus] = useState(false);
  return (
    <SliderBase.Root
      {...props}
      data-pointer-focus={pointerFocus || undefined}
      onPointerDownCapture={(event) => {
        setPointerFocus(true);
        props.onPointerDownCapture?.(event);
      }}
      onKeyDownCapture={(event) => {
        setPointerFocus(false);
        props.onKeyDownCapture?.(event);
      }}
      onBlurCapture={(event) => {
        setPointerFocus(false);
        props.onBlurCapture?.(event);
      }}
      className={(state) =>
        cx(
          'opt-slider opt-slider-fluid',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className,
        )
      }
    >
      <div className="opt-control-label">
        <SliderBase.Label>{label}</SliderBase.Label>
        <SliderBase.Value className="opt-slider-value">
          {(formatted, values) => (
            <>
              {values.length === 1 && !props.format && !props.locale ? (
                <SteppingNumber
                  value={values[0]}
                  digits={
                    String(
                      Math.max(
                        Math.abs(props.min ?? 0),
                        Math.abs(props.max ?? 100),
                      ),
                    ).length
                  }
                  duration={0.18}
                  align="end"
                />
              ) : (
                formatted.join(' – ')
              )}
              {unit && <span className="opt-slider-unit">{unit}</span>}
            </>
          )}
        </SliderBase.Value>
      </div>
      <SliderBase.Control className="opt-slider-control">
        <SliderBase.Track className="opt-slider-track">
          <SliderBase.Indicator className="opt-slider-fill" />
        </SliderBase.Track>
        <SliderBase.Thumb className="opt-slider-thumb" aria-label={label} />
      </SliderBase.Control>
    </SliderBase.Root>
  );
}
export function RangeSlider({
  label,
  ...props
}: SliderBase.Root.Props & { label: string }) {
  return (
    <SliderBase.Root defaultValue={[25, 75]} {...props} className="opt-slider">
      <div className="opt-control-label">
        <SliderBase.Label>{label}</SliderBase.Label>
        <SliderBase.Value />
      </div>
      <SliderBase.Control className="opt-slider-control">
        <SliderBase.Track className="opt-slider-track">
          <SliderBase.Indicator className="opt-slider-fill" />
        </SliderBase.Track>
        {[0, 1].map((i) => (
          <SliderBase.Thumb
            key={i}
            index={i}
            className="opt-slider-thumb"
            aria-label={`${label} ${i ? 'maximum' : 'minimum'}`}
          />
        ))}
      </SliderBase.Control>
    </SliderBase.Root>
  );
}
type FieldProps = { label: string; description?: string; error?: string };
export function TextField({
  label,
  description,
  error,
  id: provided,
  ...props
}: ComponentProps<'input'> & FieldProps) {
  const uid = useId(),
    id = provided || uid;
  return (
    <div className="opt-field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        className={cx('opt-input', props.className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error || description ? `${id}-hint` : undefined}
      />
      {(error || description) && (
        <small id={`${id}-hint`} className={error ? 'opt-error' : ''}>
          {error || description}
        </small>
      )}
    </div>
  );
}
export function TextArea({
  label,
  description,
  error,
  id: provided,
  ...props
}: ComponentProps<'textarea'> & FieldProps) {
  const uid = useId(),
    id = provided || uid;
  return (
    <div className="opt-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        rows={4}
        {...props}
        id={id}
        className={cx('opt-input opt-textarea', props.className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error || description ? `${id}-hint` : undefined}
      />
      {(error || description) && (
        <small id={`${id}-hint`}>{error || description}</small>
      )}
    </div>
  );
}
export function Select({
  label,
  options,
  id: provided,
  ...props
}: ComponentProps<'select'> & { label: string; options: Choice[] }) {
  const uid = useId(),
    id = provided || uid;
  return (
    <div className="opt-field">
      <label htmlFor={id}>{label}</label>
      <div className="opt-select-shell">
        <select {...props} id={id} className="opt-input">
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
    </div>
  );
}
export function Combobox({
  label,
  items,
  value,
  onValueChange,
  placeholder = 'Find an option',
}: {
  label: string;
  items: string[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
}) {
  const inputId = useId();
  const style = themeStyle(useOpticalTheme());
  return (
    <ComboboxBase.Root
      items={items}
      value={value}
      onValueChange={onValueChange}
    >
      <div className="opt-field">
        <label htmlFor={inputId}>{label}</label>
        <div className="opt-combo-input">
          <Search />
          <ComboboxBase.Input
            id={inputId}
            aria-label={label}
            placeholder={placeholder}
            className="opt-input"
          />
          <ComboboxBase.Trigger aria-label="Show options">
            <ChevronDown />
          </ComboboxBase.Trigger>
        </div>
        <ComboboxBase.Portal>
          <ComboboxBase.Positioner sideOffset={8} className="opt-positioner">
            <ComboboxBase.Popup className="opt-system opt-popup" style={style}>
              <ComboboxBase.Empty className="opt-empty">
                No matching options.
              </ComboboxBase.Empty>
              <ComboboxBase.List>
                {(item: string) => (
                  <ComboboxBase.Item
                    key={item}
                    value={item}
                    className="opt-menu-item"
                  >
                    <ComboboxBase.ItemIndicator>
                      <Check />
                    </ComboboxBase.ItemIndicator>
                    {item}
                  </ComboboxBase.Item>
                )}
              </ComboboxBase.List>
            </ComboboxBase.Popup>
          </ComboboxBase.Positioner>
        </ComboboxBase.Portal>
      </div>
    </ComboboxBase.Root>
  );
}
export function NumberField({
  label,
  ...props
}: NumberBase.Root.Props & { label: string }) {
  const id = useId();
  return (
    <NumberBase.Root {...props} id={id} className="opt-field">
      <label htmlFor={id}>{label}</label>
      <NumberBase.Group className="opt-number">
        <NumberBase.Decrement aria-label={`Decrease ${label}`}>
          <Minus />
        </NumberBase.Decrement>
        <NumberBase.Input />
        <NumberBase.Increment aria-label={`Increase ${label}`}>
          <Plus />
        </NumberBase.Increment>
      </NumberBase.Group>
    </NumberBase.Root>
  );
}
export function SearchField({
  label = 'Search',
  value,
  onValueChange,
  placeholder = 'Search…',
}: {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="opt-field">
      <label htmlFor={id}>{label}</label>
      <div className="opt-search">
        <Search />
        <input
          type="search"
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => onValueChange('')}
          >
            <X />
          </button>
        )}
      </div>
    </div>
  );
}
export function Tabs({
  items,
  ...props
}: TabsBase.Root.Props & {
  items: { value: string; label: string; content: ReactNode }[];
}) {
  return (
    <TabsBase.Root
      defaultValue={items[0]?.value}
      {...props}
      className="opt-tabs"
    >
      <TabsBase.List className="opt-tab-list">
        {items.map((o) => (
          <TabsBase.Tab key={o.value} value={o.value} className="opt-tab">
            {o.label}
          </TabsBase.Tab>
        ))}
        <TabsBase.Indicator className="opt-tab-indicator" />
      </TabsBase.List>
      {items.map((o) => (
        <TabsBase.Panel key={o.value} value={o.value} className="opt-tab-panel">
          {o.content}
        </TabsBase.Panel>
      ))}
    </TabsBase.Root>
  );
}
export function SegmentedControl({
  label,
  options,
  ...props
}: RadioGroupBase.Props & { label: string; options: Choice[] }) {
  return (
    <RadioGroupBase {...props} aria-label={label} className="opt-segment">
      {options.map((o) => (
        <RadioBase.Root
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className="opt-segment-item"
        >
          {o.label}
        </RadioBase.Root>
      ))}
    </RadioGroupBase>
  );
}
export function Accordion({
  items,
  ...props
}: AccordionBase.Root.Props & {
  items: { value: string; title: string; content: ReactNode }[];
}) {
  return (
    <AccordionBase.Root {...props} className="opt-accordion">
      {items.map((o) => (
        <AccordionBase.Item
          key={o.value}
          value={o.value}
          className="opt-accordion-item"
        >
          <AccordionBase.Header>
            <AccordionBase.Trigger className="opt-accordion-trigger">
              {o.title}
              <Plus />
            </AccordionBase.Trigger>
          </AccordionBase.Header>
          <AccordionBase.Panel className="opt-accordion-panel">
            <div>{o.content}</div>
          </AccordionBase.Panel>
        </AccordionBase.Item>
      ))}
    </AccordionBase.Root>
  );
}
export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
}: {
  items: { label: string; href?: string }[];
  label?: string;
}) {
  return (
    <nav aria-label={label} className="opt-breadcrumbs">
      <ol>
        {items.map((o, i) => (
          <li key={`${o.label}-${i}`}>
            {i > 0 && <ChevronRight />}
            {i === items.length - 1 ? (
              <span aria-current="page">{o.label}</span>
            ) : (
              <a href={o.href || '#'}>{o.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Pagination({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (n: number) => void;
}) {
  const pages = Array.from(
    { length: Math.max(1, total) },
    (_, i) => i + 1,
  ).filter((n) => n === 1 || n === total || Math.abs(n - page) < 2);
  return (
    <nav className="opt-pagination" aria-label="Pagination">
      <IconButton
        label="Previous page"
        variant="soft"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeft />
      </IconButton>
      {pages.map((n, i) => (
        <span key={n}>
          {i > 0 && n - pages[i - 1] > 1 && (
            <span className="opt-ellipsis">…</span>
          )}
          <button
            type="button"
            aria-label={`Page ${n}`}
            aria-current={page === n ? 'page' : undefined}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        </span>
      ))}
      <IconButton
        label="Next page"
        variant="soft"
        disabled={page >= total}
        onClick={() => onPageChange(page + 1)}
      >
        <ArrowRight />
      </IconButton>
    </nav>
  );
}
export function DataTable({
  columns,
  rows,
  caption = 'Items',
}: {
  columns: { key: string; label: string }[];
  rows: Record<string, string | number>[];
  caption?: string;
}) {
  const [sort, setSort] = useState({
    key: columns[0]?.key || '',
    ascending: true,
  });
  const ordered = [...rows].sort((a, b) => {
    const x = a[sort.key],
      y = b[sort.key];
    return (
      (typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x ?? '').localeCompare(String(y ?? ''))) *
      (sort.ascending ? 1 : -1)
    );
  });
  return (
    <div className="opt-table-wrap">
      <table className="opt-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                aria-sort={
                  sort.key === c.key
                    ? sort.ascending
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setSort({
                      key: c.key,
                      ascending: sort.key === c.key ? !sort.ascending : true,
                    })
                  }
                >
                  {c.label}
                  <ChevronDown
                    style={{
                      transform:
                        sort.key === c.key && !sort.ascending
                          ? 'rotate(180deg)'
                          : undefined,
                    }}
                  />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordered.map((r, i) => (
            <tr key={String(r.id ?? i)}>
              {columns.map((c) => (
                <td key={c.key}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Alert({
  title,
  children,
  onDismiss,
  action,
}: {
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="opt-alert" role="status">
      <span className="opt-status-dot" />
      <div>
        <strong>{title}</strong>
        {children && <p>{children}</p>}
        {action}
      </div>
      {onDismiss && (
        <IconButton label="Dismiss notice" variant="ghost" onClick={onDismiss}>
          <X />
        </IconButton>
      )}
    </div>
  );
}
export function Progress({
  value,
  label = 'Progress',
}: {
  value: number;
  label?: string;
}) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="opt-progress">
      <div className="opt-control-label">
        <span>{label}</span>
        <output>{Math.round(v)}%</output>
      </div>
      <div
        className="opt-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
      >
        <span style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
export function Skeleton({
  className,
  style,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx('opt-skeleton', className)}
      style={style}
    />
  );
}
export function Badge({
  children,
  tone = 'accent',
  onRemove,
}: {
  children: ReactNode;
  tone?: 'accent' | 'neutral' | 'success';
  onRemove?: () => void;
}) {
  return (
    <span className={`opt-badge opt-badge-${tone}`}>
      <i />
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${typeof children === 'string' ? children : 'badge'}`}
          onClick={onRemove}
        >
          <X />
        </button>
      )}
    </span>
  );
}
export function Avatar({
  name,
  src,
  size = 48,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="opt-avatar"
      role="img"
      aria-label={name}
      style={{ '--avatar-size': `${size}px` } as CSSProperties}
    >
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        name
          .split(' ')
          .slice(0, 2)
          .map((s) => s[0])
          .join('')
      )}
      <i />
    </span>
  );
}
export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: ReactNode;
}) {
  const style = themeStyle(useOpticalTheme());
  return (
    <TooltipBase.Provider delay={350}>
      <TooltipBase.Root>
        <TooltipBase.Trigger
          render={
            <button
              type="button"
              className="opt-tooltip-anchor"
              aria-label={
                typeof content === 'string' ? content : 'More information'
              }
            />
          }
        >
          {children}
        </TooltipBase.Trigger>
        <TooltipBase.Portal>
          <TooltipBase.Positioner sideOffset={9} className="opt-positioner">
            <TooltipBase.Popup className="opt-system opt-tooltip" style={style}>
              {content}
              <TooltipBase.Arrow className="opt-tooltip-arrow" />
            </TooltipBase.Popup>
          </TooltipBase.Positioner>
        </TooltipBase.Portal>
      </TooltipBase.Root>
    </TooltipBase.Provider>
  );
}
export function Popover({
  trigger,
  title,
  children,
}: {
  trigger: string;
  title: string;
  children: ReactNode;
}) {
  const style = themeStyle(useOpticalTheme());
  return (
    <PopoverBase.Root>
      <PopoverBase.Trigger className="opt-button opt-button-glass">
        {trigger}
        <ChevronDown />
      </PopoverBase.Trigger>
      <PopoverBase.Portal>
        <PopoverBase.Positioner sideOffset={10} className="opt-positioner">
          <PopoverBase.Popup
            className="opt-system opt-popup opt-popover"
            style={style}
          >
            <PopoverBase.Title>{title}</PopoverBase.Title>
            <PopoverBase.Description render={<div />}>
              {children}
            </PopoverBase.Description>
            <PopoverBase.Close
              className="opt-popup-close"
              aria-label="Close popover"
            >
              <X />
            </PopoverBase.Close>
          </PopoverBase.Popup>
        </PopoverBase.Positioner>
      </PopoverBase.Portal>
    </PopoverBase.Root>
  );
}
type DialogProps = {
  trigger: string;
  title: string;
  description: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
function Modal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  drawer = false,
}: DialogProps & { drawer?: boolean }) {
  const style = themeStyle(useOpticalTheme());
  return (
    <DialogBase.Root open={open} onOpenChange={onOpenChange}>
      <DialogBase.Trigger className="opt-button opt-button-solid">
        {trigger}
        <ArrowRight />
      </DialogBase.Trigger>
      <DialogBase.Portal>
        <DialogBase.Backdrop className="opt-backdrop" />
        <DialogBase.Popup
          className={cx('opt-system opt-modal', drawer && 'opt-drawer')}
          style={style}
        >
          <div className="opt-modal-handle" />
          <DialogBase.Title>{title}</DialogBase.Title>
          <DialogBase.Description>{description}</DialogBase.Description>
          {children}
          <DialogBase.Close
            className="opt-popup-close"
            aria-label="Close dialog"
          >
            <X />
          </DialogBase.Close>
        </DialogBase.Popup>
      </DialogBase.Portal>
    </DialogBase.Root>
  );
}
export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}
export function Drawer(props: DialogProps) {
  return <Modal {...props} drawer />;
}
export function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; disabled?: boolean; onClick: () => void }[];
}) {
  const style = themeStyle(useOpticalTheme());
  return (
    <MenuBase.Root>
      <MenuBase.Trigger className="opt-button opt-button-glass">
        {label}
        <ChevronDown />
      </MenuBase.Trigger>
      <MenuBase.Portal>
        <MenuBase.Positioner sideOffset={9} className="opt-positioner">
          <MenuBase.Popup className="opt-system opt-popup" style={style}>
            {items.map((o) => (
              <MenuBase.Item
                key={o.label}
                disabled={o.disabled}
                onClick={o.onClick}
                className="opt-menu-item"
              >
                {o.label}
                <ArrowRight />
              </MenuBase.Item>
            ))}
          </MenuBase.Popup>
        </MenuBase.Positioner>
      </MenuBase.Portal>
    </MenuBase.Root>
  );
}
export function CommandMenu({
  commands,
}: {
  commands: { label: string; run: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      trigger="Find a command"
      title="Jump to something."
      description="Search, use the arrow keys, and press Enter."
      open={open}
      onOpenChange={setOpen}
    >
      <Combobox
        label="Command"
        items={commands.map((c) => c.label)}
        placeholder="Type an action…"
        onValueChange={(value) => {
          const c = commands.find((c) => c.label === value);
          if (c) {
            c.run();
            setOpen(false);
          }
        }}
      />
    </Dialog>
  );
}
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastBase.Provider timeout={6000}>
      <>
        {children}
        <ToastViewport />
      </>
    </ToastBase.Provider>
  );
}
function ToastViewport() {
  const { toasts } = ToastBase.useToastManager();
  const style = themeStyle(useOpticalTheme());
  return (
    <ToastBase.Portal>
      <ToastBase.Viewport className="opt-toast-viewport">
        {toasts.map((toast) => (
          <ToastBase.Root
            key={toast.id}
            toast={toast}
            className="opt-system opt-toast"
            style={style}
          >
            <ToastBase.Content>
              <ToastBase.Title />
              <ToastBase.Description />
            </ToastBase.Content>
            <ToastBase.Close
              className="opt-popup-close"
              aria-label="Dismiss notification"
            >
              <X />
            </ToastBase.Close>
          </ToastBase.Root>
        ))}
      </ToastBase.Viewport>
    </ToastBase.Portal>
  );
}
export const useToast = ToastBase.useToastManager;
