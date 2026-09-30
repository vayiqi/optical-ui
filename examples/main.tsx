import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { OpticalProvider, FoundationExample, AdvancedExample, OpticalExample, type OpticalExampleName } from '../src';
import catalog from './catalog.json';
import './style.css';

function App() {
  const [selected, setSelected] = useState(() => {
    const requested = new URLSearchParams(location.search).get('component');
    return catalog.some(item => item.id === requested) ? requested! : 'button';
  });
  const item = catalog.find(item => item.id === selected)!;
  const index = catalog.indexOf(item);
  useEffect(() => { history.replaceState(null, '', `?component=${selected}`); }, [selected]);
  return (
    <OpticalProvider>
      <div className="examples-app">
        <aside className="examples-sidebar">
          <a className="examples-brand" href="https://deepcake.ai/opticalui">Optical UI</a>
          <label className="examples-mobile-picker">Component
            <select value={selected} onChange={event => setSelected(event.target.value)}>
              {catalog.map((entry, number) => <option key={entry.id} value={entry.id}>{String(number + 1).padStart(2, '0')} · {entry.name}</option>)}
            </select>
          </label>
          <nav className="examples-list" aria-label="Components">
            {catalog.map((entry, number) => <button type="button" key={entry.id} aria-current={entry.id === selected ? 'page' : undefined} onClick={() => setSelected(entry.id)}>
              <span>{String(number + 1).padStart(2, '0')}</span>{entry.name}
            </button>)}
          </nav>
          <a className="examples-home" href="https://deepcake.ai">By Deepcake ↗</a>
        </aside>
        <main className="examples-main">
          <header><h1>{item.name}</h1><span>{String(index + 1).padStart(2, '0')} / 60</span></header>
          <div className="examples-stage" key={item.id}>
            {item.id.startsWith('material-') ? <iframe title={`${item.name} example`} src={`/material/${item.id.slice(9)}.html?embedded=1`} />
              : item.type === 'control' ? <FoundationExample name={item.id} />
              : item.type === 'signature' ? <AdvancedExample name={item.id} />
              : <OpticalExample name={item.id as OpticalExampleName} />}
          </div>
          <footer><a href={`https://deepcake.ai/opticalui?component=${item.id}`}>View on Deepcake ↗</a><a href="https://github.com/vayiqi/optical-ui">Source on GitHub ↗</a></footer>
        </main>
      </div>
    </OpticalProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
