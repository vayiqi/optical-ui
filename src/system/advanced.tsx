'use client';
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Minus,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import { Button, IconButton, Slider, SegmentedControl, Badge } from './index';
import catalog from './studies-catalog.json';
import './advanced.css';
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
type Point = { x: number; y: number };
function usePoint(initial: Point = { x: 50, y: 50 }) {
  const [point, setPoint] = useState(initial),
    area = useRef<HTMLDivElement>(null),
    start = useRef<Point | null>(null);
  return {
    point,
    setPoint,
    area,
    bind: {
      onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
        e.currentTarget.focus();
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = point;
      },
      onPointerMove: (e: ReactPointerEvent<HTMLButtonElement>) => {
        if (start.current && area.current) {
          const r = area.current.getBoundingClientRect();
          setPoint({
            x: clamp(((e.clientX - r.left) / r.width) * 100, 12, 88),
            y: clamp(((e.clientY - r.top) / r.height) * 100, 16, 84),
          });
        }
      },
      onPointerUp: () => {
        start.current = null;
      },
      onPointerCancel: () => {
        if (start.current) setPoint(start.current);
        start.current = null;
      },
      onLostPointerCapture: () => {
        start.current = null;
      },
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Escape' && start.current) {
          e.preventDefault();
          setPoint(start.current);
          start.current = null;
        } else if (
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home'].includes(
            e.key,
          )
        ) {
          e.preventDefault();
          setPoint((p) =>
            e.key === 'Home'
              ? initial
              : {
                  x: clamp(
                    p.x +
                      (e.key === 'ArrowRight'
                        ? 3
                        : e.key === 'ArrowLeft'
                          ? -3
                          : 0),
                    12,
                    88,
                  ),
                  y: clamp(
                    p.y +
                      (e.key === 'ArrowDown'
                        ? 3
                        : e.key === 'ArrowUp'
                          ? -3
                          : 0),
                    16,
                    84,
                  ),
                },
          );
        }
      },
    },
  };
}
export function PleatedObject() {
  return (
    <div className="oa-sculpture" aria-hidden="true">
      {Array.from({ length: 17 }, (_, i) => (
        <i
          key={i}
          style={
            {
              '--i': i,
              '--extent': Math.sqrt(1 - ((i - 8) / 9) ** 2),
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
export function PrecisionFader() {
  const [values, setValues] = useState([72, 48, 26]);
  return (
    <>
      <div className="oa-mixer">
        {['Light', 'Texture', 'Depth'].map((label, i) => (
          <label className="oa-fader" key={label}>
            <span>{label}</span>
            <input
              aria-label={label}
              type="range"
              min={0}
              max={100}
              value={values[i]}
              onChange={(e) =>
                setValues((v) =>
                  v.map((n, j) => (j === i ? +e.target.value : n)),
                )
              }
            />
            <output>{values[i].toString().padStart(2, '0')}</output>
          </label>
        ))}
      </div>
      <div className="oa-footer">
        <span>A balance, in three parts.</span>
        <IconButton
          label="Reset faders"
          variant="soft"
          onClick={() => setValues([72, 48, 26])}
        >
          <RotateCcw />
        </IconButton>
      </div>
    </>
  );
}
export function SteppedSlider() {
  const [value, setValue] = useState(2);
  const labels = ['Still', 'Quiet', 'Balanced', 'Expressive', 'Vivid'];
  return (
    <>
      <div className="oa-step-art" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            style={{
              transform: `translateY(${Math.sin(i * 0.6 + value) * value * 13}px) rotate(${value * 3}deg)`,
              height: `${70 + value * 14}px`,
            }}
          />
        ))}
      </div>
      <Slider
        label="Expression"
        min={0}
        max={4}
        step={1}
        value={value}
        onValueChange={(v) => setValue(Number(v))}
      />
      <div className="oa-stops">
        {labels.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === i}
            onClick={() => setValue(i)}
          >
            <i />
            {s}
          </button>
        ))}
      </div>
      <output className="opt-example-status">
        {labels[value]} — stop {value + 1} of 5
      </output>
    </>
  );
}
export function TimelineWheel() {
  const [frame, setFrame] = useState(24),
    [kept, setKept] = useState<number | null>(null);
  return (
    <>
      <div className="oa-frame-window">
        <div
          className="oa-sun"
          style={{
            transform: `translate(${(frame - 50) * 1.5}px,${Math.sin((frame / 100) * Math.PI) * -45}px)`,
            background: 'var(--opt-bright)',
          }}
        />
        <div className="oa-horizon" />
        <span>FRAME / {String(frame).padStart(3, '0')}</span>
      </div>
      <div className="oa-wheel">
        <div
          className="oa-wheel-ticks"
          style={{ transform: `translateX(${-(frame % 10) * 5}px)` }}
          aria-hidden="true"
        >
          {Array.from({ length: 70 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <Slider
          label="Timeline frame"
          min={0}
          max={99}
          value={frame}
          onValueChange={(v) => setFrame(Number(v))}
        />
      </div>
      <div className="oa-footer">
        <div className="opt-example-row">
          <IconButton
            label="Previous frame"
            variant="soft"
            disabled={frame === 0}
            onClick={() => setFrame(frame - 1)}
          >
            <ArrowLeft />
          </IconButton>
          <IconButton
            label="Next frame"
            variant="soft"
            disabled={frame === 99}
            onClick={() => setFrame(frame + 1)}
          >
            <ArrowRight />
          </IconButton>
        </div>
        <Button onClick={() => setKept(frame)}>
          {kept === frame ? (
            <>
              <Check />
              Kept
            </>
          ) : (
            <>
              Keep frame
              <Plus />
            </>
          )}
        </Button>
      </div>
      <output className="opt-example-status">
        {kept !== null
          ? `Frame ${kept} is kept.`
          : 'Scrub slowly. Find a moment.'}
      </output>
    </>
  );
}
export function GlassShutter() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`oa-shutter ${open ? 'is-open' : ''}`}>
        <PleatedObject />
        <div className="oa-shutter-leaf oa-shutter-left" />
        <div className="oa-shutter-leaf oa-shutter-right" />
        <span className="oa-object-caption">
          FORM / 017
          <br />
          Light, made visible.
        </span>
      </div>
      <div className="oa-footer">
        <span>{open ? 'In plain sight.' : 'Just beyond the glass.'}</span>
        <Button
          variant="glass"
          aria-pressed={open}
          onClick={() => setOpen(!open)}
        >
          <Eye />
          {open ? 'Close shutter' : 'Open shutter'}
        </Button>
      </div>
    </>
  );
}
function LensPattern() {
  return (
    <div className="oa-lens-pattern" aria-hidden="true">
      {Array.from({ length: 15 }, (_, i) => (
        <i
          key={i}
          style={{ width: `${32 + i * 20}px`, height: `${32 + i * 20}px` }}
        />
      ))}
    </div>
  );
}
export function FocusLens() {
  const { point, setPoint, area, bind } = usePoint();
  return (
    <>
      <div className="oa-lens-area" ref={area}>
        <div className="oa-lens-blur">
          <LensPattern />
        </div>
        <div
          className="oa-lens-clear"
          style={{ clipPath: `circle(59px at ${point.x}% ${point.y}%)` }}
        >
          <LensPattern />
        </div>
        <button
          className="oa-lens-handle"
          type="button"
          aria-label="Move focus lens. Use arrow keys."
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          {...bind}
        >
          <span />
          <i />
          <i />
        </button>
        <span className="oa-object-caption">DRAG TO INSPECT</span>
      </div>
      <div className="oa-footer">
        <span>Clarity follows attention.</span>
        <IconButton
          label="Center lens"
          variant="soft"
          onClick={() => setPoint({ x: 50, y: 50 })}
        >
          <RotateCcw />
        </IconButton>
      </div>
      <output className="opt-example-status">
        Focus at {Math.round(point.x)}, {Math.round(point.y)}
      </output>
    </>
  );
}
const pieces = [
  'Soft geometry',
  'Warm front',
  'Common ground',
  'After hours',
  'Slow morning',
  'New forms',
];
function PrintArt({ index }: { index: number }) {
  return (
    <span
      className={`oa-print oa-print-${index % 3}`}
      style={{ '--print-angle': `${index * 33}deg` } as CSSProperties}
    >
      <i />
      <i />
      <b>{String(index + 1).padStart(2, '0')}</b>
    </span>
  );
}
export function ContactSheet() {
  const [selected, setSelected] = useState<number[]>([0, 2]);
  return (
    <>
      <div className="oa-contact-grid">
        {pieces.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected.includes(i)}
            onClick={() =>
              setSelected((s) =>
                s.includes(i) ? s.filter((n) => n !== i) : [...s, i],
              )
            }
          >
            <PrintArt index={i} />
            <span>{name}</span>
            <i>{selected.includes(i) && <Check />}</i>
          </button>
        ))}
      </div>
      <div className="oa-footer">
        <output>{selected.length} / 6 selected</output>
        <Button
          variant="soft"
          onClick={() =>
            setSelected(selected.length === 6 ? [] : [0, 1, 2, 3, 4, 5])
          }
        >
          {selected.length === 6 ? 'Clear selection' : 'Select all'}
        </Button>
      </div>
    </>
  );
}
export function SelectionTray() {
  const [selected, setSelected] = useState([0, 2]),
    [removed, setRemoved] = useState<{
      index: number;
      position: number;
    } | null>(null);
  const remove = (index: number) => {
    setRemoved({ index, position: selected.indexOf(index) });
    setSelected((s) => s.filter((n) => n !== index));
  };
  return (
    <>
      <div className="oa-tray-source">
        {pieces.slice(0, 4).map((name, i) => (
          <button
            key={name}
            type="button"
            disabled={selected.includes(i)}
            aria-label={`Add ${name}`}
            onClick={() => setSelected((s) => [...s, i])}
          >
            <PrintArt index={i} />
            <Plus />
          </button>
        ))}
      </div>
      <div className="oa-tray">
        <span className="oa-small-label">
          YOUR SELECTION / {selected.length}
        </span>
        {selected.length === 0 ? (
          <p className="opt-example-note">Choose a print to begin.</p>
        ) : (
          <ol>
            {selected.map((index, position) => (
              <li key={index}>
                <PrintArt index={index} />
                <span>{pieces[index]}</span>
                <button
                  type="button"
                  aria-label={`Move ${pieces[index]} earlier`}
                  disabled={position === 0}
                  onClick={() =>
                    setSelected((s) => {
                      const a = [...s];
                      [a[position - 1], a[position]] = [
                        a[position],
                        a[position - 1],
                      ];
                      return a;
                    })
                  }
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${pieces[index]}`}
                  onClick={() => remove(index)}
                >
                  <X />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      {removed && (
        <Button
          variant="soft"
          onClick={() => {
            setSelected((s) => {
              if (s.includes(removed.index)) return s;
              const a = [...s];
              a.splice(removed.position, 0, removed.index);
              return a;
            });
            setRemoved(null);
          }}
        >
          <RotateCcw />
          Undo removal
        </Button>
      )}
    </>
  );
}
export function CollectionStack() {
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState(0);
  const id = useId();
  return (
    <>
      <div className={`oa-expand-collection ${open ? 'is-open' : ''}`} id={id}>
        {pieces.slice(0, 4).map((name, i) => (
          <button
            type="button"
            key={name}
            aria-label={`View ${name}`}
            aria-pressed={selected === i}
            tabIndex={open || i === 0 ? 0 : -1}
            style={{ '--stack-index': i } as CSSProperties}
            onClick={() => {
              setSelected(i);
              setOpen(true);
            }}
          >
            <PrintArt index={i} />
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="oa-footer">
        <span>{pieces[selected]}</span>
        <Button
          variant="soft"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Gather collection' : 'Unfold collection'}
          {open ? <Minus /> : <Plus />}
        </Button>
      </div>
    </>
  );
}
export function VersionRail() {
  const [selected, setSelected] = useState(1),
    [kept, setKept] = useState<number | null>(null);
  const names = ['First thought', 'A warmer direction', 'Room to breathe'];
  return (
    <>
      <div className={`oa-version-poster oa-version-${selected}`}>
        <span>STUDIO NOTES / 0{selected + 1}</span>
        <strong>
          Less,
          <br />
          but better.
        </strong>
        <i />
        <small>{names[selected]}</small>
        {kept !== null && <Badge>Kept direction</Badge>}
      </div>
      <fieldset className="oa-version-rail" aria-label="Revision history">
        {names.map((name, i) => (
          <button
            type="button"
            key={name}
            aria-pressed={selected === i}
            disabled={kept !== null}
            onClick={() => setSelected(i)}
          >
            <i />
            <span>0{i + 1}</span>
            {name}
          </button>
        ))}
      </fieldset>
      <div className="oa-footer">
        <span>
          {kept !== null
            ? 'You can change your mind.'
            : 'Three ways of seeing.'}
        </span>
        <Button onClick={() => setKept(kept === null ? selected : null)}>
          {kept === null ? (
            <>
              <Check />
              Keep direction
            </>
          ) : (
            <>
              <RotateCcw />
              Undo choice
            </>
          )}
        </Button>
      </div>
    </>
  );
}
export function TransformPad() {
  const { point, setPoint, area, bind } = usePoint();
  const [scale, setScale] = useState(100),
    [material, setMaterial] = useState('ceramic');
  return (
    <>
      <div className={`oa-transform-area oa-material-${material}`} ref={area}>
        <span className="oa-small-label">
          X {Math.round(point.x)} / Y {Math.round(point.y)}
        </span>
        <button
          type="button"
          className="oa-transform-object"
          aria-label="Move object. Use arrow keys."
          style={
            {
              left: `${point.x}%`,
              top: `${point.y}%`,
              '--object-scale': scale / 100,
            } as CSSProperties
          }
          {...bind}
        >
          <PleatedObject />
        </button>
        <div
          className="oa-crosshairs"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      </div>
      <div className="oa-transform-inspector">
        <Slider
          label="Object scale"
          min={60}
          max={115}
          value={scale}
          onValueChange={(v) => setScale(Number(v))}
          unit="%"
        />
        <div className="oa-footer">
          <SegmentedControl
            label="Surface material"
            value={material}
            onValueChange={(v) => setMaterial(String(v))}
            options={[
              { value: 'ceramic', label: 'Ceramic' },
              { value: 'chrome', label: 'Chrome' },
            ]}
          />
          <IconButton
            label="Reset transform"
            variant="soft"
            onClick={() => {
              setPoint({ x: 50, y: 50 });
              setScale(100);
              setMaterial('ceramic');
            }}
          >
            <RotateCcw />
          </IconButton>
        </div>
      </div>
    </>
  );
}
const advancedComponents = {
  'precision-fader': PrecisionFader,
  'step-slider': SteppedSlider,
  'timeline-wheel': TimelineWheel,
  'glass-shutter': GlassShutter,
  'focus-lens': FocusLens,
  'contact-sheet': ContactSheet,
  'selection-tray': SelectionTray,
  'collection-stack': CollectionStack,
  'version-rail': VersionRail,
  'transform-pad': TransformPad,
};
export const advancedIds = Object.keys(advancedComponents);
export default function AdvancedExample({ name }: { name: string }) {
  const info = catalog.find((row) => row[0] === name),
    Component = advancedComponents[name as keyof typeof advancedComponents];
  if (!Component) return null;
  return (
    <section
      className="opt-foundation-example oa-example"
      aria-label={`${info?.[1]} example`}
    >
      <header>
        <span>
          {info?.[2]} / {info?.[3]}
        </span>
        <h2>{info?.[1]}</h2>
      </header>
      <div className="opt-example-content">
        <Component />
      </div>
    </section>
  );
}
