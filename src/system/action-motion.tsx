'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from 'motion/react';
import './action-motion.css';

function LabelLayer({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="opt-morph-label-layer"
      aria-hidden={!present || undefined}
      initial={{
        opacity: 0,
        y: reduced ? 0 : 5,
        filter: reduced ? 'none' : 'blur(2px)',
      }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{
        opacity: 0,
        y: reduced ? 0 : -4,
        filter: reduced ? 'none' : 'blur(2px)',
      }}
      transition={{ duration: reduced ? 0 : 0.16 }}
    >
      {children}
    </motion.span>
  );
}

/** Animate intrinsic label size without scaling text or replacing the button. */
export function MorphLabel({
  children,
  stateKey,
}: {
  children: ReactNode;
  stateKey: string | number;
}) {
  const measure = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const element = measure.current;
    if (!element) return;
    const read = () => {
      const next = { width: element.offsetWidth, height: element.offsetHeight };
      setSize((previous) =>
        previous?.width === next.width && previous.height === next.height
          ? previous
          : next,
      );
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <motion.span
      className="opt-morph-label"
      initial={false}
      animate={size || { width: 'auto', height: 'auto' }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 480, damping: 36, mass: 0.8 }
      }
    >
      <span
        ref={measure}
        className="opt-morph-label-measure"
        aria-hidden="true"
      >
        {children}
      </span>
      <AnimatePresence initial={false}>
        <LabelLayer key={stateKey}>{children}</LabelLayer>
      </AnimatePresence>
    </motion.span>
  );
}

type Mark = 'plus' | 'minus' | 'check' | 'arrow' | 'close';
const strokes: Record<Mark, [string, string]> = {
  plus: ['M5 12 L12 12 L19 12', 'M12 5 L12 12 L12 19'],
  minus: ['M5 12 L12 12 L19 12', 'M12 12 L12 12 L12 12'],
  check: ['M5 12 L10 17 L19 7', 'M19 7 L19 7 L19 7'],
  arrow: ['M4 12 L12 12 L20 12', 'M13 5 L20 12 L13 19'],
  close: ['M6 6 L12 12 L18 18', 'M6 18 L12 12 L18 6'],
};
export function MorphGlyph({ state }: { state: Mark }) {
  const reduced = useReducedMotion();
  return (
    <svg
      className="opt-morph-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {strokes[state].map((d, i) => (
        <motion.path
          key={i}
          initial={false}
          animate={{ d }}
          transition={{
            duration: reduced ? 0 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}

/** Same two polygons, reshaped from a triangle into pause bars. */
export function PlaybackGlyph({ playing }: { playing: boolean }) {
  const reduced = useReducedMotion();
  const paths = playing
    ? ['M6 4 L10 4 L10 20 L6 20 Z', 'M14 4 L18 4 L18 20 L14 20 Z']
    : ['M6 3 L12 6.6 L12 17.4 L6 21 Z', 'M12 6.6 L21 12 L21 12 L12 17.4 Z'];
  return (
    <svg
      className="opt-morph-glyph"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          initial={false}
          animate={{ d }}
          transition={{
            duration: reduced ? 0 : 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}

/** A persistent path changes from arrow to working arc to confirmation. */
export function ActionGlyph({
  state,
}: {
  state: 'ready' | 'working' | 'complete';
}) {
  const reduced = useReducedMotion();
  const paths = {
    ready: [
      'M5 12 C8 12 12 12 19 12',
      'M13 6 C15 8 17 10 19 12 C17 14 15 16 13 18',
    ],
    working: [
      'M12 4 C16.4 4 20 7.6 20 12',
      'M20 12 C20 16.4 16.4 20 12 20 C7.6 20 4 16.4 4 12',
    ],
    complete: [
      'M5 12 C7 14 8 15 10 17',
      'M10 17 C12 14.8 15 11.3 19 7 C19 7 19 7 19 7',
    ],
  };
  return (
    <svg
      className="opt-action-glyph"
      data-state={state}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[state].map((d, i) => (
        <motion.path
          key={i}
          initial={false}
          animate={{ d }}
          transition={{ duration: reduced ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}
