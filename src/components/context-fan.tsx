'use client';

import { motion } from 'motion/react';
import { Check, ChevronDown, FileText, MapPin, Paperclip, Plus } from 'lucide-react';
import { useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { MotionSettingsContext } from './studies';
import './context-fan.css';

const references = [
  { title: 'The city', detail: 'Copenhagen', image: 'waterfront', alt: 'Cool geometric sample image' },
  { title: 'Weekend notes', detail: 'A few notes', image: null, alt: '' },
  { title: 'Places to stop', detail: 'Coffee & little detours', image: 'cafe', alt: 'Warm geometric sample image' },
];

/** A fan of references with a fixed layout footprint. */
export function ContextFan({ report }: { report: (state: string) => void }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState([true, true, true]);
  const [geometry, setGeometry] = useState({ spread: 166, angle: 7, lift: 76, gatherScale: .58, gatherGap: 40, gatheredY: [96, 96, 96] });
  const deck = useRef<HTMLDivElement>(null);
  const deckId = useId();
  const { tempo, reduced } = useContext(MotionSettingsContext);
  const count = selected.filter(Boolean).length;
  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
  const transition = { type: 'tween' as const, duration: reduced ? 0 : 0.32 * tempo, ease };

  useLayoutEffect(() => {
    const element = deck.current;
    const card = element?.querySelector<HTMLElement>('.fan-reference');
    if (!element || !card) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const gatherScale = Number(style.getPropertyValue('--fan-gather-scale'));
      setGeometry({
        spread: Number(style.getPropertyValue('--fan-spread')),
        angle: Number(style.getPropertyValue('--fan-angle')),
        lift: Number(style.getPropertyValue('--fan-lift')),
        gatherScale,
        gatherGap: Number(style.getPropertyValue('--fan-gather-gap')),
        gatheredY: Array.from(element.querySelectorAll<HTMLElement>('.fan-reference'), item =>
          element.offsetHeight - item.offsetTop - item.offsetHeight * (1 + gatherScale) / 2 + 8),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('.fan-reference').forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => report(`${count} ${count === 1 ? 'reference' : 'references'} ${open ? 'selected' : 'gathered'}`), [count, open, report]);

  return <section className="primitive-card fan-context" aria-label="Context pocket — Original" data-open={open}>
    <div className="fan-deck" ref={deck} id={deckId} aria-label="Choose your references" aria-hidden={!open} style={{ paddingTop: geometry.lift + 16 }}>
      {references.map((reference, index) => {
        const openY = index === 1 ? -geometry.lift : 8;
        return <motion.button key={reference.title} type="button"
          className={`fan-reference ${selected[index] ? 'is-selected' : ''} ${reference.image ? 'fan-photo' : 'fan-note'}`}
          aria-pressed={selected[index]}
          aria-label={`${selected[index] ? 'Remove' : 'Include'} ${reference.title}`}
          disabled={!open} tabIndex={open ? 0 : -1}
          onClick={() => setSelected(values => values.map((value, i) => i === index ? !value : value))}
          initial={false}
          animate={{ x: (index - 1) * (open ? geometry.spread : geometry.gatherGap), y: open ? openY : geometry.gatheredY[index], rotate: (index - 1) * (open ? geometry.angle : 2), scale: open ? 1 : geometry.gatherScale, opacity: open || selected[index] ? 1 : 0 }}
          whileHover={open && !reduced ? { y: openY - 4 } : undefined}
          transition={transition}
          style={{ zIndex: index === 1 ? 3 : 2 }}>
          <span className="fan-art">
            {reference.image ? <img src={`/ui-examples/assets/${reference.image}.svg`} alt={reference.alt} width={320} height={320} draggable={false} />
              : <span className="fan-note-body"><FileText aria-hidden="true" /><motion.span animate={{ opacity: open ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.12 * tempo }}>Walkable days.<br />Good coffee.<br />No early starts.</motion.span></span>}
          </span>
          <motion.span className="fan-caption" animate={{ opacity: open ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.12 * tempo }}>
            <strong>{reference.title}</strong><span>{reference.detail}</span>
          </motion.span>
          <span className="fan-selection" aria-hidden="true">{selected[index] ? <Check /> : <Plus />}</span>
        </motion.button>;
      })}
    </div>

    <div className="fan-pocket">
      <div className="fan-pocket-heading">
        <span className="fan-location" aria-hidden="true"><MapPin /></span>
        <div><h2>A weekend in Copenhagen</h2><span className="fan-subtitle"><span aria-hidden={!open}>Your starting point</span><span aria-hidden={open}>Your references, together</span></span></div>
      </div>
      <footer className="fan-pocket-footer">
        <span className="fan-count"><Paperclip aria-hidden="true" />{count} {count === 1 ? 'reference' : 'references'}</span>
        <button type="button" className="demo-button button-primary fan-action" disabled={open && count === 0}
          aria-label={open ? 'Gather selected references' : 'Open context pocket'} aria-expanded={open} aria-controls={deckId}
          onClick={() => setOpen(value => !value)}>
          <span className="fan-action-label"><span aria-hidden={!open}>Gather</span><span aria-hidden={open}>Open</span></span>
          <motion.span animate={{ rotate: open ? 0 : 180 }} transition={transition}><ChevronDown aria-hidden="true" /></motion.span>
        </button>
      </footer>
    </div>
    <p className="fan-empty" aria-live="polite">{count === 0 ? 'Choose a reference to continue.' : '\u00a0'}</p>
  </section>;
}
