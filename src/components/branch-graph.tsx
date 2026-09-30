'use client';

import { animate, cancelFrame, frame, useMotionValue } from 'motion/react';
import { Check, FileText, GitBranch, Minus, RotateCcw } from 'lucide-react';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MotionSettingsContext } from './studies';
import './branch-graph.css';

const directions = [
  { name: 'Direct', quote: 'A quiet workspace for your next good idea.', note: 'Clear, grounded, to the point.' },
  { name: 'Playful', quote: 'A little room for your biggest what-if.', note: 'Warm, curious, open-ended.' },
];
type Layout = { width: number; compact: boolean; briefWidth: number; briefHeight: number; nodeWidth: number; heights: number[] };
const initialLayout: Layout = { width: 0, compact: false, briefWidth: 264, briefHeight: 80, nodeWidth: 248, heights: [248, 248] };

/** Two answer nodes retain a shared origin. No shared-image morphs or text scaling. */
export function BranchGraph({ report }: { report: (state: string) => void }) {
  const [comparing, setComparing] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [layout, setLayout] = useState(initialLayout);
  const scene = useRef<HTMLDivElement>(null);
  const brief = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const action = useRef<HTMLButtonElement>(null);
  const placed = useRef(false);
  const { tempo, reduced } = useContext(MotionSettingsContext);
  const x0 = useMotionValue(0), y0 = useMotionValue(0), x1 = useMotionValue(0), y1 = useMotionValue(0);
  const alpha0 = useMotionValue(1), alpha1 = useMotionValue(0), height = useMotionValue(380);
  const compact = layout.compact;
  const briefX = compact ? 28 : (layout.width - layout.briefWidth) / 2;

  useLayoutEffect(() => {
    if (!scene.current || !brief.current) return;
    const measure = () => {
      const root = scene.current!, origin = brief.current!;
      const next = {
        width: root.clientWidth,
        compact: getComputedStyle(root).getPropertyValue('--ng-compact').trim() === '1',
        briefWidth: origin.offsetWidth, briefHeight: origin.offsetHeight,
        nodeWidth: nodes.current[0]?.offsetWidth || 248,
        heights: nodes.current.map(node => node?.offsetHeight || 248),
      };
      setLayout(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene.current);
    observer.observe(brief.current);
    nodes.current.forEach(node => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Commit node transforms and SVG geometry together. Separate derived MotionValues
  // can trail by one frame when an interrupted animation changes direction.
  useLayoutEffect(() => {
    if (!layout.width) return;
    const draw = () => {
      if (scene.current) {
        scene.current.style.height = `${height.get()}px`;
        scene.current.style.visibility = placed.current ? 'visible' : 'hidden';
      }
      [[x0, y0, alpha0], [x1, y1, alpha1]].forEach(([mx, my, alpha], index) => {
        const node = nodes.current[index], path = paths.current[index];
        if (!node || !path) return;
        const x = mx.get(), y = my.get(), opacity = String(alpha.get());
        node.style.transform = `translate(${x}px, ${y}px)`;
        node.style.opacity = opacity;
        path.style.opacity = opacity;
        let d: string;
        if (compact) {
          const start = layout.briefHeight / 2, end = y + layout.heights[index] / 2;
          d = `M ${briefX} ${start} H 18 Q 6 ${start} 6 ${start + 12} V ${end - 12} Q 6 ${end} 18 ${end} H ${x}`;
        } else {
          const startX = briefX + layout.briefWidth / 2, endX = x + layout.nodeWidth / 2;
          const startY = layout.briefHeight, middle = startY + (y - startY) / 2;
          d = `M ${startX} ${startY} C ${startX} ${middle} ${endX} ${middle} ${endX} ${y}`;
        }
        path.setAttribute('d', d);
      });
    };
    const unsubscribe = [x0, y0, x1, y1, alpha0, alpha1, height].map(value => value.on('change', () => frame.render(draw)));
    draw();
    return () => { unsubscribe.forEach(stop => stop()); cancelFrame(draw); };
  }, [layout, compact, briefX, x0, y0, x1, y1, alpha0, alpha1, height]);

  useLayoutEffect(() => {
    if (!layout.width) return;
    const top = layout.briefHeight + (compact ? 32 : 56);
    const left = compact ? 28 : 0;
    const right = compact ? 28 : layout.width - layout.nodeWidth;
    const center = compact ? 28 : (layout.width - layout.nodeWidth) / 2;
    const secondY = compact ? top + layout.heights[0] + 24 : top;
    const show0 = comparing || chosen !== 1, show1 = comparing || chosen === 1;
    const targets = [
      { x: comparing ? left : chosen === 1 ? left : center, y: top, alpha: show0 ? 1 : 0 },
      { x: comparing ? right : chosen === 1 ? center : right, y: comparing ? secondY : top, alpha: show1 ? 1 : 0 },
    ];
    const endHeight = comparing && compact ? secondY + layout.heights[1] : top + Math.max(...layout.heights);
    const immediate = reduced || !placed.current;
    placed.current = true;
    const ease = [0.22, 1, 0.36, 1] as const;
    const travel = { type: 'tween' as const, duration: .32 * tempo, ease, delay: comparing ? 0 : .1 * tempo };
    const controls: ReturnType<typeof animate>[] = [];
    [[x0, y0, alpha0], [x1, y1, alpha1]].forEach(([x, y, alpha], index) => {
      const target = targets[index];
      if (immediate) { x.set(target.x); y.set(target.y); alpha.set(target.alpha); }
      else {
        controls.push(animate(x, target.x, travel), animate(y, target.y, travel));
        const entering = target.alpha > alpha.get();
        controls.push(animate(alpha, target.alpha, { duration: (entering ? .18 : .1) * tempo, ease, delay: entering && comparing ? .16 * tempo : 0 }));
      }
    });
    if (immediate) height.set(endHeight);
    else controls.push(animate(height, endHeight, travel));
    return () => controls.forEach(control => control.stop());
  }, [layout, compact, comparing, chosen, reduced, tempo, x0, y0, x1, y1, alpha0, alpha1, height]);

  const status = chosen !== null ? `${directions[chosen].name} kept` : comparing ? 'Two directions' : 'Original direction';
  useEffect(() => report(status), [status, report]);
  const keep = (index: number) => {
    action.current?.focus({ preventScroll: true });
    setChosen(index); setComparing(false);
  };

  return <section className="primitive-card node-graph" aria-label="Branch fold — Node graph" data-mode={chosen !== null ? `kept-${chosen}` : comparing ? 'comparing' : 'original'}>
    <div ref={scene} className="ng-scene" style={{ height: 380, visibility: 'hidden' }}>
      <svg className="ng-connections" aria-hidden="true">
        <path ref={element => { paths.current[0] = element; }} fill="none" stroke={chosen === 0 ? '#668371' : '#c3c7ce'} strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={chosen === 0 ? 'is-kept' : ''} />
        <path ref={element => { paths.current[1] = element; }} fill="none" stroke={chosen === 1 ? '#668371' : '#c3c7ce'} strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={chosen === 1 ? 'is-kept' : ''} />
      </svg>
      <div ref={brief} className="ng-brief" style={{ left: briefX }}>
        <span className="ng-brief-icon" aria-hidden="true"><FileText /></span>
        <div><span className="ng-eyebrow">Shared brief</span><h2>A workspace for ideas</h2></div>
        <span className="ng-port" aria-hidden="true" />
      </div>
      {directions.map((direction, index) => {
        const visible = comparing || (chosen ?? 0) === index;
        return <div key={direction.name} ref={element => { nodes.current[index] = element; }}
          className={`ng-node ${chosen === index ? 'is-kept' : ''}`}
          aria-hidden={!visible} inert={!visible}
          style={{ pointerEvents: visible ? 'auto' : 'none' }}>
          <span className="ng-port" aria-hidden="true" />
          <header className="ng-node-heading"><span>{direction.name}</span><span className="ng-index" aria-hidden="true">0{index + 1}</span></header>
          <p className="ng-quote">{direction.quote}</p>
          <p className="ng-note">{direction.note}</p>
          <footer className="ng-node-footer">
            <span className="ng-node-state" aria-hidden={comparing}>{chosen === index ? <><Check />Kept</> : index === 0 ? 'Original' : 'Alternative'}</span>
            <button type="button" className="ng-keep" aria-label={`Keep ${direction.name}`} tabIndex={comparing ? 0 : -1} aria-hidden={!comparing}
              style={{ visibility: comparing ? 'visible' : 'hidden' }} onClick={() => keep(index)}>Keep this<Check aria-hidden="true" /></button>
          </footer>
        </div>;
      })}
    </div>
    <footer className="ng-controls">
      <span className="ng-status">{status}</span>
      <button ref={action} type="button" className={`demo-button ${comparing || chosen !== null ? 'button-secondary' : 'button-primary'} ng-action`}
        aria-expanded={comparing} onClick={() => { if (chosen !== null) { setChosen(null); setComparing(true); } else setComparing(value => !value); }}>
        {chosen !== null ? <RotateCcw aria-hidden="true" /> : comparing ? <Minus aria-hidden="true" /> : <GitBranch aria-hidden="true" />}
        {chosen !== null ? 'Undo choice' : comparing ? 'Fold back' : 'Explore a branch'}
      </button>
    </footer>
  </section>;
}
