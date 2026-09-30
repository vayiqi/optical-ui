'use client';

import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (notify: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const reducedSnapshot = () => window.matchMedia(reducedQuery).matches;
const serverSnapshot = () => false;
/** Also responds when the OS preference changes while a specimen is open. */
export function useSelectionReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    reducedSnapshot,
    serverSnapshot,
  );
}

const leading = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.75,
};
const trailing = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 29,
  mass: 0.75,
};

/** A single line stays mounted through empty, mixed, and checked states. */
export function SelectionMark({ state }: { state: 'off' | 'mixed' | 'on' }) {
  const reduced = useSelectionReducedMotion();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="opt-selection-mark"
    >
      <motion.path
        initial={false}
        animate={{
          d:
            state === 'on'
              ? 'M5 12 L10 17 L19 7'
              : state === 'mixed'
                ? 'M5 12 L12 12 L19 12'
                : 'M12 12 L12 12 L12 12',
          opacity: state === 'off' ? 0 : 1,
        }}
        transition={{
          duration: reduced ? 0 : 0.24,
          ease: [0.22, 0.7, 0.18, 1],
        }}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The leading edge moves first; the same ceramic thumb stretches and settles. */
export function SwitchKnob({ checked }: { checked: boolean }) {
  const reduced = useSelectionReducedMotion();
  const left = useMotionValue(checked ? 24 : 0);
  const right = useMotionValue(checked ? 48 : 24);
  const width = useTransform(() => Math.max(24, right.get() - left.get()));
  useLayoutEffect(() => {
    const destination = checked ? 24 : 0;
    if (reduced) {
      left.jump(destination);
      right.jump(destination + 24);
    } else {
      animate(left, destination, checked ? trailing : leading);
      animate(right, destination + 24, checked ? leading : trailing);
    }
    return () => {
      left.stop();
      right.stop();
    };
  }, [checked, reduced, left, right]);
  return (
    <motion.span className="opt-switch-knob" style={{ x: left, width }}>
      <SelectionMark state={checked ? 'on' : 'off'} />
    </motion.span>
  );
}

/** Follows committed Base UI state, including uncontrolled values and form reset. */
export function RadioSelectionSurface() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useSelectionReducedMotion();
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const visible = useMotionValue(0);
  const height = useTransform(() => Math.max(0, bottom.get() - top.get()));
  useLayoutEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    let initialized = false;
    let previousTop = -1;
    let previousBottom = -1;
    const update = () => {
      const selected = root
        .querySelector<HTMLElement>('.opt-radio[data-checked]')
        ?.closest<HTMLElement>('.opt-radio-row');
      if (!selected) {
        visible.set(0);
        initialized = false;
        return;
      }
      // Offset coordinates remain correct inside the scaled gallery thumbnails.
      const nextTop = selected.offsetTop;
      const nextBottom = nextTop + selected.offsetHeight;
      if (
        initialized &&
        previousTop === nextTop &&
        previousBottom === nextBottom
      )
        return;
      if (reduced || !initialized) {
        top.jump(nextTop);
        bottom.jump(nextBottom);
      } else {
        const down =
          (nextTop + nextBottom) / 2 >= (top.get() + bottom.get()) / 2;
        animate(top, nextTop, down ? trailing : leading);
        animate(bottom, nextBottom, down ? leading : trailing);
      }
      previousTop = nextTop;
      previousBottom = nextBottom;
      visible.set(1);
      initialized = true;
      root.dataset.selectionReady = '';
    };
    update();
    const mutation = new MutationObserver(update);
    mutation.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-checked'],
      childList: true,
    });
    const resize = new ResizeObserver(update);
    resize.observe(root);
    root
      .querySelectorAll('.opt-radio-row')
      .forEach((row) => resize.observe(row));
    return () => {
      mutation.disconnect();
      resize.disconnect();
      top.stop();
      bottom.stop();
      delete root.dataset.selectionReady;
    };
  }, [reduced, top, bottom, visible]);
  return (
    <motion.span
      ref={ref}
      className="opt-radio-selection"
      aria-hidden="true"
      style={{ y: top, height, opacity: visible }}
    />
  );
}
