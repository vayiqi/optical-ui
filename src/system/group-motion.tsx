'use client';
// Keep the existing div-based ButtonGroup API with native button tab stops.
/* oxlint-disable jsx-a11y/prefer-tag-over-role */

import {
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { numeralPaths } from './numeral-paths';
import { useSelectionReducedMotion } from './selection-motion';
import './group-motion.css';

const available = (button: HTMLButtonElement | null) =>
  button &&
  !button.disabled &&
  button.getAttribute('aria-disabled') !== 'true' &&
  !button.hasAttribute('data-disabled');

/** One transient surface follows intent; it never implies a selected action. */
export function ConnectedActions({
  label,
  children,
  className = '',
  ref: forwardedRef,
  ...props
}: ComponentProps<'div'> & { label: string }) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => root.current!, []);
  const target = useRef<HTMLButtonElement | null>(null);
  const pointer = useRef<HTMLButtonElement | null>(null);
  const focused = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const [surface, setSurface] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const show = useCallback((button: HTMLButtonElement | null) => {
    target.current = button;
    const container = root.current;
    if (!container || !available(button) || !button) {
      setSurface((previous) =>
        previous.visible ? { ...previous, visible: false } : previous,
      );
      return;
    }
    const bounds = container.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    const next = {
      x: box.left - bounds.left - container.clientLeft + container.scrollLeft,
      y: box.top - bounds.top - container.clientTop + container.scrollTop,
      width: box.width,
      height: box.height,
      visible: true,
    };
    setSurface((previous) =>
      previous.visible &&
      previous.x === next.x &&
      previous.y === next.y &&
      previous.width === next.width &&
      previous.height === next.height
        ? previous
        : next,
    );
  }, []);
  const buttonAt = (element: EventTarget | null) => {
    const button =
      element instanceof Element ? element.closest('button') : null;
    return button && button.parentElement === root.current ? button : null;
  };
  useLayoutEffect(() => {
    const container = root.current;
    if (!container) return;
    const observer = new ResizeObserver(() => show(target.current));
    observer.observe(container);
    container
      .querySelectorAll('button')
      .forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [show]);
  // Refresh after child state changes, including an action reaching a limit.
  useLayoutEffect(() => {
    show(target.current);
  }, [children, show]);
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const surfaceWidth = useTransform(() =>
    Math.max(1, right.get() - left.get()),
  );
  const wasVisible = useRef(false);
  useLayoutEffect(() => {
    if (!surface.visible) {
      wasVisible.current = false;
      return;
    }
    const end = surface.x + surface.width;
    if (reduced || !wasVisible.current) {
      left.jump(surface.x);
      right.jump(end);
    } else {
      const movingRight =
        surface.x + surface.width / 2 >= (left.get() + right.get()) / 2;
      const leading = {
        type: 'spring' as const,
        stiffness: 420,
        damping: 34,
        mass: 0.75,
      };
      const trailing = {
        type: 'spring' as const,
        stiffness: 180,
        damping: 24,
        mass: 0.75,
      };
      // The leading edge arrives first; the trailing edge follows without a shape swap.
      animate(left, surface.x, movingRight ? trailing : leading);
      animate(right, end, movingRight ? leading : trailing);
    }
    wasVisible.current = true;
  }, [surface.x, surface.width, surface.visible, reduced, left, right]);
  useLayoutEffect(
    () => () => {
      left.stop();
      right.stop();
    },
    [left, right],
  );
  return (
    // Native buttons keep their own tab stops; this is not a selection tablist.
    <div
      {...props}
      ref={root}
      role="group"
      aria-label={label}
      className={`opt-button-group opt-connected-actions ${className}`}
      onPointerOver={(event) => {
        if (event.pointerType !== 'touch') {
          const button = buttonAt(event.target);
          // Keep continuity while the pointer crosses the small gaps inside the group.
          if (button && button !== pointer.current) {
            pointer.current = button;
            show(button);
          }
        }
        props.onPointerOver?.(event);
      }}
      onPointerLeave={(event) => {
        pointer.current = null;
        show(
          focused.current?.matches(':focus-visible') ? focused.current : null,
        );
        props.onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        if (event.button === 0) show(buttonAt(event.target));
        props.onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        if (event.pointerType === 'touch') show(null);
        props.onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        pointer.current = null;
        show(null);
        props.onPointerCancel?.(event);
      }}
      onFocusCapture={(event) => {
        focused.current = buttonAt(event.target);
        if (focused.current?.matches(':focus-visible')) show(focused.current);
        props.onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        focused.current = null;
        if (!root.current?.contains(event.relatedTarget)) show(pointer.current);
        props.onBlurCapture?.(event);
      }}
    >
      <motion.span
        aria-hidden="true"
        className="opt-group-surface"
        initial={false}
        style={{
          x: left,
          y: surface.y,
          width: surfaceWidth,
          height: surface.height,
        }}
        animate={{ opacity: surface.visible ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.14 }}
      />
      {children}
    </div>
  );
}

/** Persistent font outlines reshape per place value; no sliding or crossfade. */
export function SteppingNumber({
  value,
  digits = 2,
  duration = 0.42,
  align = 'center',
}: {
  value: number;
  /** Retained for source compatibility; outline morphing does not need a direction. */
  direction?: 1 | -1;
  digits?: number;
  /** Shorter retargeting for continuous controls such as sliders. */
  duration?: number;
  align?: 'center' | 'end';
}) {
  const reduced = useSelectionReducedMotion();
  const text = String(value);
  const supported = Number.isSafeInteger(value) && value >= 0;
  const places = Math.max(1, Math.ceil(digits), text.length);
  const chars = text.padStart(places, ' ').split('');
  const leadingBlanks = places - text.length;
  const transition = {
    duration: reduced ? 0 : duration,
    ease: [0.22, 0.7, 0.18, 1] as const,
  };
  return (
    <span
      className="opt-stepping-number"
      style={{ '--opt-number-digits': places } as CSSProperties}
    >
      <span className="opt-group-sr-only">{value}</span>
      {supported ? (
        <svg
          className="opt-number-shapes"
          viewBox={`0 0 ${places * 64} 100`}
          aria-hidden="true"
          fill="currentColor"
          fillRule="evenodd"
        >
          {chars.map((char, index) => (
            <motion.g
              key={places - index - 1}
              data-place={places - index - 1}
              initial={false}
              animate={{
                x:
                  char === ' ' || align === 'end'
                    ? index * 64
                    : leadingBlanks * 32 + (index - leadingBlanks) * 64,
              }}
              transition={transition}
            >
              <motion.path
                data-digit={char}
                initial={false}
                animate={{ d: numeralPaths[char] }}
                transition={transition}
              />
            </motion.g>
          ))}
        </svg>
      ) : (
        <span aria-hidden="true">{text}</span>
      )}
    </span>
  );
}
