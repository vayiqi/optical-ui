'use client';

import { motion, useReducedMotion } from 'motion/react';
import './icon-motion.css';

/** A steady outline, with only a small press response inside the hit area. */
export function IconButtonSurface({ pressed }: { pressed: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="opt-icon-surface"
      initial={false}
      animate={{ scale: pressed && !reduced ? 0.96 : 1 }}
      transition={{ duration: reduced ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    />
  );
}

/** Each symbol retains its meaning; animation only explains its state. */
export function IconStateGlyph({
  kind,
  active,
}: {
  kind: 'bookmark' | 'favorite' | 'sound' | 'add';
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const transition = {
    duration: reduced ? 0 : 0.2,
    ease: [0.16, 1, 0.3, 1] as const,
  };
  const filled = kind === 'bookmark' || kind === 'favorite';
  return (
    <svg
      className="opt-icon-state-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {filled && (
        <motion.path
          d={
            kind === 'bookmark'
              ? 'M6.5 3.5 H17.5 V20.5 L12 17 L6.5 20.5 Z'
              : 'M12 20 C9 17.5 3 13.2 3 8.8 C3 4.5 8.7 3.1 12 7 C15.3 3.1 21 4.5 21 8.8 C21 13.2 15 17.5 12 20 Z'
          }
          fill="currentColor"
          initial={false}
          animate={{ fillOpacity: active ? 1 : 0 }}
          transition={transition}
        />
      )}
      {kind === 'sound' && (
        <>
          <path d="M3 9 H6 L11 5 V19 L6 15 H3 Z" />
          <motion.path
            d="M16 8.5 C18 10.4 18 13.6 16 15.5"
            initial={false}
            animate={{ opacity: active ? 1 : 0, pathLength: active ? 1 : 0 }}
            transition={transition}
          />
          <motion.path
            d="M19 5.5 C22.7 9.1 22.7 14.9 19 18.5"
            initial={false}
            animate={{ opacity: active ? 1 : 0, pathLength: active ? 1 : 0 }}
            transition={transition}
          />
          <motion.path
            d="M16 10 L20 14 M20 10 L16 14"
            initial={false}
            animate={{ opacity: active ? 0 : 1 }}
            transition={transition}
          />
        </>
      )}
      {kind === 'add' && (
        <>
          <motion.path
            initial={false}
            animate={{
              d: active ? 'M5 12 C7 14 8 15 10 17' : 'M5 12 C9 12 15 12 19 12',
            }}
            transition={transition}
          />
          <motion.path
            initial={false}
            animate={{
              d: active
                ? 'M10 17 C13 13.5 16 10 20 6'
                : 'M12 5 C12 9 12 15 12 19',
            }}
            transition={transition}
          />
        </>
      )}
    </svg>
  );
}
