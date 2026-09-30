'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
  Settings,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import * as O from './index';
import catalog from './catalog.json';
import './examples.css';
export const foundationIds = catalog.map((row) => row[0]);
const projects = [
  'Light studies',
  'Common ground',
  'Soft geometry',
  'After hours',
  'New forms',
];
const options = projects.map((value) => ({ value, label: value }));
function ToastExample() {
  const toast = O.useToast();
  return (
    <>
      <div className="opt-example-object">
        <div className="opt-seal-mark">
          <Check />
        </div>
      </div>
      <O.Button
        onClick={() =>
          toast.add({
            title: 'Changes saved',
            description: 'Your workspace is up to date.',
          })
        }
      >
        Save changes <ArrowRight />
      </O.Button>
      <p className="opt-example-note">
        A quiet confirmation. Hover to pause it.
      </p>
    </>
  );
}
function IconButtonExample() {
  const [states, setStates] = useState({
    bookmark: false,
    sound: false,
    add: false,
  });
  const [notice, setNotice] = useState('');
  const controls = [
    {
      kind: 'bookmark' as const,
      label: 'Save for later',
      idle: 'Save',
      active: 'Saved',
      on: 'Saved for later.',
      off: 'Removed from saved items.',
    },
    {
      kind: 'sound' as const,
      label: 'Sound',
      idle: 'Sound off',
      active: 'Sound on',
      on: 'Sound preference enabled.',
      off: 'Sound preference muted.',
    },
    {
      kind: 'add' as const,
      label: 'Add to collection',
      idle: 'Add',
      active: 'Added',
      on: 'Added to your collection.',
      off: 'Removed from your collection.',
    },
  ];
  return (
    <div className="opt-icon-demo">
      <fieldset
        className="opt-icon-demo-controls"
        aria-label="Try icon actions"
      >
        {controls.map((control) => (
          <div className="opt-icon-demo-item" key={control.kind}>
            <O.IconButton
              feedback
              label={control.label}
              aria-pressed={states[control.kind]}
              onClick={() => {
                const next = !states[control.kind];
                setStates((current) => ({ ...current, [control.kind]: next }));
                setNotice(next ? control.on : control.off);
              }}
            >
              <O.IconStateGlyph
                kind={control.kind}
                active={states[control.kind]}
              />
            </O.IconButton>
            <span className="opt-icon-demo-caption" aria-hidden="true">
              {states[control.kind] ? control.active : control.idle}
            </span>
          </div>
        ))}
      </fieldset>
      <output
        className="opt-icon-demo-status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notice}
      </output>
    </div>
  );
}
function CheckboxExample() {
  const [files, setFiles] = useState({ source: false, readme: true });
  const count = Number(files.source) + Number(files.readme);
  return (
    <div className="opt-check-demo">
      <O.Checkbox
        label="Include all files"
        checked={count === 2}
        indeterminate={count === 1}
        onCheckedChange={(next) => setFiles({ source: next, readme: next })}
      />
      <div className="opt-check-demo-files">
        <O.Checkbox
          label="Include source files"
          description="The pieces behind the finished work."
          checked={files.source}
          onCheckedChange={(source) =>
            setFiles((current) => ({ ...current, source }))
          }
        />
        <O.Checkbox
          label="Include a readme"
          checked={files.readme}
          onCheckedChange={(readme) =>
            setFiles((current) => ({ ...current, readme }))
          }
        />
        <O.Checkbox label="Archive locked" disabled />
      </div>
      <output className="opt-example-status" aria-live="polite">
        {count} of 2 files included
      </output>
    </div>
  );
}
function ButtonGroupExample() {
  const [count, setQuantity] = useState(32);
  const change = (step: number | 'reset') =>
    setQuantity((current) =>
      step === 'reset' ? 32 : Math.min(99, Math.max(0, current + step)),
    );
  return (
    <div className="opt-group-demo">
      <output
        className="opt-group-quantity"
        aria-live="polite"
        aria-atomic="true"
      >
        <O.SteppingNumber value={count} />
        <span className="opt-group-unit">{count === 1 ? 'item' : 'items'}</span>
      </output>
      <O.ButtonGroup label="Adjust quantity">
        <O.Button
          variant="soft"
          aria-label="Remove one item"
          aria-disabled={count === 0}
          onClick={() => change(-1)}
        >
          <Minus aria-hidden="true" />
        </O.Button>
        <O.Button
          variant="soft"
          aria-label="Reset quantity to 32"
          onClick={() => change('reset')}
        >
          <RotateCcw aria-hidden="true" /> Reset
        </O.Button>
        <O.Button
          variant="soft"
          aria-label="Add one item"
          aria-disabled={count === 99}
          onClick={() => change(1)}
        >
          <Plus aria-hidden="true" />
        </O.Button>
      </O.ButtonGroup>
      <p className="opt-group-limit">
        {count === 0
          ? 'Minimum reached'
          : count === 99
            ? 'Maximum reached'
            : '0–99 items'}
      </p>
    </div>
  );
}
function ExampleBody({ name }: { name: string }) {
  const [count, setCount] = useState(32),
    [value, setValue] = useState(''),
    [choice, setChoice] = useState('Light studies'),
    [checked, setChecked] = useState(true),
    [pending, setPending] = useState(false),
    [saved, setSaved] = useState(false),
    [page, setPage] = useState(1),
    [visible, setVisible] = useState(true),
    [loading, setLoading] = useState(true),
    [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const submit = () => {
    if (timer.current) clearTimeout(timer.current);
    setPending(true);
    setSaved(false);
    setNotice('Saving collection.');
    timer.current = setTimeout(() => {
      setPending(false);
      setSaved(true);
      setNotice('Collection saved.');
      timer.current = null;
    }, 1400);
  };
  const output = <output className="opt-example-status">{notice}</output>;
  switch (name) {
    case 'button':
      return (
        <>
          <div className="opt-example-stack opt-button-demo">
            <O.Button
              pending={pending}
              pendingLabel="Saving"
              morphKey={saved ? 'saved' : 'ready'}
              complete={saved}
              leadingIcon={
                <O.ActionGlyph
                  state={pending ? 'working' : saved ? 'complete' : 'ready'}
                />
              }
              onClick={submit}
              aria-disabled={saved || undefined}
              aria-label={
                pending
                  ? 'Saving collection'
                  : saved
                    ? 'Collection saved'
                    : 'Save collection'
              }
            >
              {saved ? null : 'Save collection'}
            </O.Button>
            <O.Button
              variant="soft"
              className="opt-button-demo-secondary"
              disabled={!pending && !saved}
              onClick={() => {
                if (timer.current) clearTimeout(timer.current);
                timer.current = null;
                setPending(false);
                setSaved(false);
                setNotice('Ready. Nothing is pending.');
              }}
            >
              <RotateCcw /> Start again
            </O.Button>
            <O.Button
              variant="soft"
              className="opt-button-demo-secondary"
              disabled
            >
              Unavailable action
            </O.Button>
          </div>
          <output
            className="opt-button-demo-status"
            data-active={!!notice || undefined}
            aria-live="polite"
            aria-atomic="true"
          >
            {notice || 'Save, watch it settle, then start again.'}
          </output>
        </>
      );
    case 'icon-button':
      return <IconButtonExample />;
    case 'button-group':
      return <ButtonGroupExample />;
    case 'switch':
      return (
        <div className="opt-switch-demo">
          <O.Switch
            label="Ambient sound"
            description={
              checked ? 'A little atmosphere, on.' : 'Quiet, for now.'
            }
            checked={checked}
            onCheckedChange={setChecked}
          />
          <div
            className={`opt-sound-bars ${checked ? 'is-on' : ''}`}
            aria-hidden="true"
          >
            {Array.from({ length: 25 }, (_, i) => (
              <i
                key={i}
                style={{ height: `${12 + Math.sin(i * 0.7) ** 2 * 60}px` }}
              />
            ))}
          </div>
          <O.Switch
            label="Sound unavailable"
            description="Disabled state"
            disabled
          />
        </div>
      );
    case 'checkbox':
      return <CheckboxExample />;
    case 'radio-group':
      return (
        <O.RadioGroup
          label="Collection visibility"
          value={choice}
          onValueChange={(v) => setChoice(String(v))}
          options={[
            {
              value: 'Light studies',
              label: 'Just me',
              description: 'A private place to think.',
            },
            {
              value: 'team',
              label: 'My team',
              description: 'A shared work in progress.',
            },
            {
              value: 'everyone',
              label: 'Everyone',
              description: 'Ready to be discovered.',
            },
          ]}
        />
      );
    case 'slider':
      return (
        <>
          <div className="opt-example-object">
            <div
              className="opt-light-orb"
              style={{
                opacity: 0.25 + count / 140,
                transform: `scale(${0.7 + count / 170})`,
              }}
            />
          </div>
          <O.Slider
            label="Light intensity"
            value={count}
            onValueChange={(v) => setCount(Number(v))}
            unit="%"
            min={0}
            max={100}
          />
        </>
      );
    case 'range-slider':
      return (
        <>
          <div className="opt-example-range-art" aria-hidden="true">
            {Array.from({ length: 35 }, (_, i) => (
              <i
                key={i}
                style={{ height: `${15 + Math.sin(i * 0.35) ** 2 * 85}px` }}
              />
            ))}
          </div>
          <O.RangeSlider
            label="Selected interval"
            min={0}
            max={100}
            defaultValue={[24, 72]}
          />
          <p className="opt-example-note">Two ends. One considered range.</p>
        </>
      );
    case 'text-field':
      return (
        <form
          className="opt-example-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <O.TextField
            label="Collection name"
            placeholder="Give it a name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
            required
            minLength={3}
            maxLength={60}
            error={
              value.length > 0 && value.length < 3
                ? 'Use at least 3 characters.'
                : undefined
            }
            description="Something you will recognize later."
          />
          <O.Button type="submit">
            Create collection <ArrowRight />
          </O.Button>
          <output className="opt-example-status">
            {saved ? `“${value}” created in this preview.` : ''}
          </output>
        </form>
      );
    case 'textarea':
      return (
        <>
          <O.TextArea
            label="A note to yourself"
            placeholder="What caught your eye?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={280}
            description={`${value.length} / 280 characters`}
          />
          <O.Button
            variant="soft"
            onClick={() =>
              setNotice(
                value ? 'Note kept in this preview.' : 'Add a note first.',
              )
            }
          >
            Keep note
          </O.Button>
          {output}
        </>
      );
    case 'select':
      return (
        <>
          <O.Select
            label="Add to collection"
            options={options}
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          />
          <div className="opt-example-paper">
            <small>SELECTED COLLECTION</small>
            <h3>{choice}</h3>
            <span>08 considered pieces</span>
          </div>
        </>
      );
    case 'combobox':
      return (
        <>
          <O.Combobox
            label="Find a collection"
            items={projects}
            value={choice}
            onValueChange={(v) => setChoice(v || '')}
          />
          <output className="opt-example-status">
            {choice ? `Selected: ${choice}` : 'Nothing selected'}
          </output>
        </>
      );
    case 'number-field':
      return (
        <>
          <div className="opt-example-object">
            <strong className="opt-big-number">
              {count.toString().padStart(2, '0')}
              <small>EDITIONS</small>
            </strong>
          </div>
          <O.NumberField
            label="Edition size"
            min={1}
            max={99}
            value={count}
            onValueChange={(v) => setCount(v ?? 1)}
          />
        </>
      );
    case 'search-field': {
      const results = projects.filter((p) =>
        p.toLowerCase().includes(value.toLowerCase()),
      );
      return (
        <>
          <O.SearchField
            label="Search collections"
            value={value}
            onValueChange={setValue}
          />
          <ul className="opt-result-list">
            {results.map((p) => (
              <li key={p}>
                {p}
                <ArrowRight />
              </li>
            ))}
          </ul>
          <output className="opt-example-status">
            {results.length} collections found
          </output>
        </>
      );
    }
    case 'tabs':
      return (
        <O.Tabs
          items={[
            {
              value: 'overview',
              label: 'Overview',
              content: (
                <div className="opt-example-paper">
                  <small>COLLECTION / 001</small>
                  <h3>Light studies.</h3>
                  <p>A small collection of things worth a second look.</p>
                </div>
              ),
            },
            {
              value: 'details',
              label: 'Details',
              content: (
                <div className="opt-example-paper">
                  <small>THE DETAILS</small>
                  <h3>Eight pieces.</h3>
                  <p>Paper, light, and the space between them.</p>
                </div>
              ),
            },
            {
              value: 'activity',
              label: 'Activity',
              content: (
                <div className="opt-example-paper">
                  <small>RECENTLY</small>
                  <h3>A new addition.</h3>
                  <p>“Soft geometry” joined the collection.</p>
                </div>
              ),
            },
          ]}
        />
      );
    case 'segmented-control':
      return (
        <>
          <O.SegmentedControl
            label="View density"
            value={choice}
            onValueChange={(v) => setChoice(String(v))}
            options={[
              { value: 'Light studies', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
          <div
            className={`opt-density-preview ${choice === 'compact' ? 'is-compact' : ''}`}
          >
            {projects.slice(0, 3).map((p, i) => (
              <div key={p}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {p}
              </div>
            ))}
          </div>
        </>
      );
    case 'accordion':
      return (
        <O.Accordion
          defaultValue={['materials']}
          items={[
            {
              value: 'materials',
              title: 'What makes it Optical?',
              content:
                'Light reveals the edge. Depth separates the layers. Motion explains the change. Every material has a job.',
            },
            {
              value: 'motion',
              title: 'Can I reduce the motion?',
              content:
                'Yes. Every component respects your operating system’s reduced-motion preference.',
            },
            {
              value: 'source',
              title: 'Can I use it in my project?',
              content:
                'Download the source, bring the shared tokens into your app, and connect the controls to your own state.',
            },
          ]}
        />
      );
    case 'breadcrumbs':
      return (
        <>
          <O.Breadcrumbs
            items={[
              { label: 'Library', href: '/opticalui' },
              { label: 'Collections', href: '/opticalui?q=collection' },
              { label: 'Light studies' },
            ]}
          />
          <div className="opt-example-paper">
            <small>YOU ARE HERE</small>
            <h3>Light studies.</h3>
            <p>A clear path back, wherever you wander.</p>
          </div>
        </>
      );
    case 'pagination':
      return (
        <>
          <div className="opt-example-paper">
            <small>COLLECTION / 0{page}</small>
            <h3>{projects[page - 1]}</h3>
            <p>Page {page} of 5</p>
          </div>
          <O.Pagination page={page} total={5} onPageChange={setPage} />
        </>
      );
    case 'data-table':
      return (
        <O.DataTable
          caption="Studio archive"
          columns={[
            { key: 'name', label: 'Collection' },
            { key: 'pieces', label: 'Pieces' },
            { key: 'status', label: 'Status' },
          ]}
          rows={[
            { id: 1, name: 'Light studies', pieces: 8, status: 'Ready' },
            { id: 2, name: 'Common ground', pieces: 12, status: 'Draft' },
            { id: 3, name: 'After hours', pieces: 6, status: 'Ready' },
            { id: 4, name: 'Soft geometry', pieces: 4, status: 'Draft' },
          ]}
        />
      );
    case 'command-menu':
      return (
        <>
          <div className="opt-example-object">
            <Search className="opt-hero-icon" />
          </div>
          <O.CommandMenu
            commands={[
              'Create collection',
              'Open archive',
              'View settings',
              'Export selected',
            ].map((label) => ({
              label,
              run: () => setNotice(`${label} selected.`),
            }))}
          />
          {output}
        </>
      );
    case 'toast':
      return (
        <O.ToastProvider>
          <ToastExample />
        </O.ToastProvider>
      );
    case 'alert':
      return (
        <>
          {visible ? (
            <O.Alert
              title="A little room for improvement."
              onDismiss={() => setVisible(false)}
              action={
                <O.Button
                  variant="ghost"
                  onClick={() => setNotice('Review opened in this preview.')}
                >
                  Review details <ArrowRight />
                </O.Button>
              }
            >
              Three pieces are missing a description.
            </O.Alert>
          ) : (
            <O.Button variant="soft" onClick={() => setVisible(true)}>
              Show notice again
            </O.Button>
          )}
          {output}
        </>
      );
    case 'progress':
      return (
        <>
          <div className="opt-example-object">
            <div
              className="opt-progress-orbit"
              style={{
                background: `conic-gradient(var(--opt-accent) ${count}%,var(--opt-wash) 0)`,
              }}
            >
              <span>{count}%</span>
            </div>
          </div>
          <O.Progress label="Preparing your collection" value={count} />
          <O.Button
            variant="soft"
            onClick={() =>
              setCount(count >= 100 ? 0 : Math.min(100, count + 17))
            }
          >
            {count >= 100 ? 'Start again' : 'Advance progress'} <ArrowRight />
          </O.Button>
        </>
      );
    case 'skeleton':
      return (
        <>
          <div
            className="opt-example-skeleton"
            aria-busy={loading}
            aria-label={loading ? 'Loading collection' : 'Collection loaded'}
          >
            {loading ? (
              <>
                <O.Skeleton style={{ height: 120 }} />
                <O.Skeleton style={{ width: '72%' }} />
                <O.Skeleton style={{ width: '48%' }} />
              </>
            ) : (
              <div className="opt-example-paper">
                <small>LOADED / 001</small>
                <h3>Worth the wait.</h3>
                <p>The same space, filled with meaning.</p>
              </div>
            )}
          </div>
          <O.Button variant="soft" onClick={() => setLoading(!loading)}>
            {loading ? 'Reveal content' : 'Show loading state'}
          </O.Button>
        </>
      );
    case 'badge':
      return (
        <>
          <div className="opt-example-row">
            <O.Badge>In progress</O.Badge>
            <O.Badge tone="success">Ready</O.Badge>
            <O.Badge tone="neutral">Archived</O.Badge>
            {visible && (
              <O.Badge onRemove={() => setVisible(false)}>Selected</O.Badge>
            )}
          </div>
          {!visible && (
            <O.Button variant="soft" onClick={() => setVisible(true)}>
              Restore selection
            </O.Button>
          )}
          <p className="opt-example-note">
            Status stays legible without relying on color.
          </p>
        </>
      );
    case 'avatar':
      return (
        <>
          <div className="opt-example-row">
            <O.Avatar name="Alex Reed" size={64} />
            <O.Avatar name="Sam Chen" size={64} />
            <O.Avatar name="Jo Ellis" size={64} />
          </div>
          <div className="opt-example-paper">
            <small>THE PEOPLE BEHIND IT</small>
            <h3>A shared point of view.</h3>
            <p>Initials remain when an image is unavailable.</p>
          </div>
        </>
      );
    case 'tooltip':
      return (
        <>
          <div className="opt-example-row">
            <O.Tooltip content="Adjust the atmosphere">
              <Settings /> Settings
            </O.Tooltip>
            <O.Tooltip content="Sound is currently muted">
              <Volume2 /> Sound
            </O.Tooltip>
          </div>
          <p className="opt-example-note">Hover or use Tab to focus a hint.</p>
        </>
      );
    case 'popover':
      return (
        <>
          <div className="opt-example-object">
            <div className="opt-layer-object">
              <i />
              <i />
              <i />
            </div>
          </div>
          <O.Popover trigger="Collection details" title="Light studies">
            <p>Eight pieces. Collected slowly.</p>
            <div className="opt-example-row" style={{ marginTop: 20 }}>
              <O.Badge>Edition 001</O.Badge>
              <O.Avatar name="Alex Reed" size={32} />
            </div>
          </O.Popover>
        </>
      );
    case 'dialog':
      return (
        <>
          <div className="opt-example-object">
            <div className="opt-layer-object">
              <i />
              <i />
              <i />
            </div>
          </div>
          <O.Dialog
            trigger="Name a collection"
            title="Make room for something."
            description="Give this collection a name. You can change it later."
          >
            <div className="opt-example-stack">
              <O.TextField
                label="Collection name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="A good name"
              />
              <O.Button
                onClick={() =>
                  setNotice(
                    value
                      ? `“${value}” saved in this preview.`
                      : 'Enter a collection name.',
                  )
                }
              >
                Save name <Check />
              </O.Button>
              {output}
            </div>
          </O.Dialog>
        </>
      );
    case 'drawer':
      return (
        <>
          <div className="opt-example-paper">
            <small>COLLECTION / 001</small>
            <h3>Light studies.</h3>
            <p>Keep the collection in view while you adjust its details.</p>
          </div>
          <O.Drawer
            trigger="Edit details"
            title="A few finishing touches."
            description="Make the collection your own."
          >
            <div className="opt-example-stack">
              <O.TextField label="Name" defaultValue="Light studies" />
              <O.TextArea
                label="Description"
                defaultValue="A study in light, shade, and the space between."
              />
              <O.Switch label="Allow comments" defaultChecked />
            </div>
          </O.Drawer>
        </>
      );
    case 'dropdown-menu':
      return (
        <>
          <div className="opt-example-paper">
            <small>SELECTED / 008</small>
            <h3>Light studies.</h3>
            <p>Everything you need, close at hand.</p>
          </div>
          <O.DropdownMenu
            label="Collection actions"
            items={[
              {
                label: 'Rename collection',
                onClick: () => setNotice('Rename selected.'),
              },
              {
                label: 'Duplicate collection',
                onClick: () => setNotice('A copy was made in this preview.'),
              },
              {
                label: 'Export collection',
                onClick: () => setNotice('Export selected.'),
              },
              {
                label: 'Archive collection',
                disabled: true,
                onClick: () => {},
              },
            ]}
          />
          {output}
        </>
      );
    default:
      return null;
  }
}
/** Shared specimen: the gallery and opened preview render the same controls. */
export function FoundationExampleContent({ name }: { name: string }) {
  return (
    <div className="opt-example-content">
      <ExampleBody name={name} />
    </div>
  );
}

export default function FoundationExample({ name }: { name: string }) {
  const info = catalog.find((row) => row[0] === name);
  return (
    <section
      className="opt-foundation-example"
      aria-label={`${info?.[1] || name} example`}
    >
      <header>
        <span>
          {info?.[2]} / {info?.[3]}
        </span>
        <h2>{info?.[1]}</h2>
      </header>
      <FoundationExampleContent name={name} />
    </section>
  );
}
