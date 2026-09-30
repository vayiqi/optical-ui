'use client';
import {
  createContext,
  useContext,
  useSyncExternalStore,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
export type OpticalTheme = { hue: number; saturation: number; radius: number };
export const defaultTheme: OpticalTheme = {
  hue: 18,
  saturation: 63,
  radius: 20,
};
export const themePresets = [
  { name: 'Terracotta', hue: 18, saturation: 63 },
  { name: 'Cobalt', hue: 225, saturation: 66 },
  { name: 'Moss', hue: 92, saturation: 37 },
  { name: 'Plum', hue: 285, saturation: 34 },
  { name: 'Graphite', hue: 210, saturation: 8 },
];
export function normalizeTheme(value: Partial<OpticalTheme>): OpticalTheme {
  const bound = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v)
      ? Math.round(Math.min(max, Math.max(min, v)))
      : fallback;
  return {
    hue: bound(value.hue, 0, 360, 18),
    saturation: bound(value.saturation, 0, 90, 63),
    radius: bound(value.radius, 2, 24, defaultTheme.radius),
  };
}
// One specimen palette also travels with portalled controls and CSS exports.
// Use one light-paper palette, independent of OS mode.
export const opticalPalette = {
  '--opt-paper': 'color-mix(in oklab,var(--opt-accent) 3%,#fbfaf6)',
  '--opt-raised': 'color-mix(in oklab,var(--opt-accent) 1%,#fffefa)',
  '--opt-ink': 'color-mix(in oklab,var(--opt-accent) 6%,#30332e)',
  '--opt-muted': 'color-mix(in oklab,var(--opt-accent) 6%,#60665d)',
  '--opt-line': 'color-mix(in oklab,var(--opt-accent) 14%,#e5e5dc)',
  '--opt-wash': 'color-mix(in oklab,var(--opt-accent) 9%,#f7f7ef)',
  '--opt-hover': 'color-mix(in oklab,var(--opt-accent) 16%,#f7f7ef)',
  '--opt-accent-hover': 'color-mix(in oklab,var(--opt-accent) 88%,#000)',
  '--opt-on-accent': '#fffdf5',
} as const;
export function themeStyle(value: OpticalTheme = defaultTheme): CSSProperties {
  const t = normalizeTheme(value);
  return {
    '--opt-hue': t.hue,
    '--opt-saturation': `${t.saturation}%`,
    '--opt-accent': `hsl(${t.hue} ${t.saturation}% 24%)`,
    '--opt-bright': `hsl(${t.hue} ${t.saturation}% 57%)`,
    '--opt-radius': `${t.radius}px`,
    ...opticalPalette,
    colorScheme: 'light',
  } as CSSProperties;
}
export function themeCSS(value: OpticalTheme) {
  const declarations = Object.entries(themeStyle(value))
    .map(([name, value]) => `  ${name === 'colorScheme' ? 'color-scheme' : name}: ${value};`)
    .join('\n');
  return `/* Optical UI — shared light material palette */\n:root, .opt-system {\n${declarations}\n}\n`;
}
const ThemeContext = createContext<OpticalTheme | undefined>(undefined);
export const useOpticalTheme = () => useContext(ThemeContext);
export function OpticalProvider({
  theme,
  children,
  className = '',
}: {
  theme?: OpticalTheme;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={`opt-system ${className}`} style={themeStyle(theme)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

const themeEvent = 'optical-theme-change';
let memorySnapshot: string | null = null;
function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(themeEvent, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(themeEvent, callback);
  };
}
function readTheme() {
  try {
    return localStorage.getItem('optical-theme') || memorySnapshot;
  } catch {
    return memorySnapshot;
  }
}
export function useStoredOpticalTheme(): [
  OpticalTheme,
  (theme: OpticalTheme) => void,
] {
  const snapshot = useSyncExternalStore(subscribeTheme, readTheme, () => null);
  const theme = useMemo(() => {
    try {
      return snapshot ? normalizeTheme(JSON.parse(snapshot)) : defaultTheme;
    } catch {
      return defaultTheme;
    }
  }, [snapshot]);
  const update = (value: OpticalTheme) => {
    memorySnapshot = JSON.stringify(normalizeTheme(value));
    try {
      localStorage.setItem('optical-theme', memorySnapshot);
    } catch {}
    window.dispatchEvent(new Event(themeEvent));
  };
  return [theme, update];
}
