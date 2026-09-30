'use client';
import { useCallback, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { ContextPocket, InterruptHandle, BranchFold, IntentLens, EvidencePeel, HandoffLatch, MotionSettingsContext } from './components/studies';
import { Optics, Instrument, Folio, Contour, Trace, Field } from './components/explorations';
import { ContextFan } from './components/context-fan';
import { BranchGraph } from './components/branch-graph';
import './components/studies.css';
const components = { optics: Optics, instrument: Instrument, folio: Folio, contour: Contour, trace: Trace, field: Field, context: ContextPocket, interrupt: InterruptHandle, branch: BranchFold, intent: IntentLens, evidence: EvidencePeel, handoff: HandoffLatch, 'context-fan': ContextFan, 'branch-graph': BranchGraph };
export type OpticalExampleName = keyof typeof components;
export function OpticalExample({ name = 'context' }: { name?: OpticalExampleName }) {
  const reduced = !!useReducedMotion();
  const [status, setStatus] = useState('');
  const report = useCallback((value: string) => setStatus(value), []);
  const Component = components[name];
  return <div className="ui-demo"><MotionSettingsContext.Provider value={{ tempo: 1, reduced }}><MotionConfig reducedMotion={reduced ? 'always' : 'never'}><div className="ui-demo-object"><Component report={report} /></div><span className="sr-only" role="status">{status}</span></MotionConfig></MotionSettingsContext.Provider></div>;
}

export * from './system';
export * from './system/advanced';
export { default as FoundationExample } from './system/examples';
export { default as AdvancedExample } from './system/advanced';

export { ContextPocket, InterruptHandle, BranchFold, IntentLens, EvidencePeel, HandoffLatch } from './components/studies';
export { Optics, Instrument, Folio, Contour, Trace, Field } from './components/explorations';
export { ContextFan } from './components/context-fan';
export { BranchGraph } from './components/branch-graph';
