'use client';

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect,
  useRef, useState, type ReactNode, type Ref,
} from 'react';
import {
  ArrowRight, Check, ChevronLeft, Clock3, Coffee, FileText, GitBranch,
  GripVertical, MapPin, Minus, Moon, Paperclip, Pause, Play, RotateCcw,
  ScanLine, SlidersHorizontal,
} from 'lucide-react';
import { Slider } from './slider';

export const MotionSettingsContext = createContext({ tempo: 1, reduced: false });
function useTiming() {
  const settings = useContext(MotionSettingsContext);
  return {
    ...settings,
    ease: {
      duration: settings.reduced ? 0 : 0.2 * settings.tempo,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };
}
type StudyProps = { report: (state: string) => void };

// Only transfer focus when the control that owned it is being replaced.
function useControlFocus() {
  const scope = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const remember = useCallback(() => {
    pending.current = !!scope.current?.contains(document.activeElement);
  }, []);
  const restore = useCallback((button: HTMLButtonElement | null) => {
    if (!button || !pending.current) return;
    const active = document.activeElement;
    if (active === document.body || active?.getAttribute('role') === 'dialog' || scope.current?.contains(active))
      button.focus({ preventScroll: true });
    pending.current = false;
  }, []);
  return { scope, remember, restore };
}

function PressButton({ children, onClick, className = '', disabled = false, label, ref }: {
  children: ReactNode; onClick: () => void; className?: string;
  disabled?: boolean; label?: string; ref?: Ref<HTMLButtonElement>;
}) {
  return <button ref={ref} type="button" className={'demo-button ' + className}
    onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>;
}

// Animate the measured height, never a scale transform on live text.
function AutoHeight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const t = useTiming();
  useLayoutEffect(() => {
    const element = inner.current;
    if (!element) return;
    const measure = () => setHeight(element.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <motion.div className={'auto-height ' + className} initial={false}
    animate={{ height }} transition={{ ...t.ease, duration: t.reduced ? 0 : 0.24 * t.tempo }}>
    <div ref={inner}>{children}</div>
  </motion.div>;
}
function Activity({ active = false }: { active?: boolean }) {
  return <span className={'activity ' + (active ? 'active' : '')} aria-hidden="true"><i /><i /><i /></span>;
}
function Photo({ cafe = false, className = '' }: { cafe?: boolean; className?: string }) {
  return <img className={className} src={`/ui-examples/assets/${cafe ? 'cafe' : 'waterfront'}.svg`}
    alt={cafe ? 'Warm geometric sample image' : 'Cool geometric sample image'}
    width={320} height={240} draggable={false} />;
}
const references = [
  { title: 'The waterfront', detail: 'Copenhagen', type: 'photo' },
  { title: 'Weekend notes', detail: 'Your preferences', type: 'note' },
  { title: 'Places to stop', detail: 'Coffee & detours', type: 'cafe' },
];

export function ContextPocket({ report }: StudyProps) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState([true, true, true]);
  const count = selected.filter(Boolean).length;
  const t = useTiming();
  useEffect(() => report(open ? `${count} references selected` : `${count} references gathered`), [open, count, report]);
  return <section className="primitive-card context-card" aria-label="Context pocket">
    <header className="card-header">
      <span className="eyebrow"><MapPin />Copenhagen · Saturday</span>
      <h2>A weekend, your way.</h2>
      <p>Choose what the plan should draw from.</p>
    </header>
    <AutoHeight>
      <AnimatePresence initial={false} mode="wait">
      {open ? <motion.div key="references" className="reference-grid"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        transition={{ ...t.ease, duration: t.reduced ? 0 : 0.14 * t.tempo }}>
        {references.map((item, index) => <button key={item.title} type="button"
          className={'reference-tile ' + (selected[index] ? 'is-selected' : '')}
          aria-pressed={selected[index]} aria-label={`${selected[index] ? 'Remove' : 'Include'} ${item.title}`}
          onClick={() => setSelected(values => values.map((value, i) => i === index ? !value : value))}>
          <span className="reference-art">
            {item.type === 'note' ? <span className="note-preview"><FileText /><span>Walkable days.<br />Good coffee.<br />No early starts.</span></span>
              : <Photo cafe={item.type === 'cafe'} />}
          </span>
          <span className="reference-caption"><strong>{item.title}</strong><span>{item.detail}</span></span>
          <span className="selection-mark" aria-hidden="true"><Check /></span>
        </button>)}
      </motion.div> : <motion.div key="gathered" className="gathered-context"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
        transition={{ ...t.ease, duration: t.reduced ? 0 : 0.18 * t.tempo }}>
        <span className="gathered-thumbs" aria-hidden="true">
          {references.map((item, i) => selected[i] && <span key={item.title}>{item.type === 'note' ? <FileText /> : <Photo cafe={item.type === 'cafe'} />}</span>)}
        </span>
        <div><strong>{count} {count === 1 ? 'reference' : 'references'} attached</strong><span>Ready for your next conversation.</span></div>
      </motion.div>}
      </AnimatePresence>
    </AutoHeight>
    <footer className="card-footer">
      <span className="footer-note"><Paperclip />{open ? `${count} selected` : 'Context ready'}</span>
      <PressButton className={open ? 'button-primary' : 'button-secondary'} disabled={open && count === 0} onClick={() => setOpen(!open)}>
        {open ? <>Gather<ArrowRight /></> : <>Edit context<RotateCcw /></>}
      </PressButton>
    </footer>
  </section>;
}

const initialDraft = 'Start with a late coffee by the canal. Take your time finding a place to sit, then follow the waterfront until something catches your eye. Keep the afternoon for one good detour: a gallery, a design shop, or a street you have not walked before. Leave the evening open. You can decide where the day goes once you are there.'.split(' ');
export function InterruptHandle({ report }: StudyProps) {
  const [state, setState] = useState<'Ready' | 'Drafting' | 'Paused' | 'Complete'>('Ready');
  const [words, setWords] = useState(initialDraft);
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState('');
  const [kept, setKept] = useState(false);
  const paused = useRef(true);
  const dragged = useRef(false);
  const draftBody = useRef<HTMLDivElement>(null);
  const followDraft = useRef(true);
  const focus = useControlFocus();
  const t = useTiming();
  useEffect(() => report(state), [state, report]);
  useEffect(() => {
    paused.current = state !== 'Drafting';
    if (state !== 'Drafting') return;
    const interval = window.setInterval(() => {
      if (!paused.current) setCount(current => Math.min(current + 1, words.length));
    }, 110);
    return () => { paused.current = true; window.clearInterval(interval); };
  }, [state, words.length]);
  useEffect(() => {
    if (state === 'Drafting' && !paused.current && count >= words.length) {
      focus.remember(); setState('Complete');
    }
  }, [count, words.length, state, focus.remember]);
  useEffect(() => {
    const body = draftBody.current;
    if (body && state === 'Drafting' && followDraft.current) body.scrollTop = body.scrollHeight;
  }, [count, state]);
  const pause = () => { focus.remember(); paused.current = true; setState('Paused'); };
  const resume = () => { focus.remember(); setState('Drafting'); };
  const steer = (choice: string) => {
    focus.remember();
    const addition = choice === 'Shorter'
      ? 'The short version: coffee, a waterfront walk, and one good detour. Keep the rest open.'
      : 'Or leave the route undecided. Pick a direction after coffee, and let one interesting turn lead to the next.';
    setWords(current => [...current.slice(0, count), ...addition.split(' ')]);
    setDirection(choice); setState('Drafting');
  };
  return <section className="primitive-card interrupt-card" aria-label="Interrupt handle">
    <header className="card-header">
      <span className="eyebrow"><Activity active={state === 'Drafting'} />{state === 'Ready' ? 'Ready to write' : kept ? 'Saved to your plan' : state}</span>
      <h2>A slower Saturday</h2>
      <p className="request-line">“Plan a day with room to wander.”</p>
    </header>
    <div className="draft-body" ref={draftBody} aria-live="off" onScroll={event => {
      const body = event.currentTarget;
      followDraft.current = body.scrollHeight - body.clientHeight - body.scrollTop < 28;
    }}>
      {state === 'Ready' ? <div className="draft-outline">
        <div><Coffee /><span><strong>A late coffee</strong><span>Find a seat by the canal.</span></span></div>
        <div><MapPin /><span><strong>One good detour</strong><span>Follow whatever catches your eye.</span></span></div>
        <div><Moon /><span><strong>An open evening</strong><span>Decide when you get there.</span></span></div>
      </div> : <p>{words.slice(0, count).map((word, i) => <motion.span key={i + '-' + word}
        initial={t.reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t.ease, duration: t.reduced ? 0 : 0.14 }}>{word}{' '}</motion.span>)}
        {state === 'Drafting' && <span className="text-caret" aria-hidden="true" />}</p>}
    </div>
    <div className="draft-meta"><span><Paperclip />3 references</span><span>{direction || (state === 'Paused' ? `${count} words preserved` : '')}</span></div>
    <div ref={focus.scope}>
      <AutoHeight>
        {state === 'Paused' ? <div className="steer-footer">
          <div className="steer-label"><SlidersHorizontal /><span>Adjust the direction</span></div>
          <div className="steer-choices">
            <PressButton ref={focus.restore} className="button-secondary" onClick={() => steer('Shorter')}>Shorter</PressButton>
            <PressButton className="button-secondary" onClick={() => steer('More flexible')}>More flexible</PressButton>
            <PressButton className="button-primary button-icon" label="Resume unchanged" onClick={resume}><Play /></PressButton>
          </div>
        </div> : <footer className="card-footer">
          <span className="footer-note">{state === 'Ready' ? 'A first draft' : state === 'Drafting' ? 'You can steer anytime' : kept ? 'Added to your plan' : 'Make it yours'}</span>
          {state === 'Ready' ? <PressButton className="button-primary" onClick={resume}>Write the plan<ArrowRight /></PressButton>
            : state === 'Drafting' ? <motion.button ref={focus.restore} type="button" className="demo-button button-secondary steer-handle" aria-label="Pause and steer draft"
              drag={t.reduced ? false : 'x'} dragConstraints={{ left: -16, right: 16 }} dragElastic={0.08} dragSnapToOrigin
              onPointerDown={() => { dragged.current = false; }}
              onDragStart={() => { dragged.current = true; paused.current = true; }}
              onDragEnd={pause} onPointerCancel={() => { if (dragged.current) pause(); }}
              onClick={() => { if (!dragged.current) pause(); }}>
              <GripVertical /><span>Pause</span><Pause />
            </motion.button> : <PressButton ref={focus.restore} className={kept ? 'button-secondary' : 'button-primary'} onClick={() => setKept(!kept)}>
              {kept ? <><RotateCcw />Undo</> : <>Keep plan<Check /></>}
            </PressButton>}
        </footer>}
      </AutoHeight>
    </div>
  </section>;
}

const branchOptions = [
  { title: 'By the water', stops: ['Coffee along the canal', 'A long waterfront walk'], cafe: false },
  { title: 'Into the city', stops: ['A neighborhood café', 'Architecture & little shops'], cafe: true },
];
export function BranchFold({ report }: StudyProps) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const focus = useControlFocus();
  const action = useRef<HTMLButtonElement>(null);
  const t = useTiming();
  useLayoutEffect(() => { focus.restore(action.current); }, [chosen, focus.restore]);
  useEffect(() => report(chosen !== null ? `${branchOptions[chosen].title} chosen` : open ? 'Comparing directions' : 'Original direction'), [chosen, open, report]);
  return <section className="primitive-card branch-card" aria-label="Branch fold">
    <header className="card-header">
      <span className="eyebrow"><GitBranch />Saturday in Copenhagen</span>
      <h2>One day. Two ways.</h2>
      <p>{chosen !== null ? 'Saved, with room to change your mind.' : 'Explore a different direction.'}</p>
    </header>
    <div ref={focus.scope}>
      <AutoHeight>
        <div className="branch-list">
          {branchOptions.map((option, index) => (chosen !== null ? chosen === index : open || index === 0) &&
            <motion.button key={option.title} type="button" className={'branch-option ' + (chosen === index ? 'is-chosen' : '')}
              aria-label={`Keep ${option.title}`} aria-pressed={chosen === index}
              onClick={() => { focus.remember(); setChosen(index); }}
              initial={index === 1 && !t.reduced ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }} transition={t.ease}>
              <Photo cafe={option.cafe} />
              <span className="branch-option-copy">
                <span className="option-kicker">{chosen === index ? 'Your choice' : index === 0 ? 'Original' : 'Alternative'}</span>
                <strong>{option.title}</strong>
                <span className="option-stops">{option.stops.map(stop => <span key={stop}>{stop}</span>)}</span>
              </span>
              <span className="branch-choice" aria-hidden="true">{chosen === index ? <Check /> : <ArrowRight />}</span>
            </motion.button>)}
        </div>
      </AutoHeight>
      <footer className="card-footer branch-footer">
        <span className="footer-note">{chosen !== null ? <><Check />Direction saved</> : <><span className="branch-dot" />{open ? '2 possibilities' : 'One possible day'}</>}</span>
        <PressButton ref={action} className="button-secondary" onClick={() => {
          if (chosen !== null) { setChosen(null); setOpen(true); } else setOpen(!open);
        }}>{chosen !== null ? <><RotateCcw />Undo choice</> : open ? <><Minus />Fold back</> : <><GitBranch />Try another</>}</PressButton>
      </footer>
    </div>
  </section>;
}

const originalNote = 'Saturday in Copenhagen. Good coffee, a long walk, and nothing too planned.';
const rewrites = [
  { label: 'Touch up', text: 'Saturday in Copenhagen: good coffee, a long walk, no fixed plans.' },
  { label: 'Reshape', text: "Coffee first. A long walk after. Let's see where Copenhagen takes us." },
  { label: 'Reimagine', text: 'A Saturday without an itinerary. Just us, Copenhagen, and good coffee.' },
];
export function IntentLens({ report }: StudyProps) {
  const [value, setValue] = useState(12);
  const [original, setOriginal] = useState(originalNote);
  const slider = useRef<HTMLDivElement>(null);
  const level = value < 34 ? 0 : value < 67 ? 1 : 2;
  const rewrite = rewrites[level];
  const applied = original === rewrite.text;
  const t = useTiming();
  useEffect(() => report(applied ? 'Rewrite applied' : `${rewrite.label} preview`), [applied, rewrite.label, report]);
  useEffect(() => {
    slider.current?.querySelector('input[type="range"], [role="slider"]')?.setAttribute('aria-valuetext', rewrite.label);
  }, [rewrite.label]);
  return <section className="primitive-card intent-card" aria-label="Intent lens">
    <header className="card-header compact-header"><span className="eyebrow"><FileText />A note to a friend</span><h2>Find the right words.</h2></header>
    <div className="original-section">
      <span className="field-label">Your note</span>
      <div className="text-stack original-stack">
        {[originalNote, ...rewrites.map(item => item.text)].map(text => <p key={text} aria-hidden="true" className="size-copy">{text}</p>)}
        <p>{original}</p>
      </div>
    </div>
    <div className="rewrite-section">
      <div className="field-heading"><span className="field-label">{applied ? 'Applied rewrite' : 'Preview'}</span><span className="rewrite-state">{applied ? <Check /> : <span className="status-dot" />}{rewrite.label}</span></div>
      <div className="text-stack rewrite-preview">
        {rewrites.map((item, index) => <p key={item.label} aria-hidden={level !== index} style={{ visibility: level === index ? 'visible' : 'hidden' }}>{item.text}</p>)}
      </div>
    </div>
    <div className="rewrite-controller">
      <div className="rewrite-modes" role="group" aria-label="Rewrite style">
        <motion.span className="mode-indicator" aria-hidden="true" initial={false} animate={{ x: `${level * 100}%` }} transition={t.ease} />
        {rewrites.map((item, index) => <button key={item.label} type="button" aria-pressed={index === level} onClick={() => setValue([12, 50, 88][index])}>{item.label}</button>)}
      </div>
      <Slider ref={slider} className="intent-slider" min={0} max={100} step={1} value={[value]}
        onValueChange={values => setValue(typeof values === 'number' ? values : values[0])} />
    </div>
    <footer className="card-footer">
      <PressButton className={applied ? 'button-secondary' : 'button-primary'} onClick={() => setOriginal(applied ? originalNote : rewrite.text)}>
        {applied ? <><RotateCcw />Undo</> : <>Apply rewrite<ArrowRight /></>}
      </PressButton>
    </footer>
  </section>;
}

export function EvidencePeel({ report }: StudyProps) {
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pull = useMotionValue(0);
  const clip = useTransform(pull, [0, 1], ['inset(0 0% 0 0)', 'inset(0 100% 0 0)']);
  const seam = useTransform(pull, p => `${(1 - Math.max(0, Math.min(1, p))) * 100}%`);
  const seamOpacity = useTransform(pull, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const dragStart = useRef(0), dragOrigin = useRef(0), dragDistance = useRef(240);
  const didDrag = useRef(false), activePointer = useRef<number | null>(null);
  const control = useRef<ReturnType<typeof animate> | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const t = useTiming();
  const settle = (open: boolean) => {
    control.current?.stop(); setRevealed(open); setDragging(false);
    control.current = animate(pull, open ? 1 : 0, { ...t.ease, duration: t.reduced ? 0 : 0.24 * t.tempo });
  };
  useEffect(() => report(revealed ? 'Showing two references' : 'Showing answer'), [revealed, report]);
  useEffect(() => () => control.current?.stop(), []);
  return <section className="primitive-card evidence-card" aria-label="Evidence peel" ref={card}>
    <div className="evidence-body">
      <div className="source-layer" aria-hidden={!revealed && !dragging}>
        <span className="eyebrow"><Paperclip />Behind the answer</span>
        <h2>From your references</h2>
        <div className="source-list">
          <div className="source-row"><span className="source-art"><FileText /></span><div><strong>Weekend notes</strong><p>“Walkable days. Good coffee. No early starts.”</p></div></div>
          <div className="source-row"><span className="source-art"><Photo cafe /></span><div><strong>Places to stop</strong><p>Coffee and small detours, with time between them.</p></div></div>
        </div>
      </div>
      <motion.div className="answer-layer" style={{ clipPath: clip }} aria-hidden={revealed}>
        <span className="eyebrow"><Check />Made for your kind of day</span>
        <h2>A later start.<br />A little less planned.</h2>
        <p>Start after 10, with no more than two planned stops. Leave the rest of Saturday open.</p>
        <div className="answer-facts"><span><Clock3 />After 10 am</span><span><MapPin />Two stops</span></div>
      </motion.div>
      <motion.div className="peel-seam" style={{ left: seam, opacity: seamOpacity }} aria-hidden="true" />
    </div>
    <footer className="card-footer evidence-footer">
      <span className="footer-note"><Paperclip />{dragging ? 'Pull left' : '2 sources'}</span>
      <button type="button" className="demo-button button-secondary peel-button" aria-expanded={revealed}
        aria-label={revealed ? 'Return to answer' : 'Drag left or tap to reveal sources'}
        onPointerDown={event => {
          if (event.button !== 0 || !event.isTrusted || activePointer.current !== null) return;
          activePointer.current = event.pointerId; control.current?.stop();
          dragStart.current = event.clientX; dragOrigin.current = pull.get();
          dragDistance.current = Math.max(120, (card.current?.getBoundingClientRect().width || 520) * 0.58);
          didDrag.current = false; event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (activePointer.current !== event.pointerId) return;
          const delta = dragStart.current - event.clientX;
          if (Math.abs(delta) > 4) { didDrag.current = true; setDragging(true); }
          if (didDrag.current) pull.set(Math.max(0, Math.min(1, dragOrigin.current + delta / dragDistance.current)));
        }}
        onPointerUp={event => {
          if (activePointer.current !== event.pointerId) return;
          activePointer.current = null;
          if (didDrag.current) settle(pull.get() > 0.5);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={event => {
          if (activePointer.current !== event.pointerId) return;
          didDrag.current = true; activePointer.current = null; settle(revealed);
        }}
        onLostPointerCapture={() => {
          if (activePointer.current === null) return;
          didDrag.current = true; activePointer.current = null; settle(revealed);
        }}
        onClick={event => { if (event.detail === 0 || !didDrag.current) settle(!revealed); didDrag.current = false; }}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.stopPropagation(); if (activePointer.current !== null) didDrag.current = true;
            activePointer.current = null; settle(false);
          }
        }}>
        {revealed ? <ChevronLeft /> : <ScanLine />}<span>{revealed ? 'Answer' : 'See sources'}</span>
      </button>
    </footer>
  </section>;
}

const edits = [
  { before: '8 am', after: '10 am', prefix: 'Coffee at ' },
  { before: 'morning', after: 'afternoon', prefix: 'Walk in the ' },
  { before: 'Book dinner', after: 'Keep the evening free', prefix: '' },
];
export function HandoffLatch({ report }: StudyProps) {
  const [state, setState] = useState<'Review' | 'Holding' | 'Applied'>('Review');
  const progress = useMotionValue(0);
  const fillClip = useTransform(progress, [0, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const control = useRef<ReturnType<typeof animate> | null>(null);
  const held = useRef(false), applied = useRef(false), latchPointer = useRef<number | null>(null);
  const focus = useControlFocus();
  const t = useTiming();
  const commit = useCallback(() => {
    focus.remember(); held.current = false; applied.current = true;
    setState('Applied'); progress.set(1);
  }, [progress, focus.remember]);
  const cancel = useCallback(() => {
    if (!held.current || applied.current) return;
    held.current = false; control.current?.stop(); setState('Review');
    control.current = animate(progress, 0, { duration: t.reduced ? 0 : 0.16 * t.tempo, ease: [0.22, 1, 0.36, 1] });
  }, [progress, t.reduced, t.tempo]);
  const start = () => {
    if (held.current || applied.current) return;
    control.current?.stop(); progress.set(0); held.current = true; setState('Holding');
    control.current = animate(progress, 1, { duration: 0.7, ease: 'linear', onComplete: () => { if (held.current && !applied.current) commit(); } });
  };
  const undo = () => {
    focus.remember(); control.current?.stop(); held.current = false; applied.current = false;
    progress.set(0); setState('Review');
  };
  useEffect(() => report(state), [state, report]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') cancel(); };
    const hide = () => { if (document.hidden) cancel(); };
    window.addEventListener('keydown', key); window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hide); control.current?.stop(); };
  }, [cancel]);
  return <section className={'primitive-card handoff-card ' + (state === 'Applied' ? 'is-applied' : '')} aria-label="Handoff latch">
    <header className="handoff-header"><Photo /><div><h2>Review changes</h2><p>Saturday · Copenhagen</p></div></header>
    <div className="handoff-document">
      {[false, true].map(appliedCopy => <ul key={String(appliedCopy)} className="handoff-copy" aria-hidden={appliedCopy !== (state === 'Applied')}>
        {edits.map(edit => <li key={edit.before}>
          {edit.prefix}{appliedCopy ? edit.after : <><del>{edit.before}</del>{' '}<ins>{edit.after}</ins></>}
        </li>)}
      </ul>)}
    </div>
    <div className="latch-area" ref={focus.scope}>
      {state === 'Applied' ? <div className="applied-state">
        <div className="commit-receipt"><span><Check /><strong>Changes applied</strong></span><PressButton ref={focus.restore} className="button-quiet" onClick={undo}>Undo</PressButton></div>
        <p className="latch-caption">Saved to your plan.</p>
      </div> : <div>
        <button ref={focus.restore} className="handoff-latch" type="button" aria-label="Hold for 0.7 seconds to apply three edits"
          onPointerDown={event => {
            if (event.button !== 0 || !event.isPrimary || !event.isTrusted || held.current) return;
            latchPointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); start();
          }}
          onPointerMove={event => {
            if (!held.current || latchPointer.current !== event.pointerId) return;
            const r = event.currentTarget.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) cancel();
          }}
          onPointerUp={event => {
            if (latchPointer.current !== event.pointerId) return;
            latchPointer.current = null; cancel();
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={cancel} onLostPointerCapture={cancel} onPointerLeave={cancel} onBlur={cancel}
          onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel(); }
            else if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) start(); }
          }}
          onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); cancel(); } }}>
          <span className="latch-content"><Check /><span>{state === 'Holding' ? 'Keep holding…' : 'Hold to apply'}</span></span>
          <motion.span className="latch-fill" style={{ clipPath: fillClip }} aria-hidden="true"><span className="latch-content"><Check /><span>{state === 'Holding' ? 'Keep holding…' : 'Hold to apply'}</span></span></motion.span>
        </button>
        <button type="button" className="instant-apply" onClick={() => { control.current?.stop(); commit(); }}>Apply without holding</button>
      </div>}
    </div>
  </section>;
}
