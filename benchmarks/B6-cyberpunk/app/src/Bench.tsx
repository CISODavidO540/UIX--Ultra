import {useEffect, useState} from 'react';
import AiChat, {type RunState} from './AiChat';

// The agent pieces Astryx's ai-chat template lacks (agent-chat playbook):
// authorization bar, stop, deck plate with status + context meter, and
// empty / loading / error states.
export function DirectedApp({initial}: {initial: RunState}) {
  const [state, setState] = useState<RunState>(initial);
  const [note, setNote] = useState('');
  const running = state === 'running';

  const authorize = () => { setState('running'); setNote(''); window.setTimeout(() => setState((s) => (s === 'running' ? 'done' : s)), 1400); };
  const deny = () => { setState('done'); setNote('Not pushed. The branch stays local in the sandbox.'); };
  const stop = () => { if (running) { setState('attention'); setNote('Stopped. Work so far is kept.'); } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && running) stop();
      if (e.key === 'Enter' && state === 'attention' && document.activeElement === document.body) authorize();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const hasRun = state !== 'empty' && state !== 'loading';
  const lamp = state === 'error' ? ['idle', 'Paused'] : running ? ['live', 'Running'] : state === 'attention' ? ['attn', 'Needs you'] : hasRun ? ['ok', 'Done'] : ['idle', 'Idle'];

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100dvh'}}>
      <header className="deck-plate" data-attn={state === 'attention' || undefined}>
        <h1 className="designator">Hermes</h1>
        {hasRun && <span className="serial">RUN 7F3A · SANDBOX run-7f3a<br />fix/token-refresh</span>}
        {hasRun && (
          <div className="meter" role="meter" aria-label="Context used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={9}>
            <span>Context <b>18.4k</b> / 200k</span>
            <span className="segs" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} className={i < 1 ? 'on' : ''} />)}</span>
          </div>
        )}
        <div className="lamps" role="status">
          <span className={`lamp ${state === 'error' ? 'fail' : 'ok'}`}>{state === 'error' ? 'Link down' : 'Link'}</span>
          <span className={`lamp ${lamp[0]}`}>{lamp[1]}</span>
        </div>
      </header>
      <div style={{flex: 1, minHeight: 0}}>
        <AiChat
          key={hasRun ? 'run' : state}
          state={state}
          agentAvatar={<span className="agent-plate" role="img" aria-label="Hermes">HM</span>}
          aboveComposer={
            <>
              {state === 'attention' && (
                <div className="auth-bar" role="region" aria-label="Authorization required">
                  <p className="what"><span className="tag">Authorization required · step 2</span><code>git push origin fix/token-refresh</code> · 1 commit · does not touch main</p>
                  <button type="button" className="key authorize" onClick={authorize}>Authorize<kbd>Enter</kbd></button>
                  <button type="button" className="key" onClick={deny}>Deny</button>
                </div>
              )}
              {running && (
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button type="button" className="key" onClick={stop}>Stop<kbd>Esc</kbd></button>
                </div>
              )}
              {note && <p className="status-line" role="status">{note}</p>}
            </>
          }
          banner={state === 'error' ? (
            <div className="run-banner" role="alert">
              <p>Link to hermes-pop lost. The run is paused and nothing was pushed.</p>
              <button type="button" className="key" onClick={() => setState('attention')}>Retry</button>
            </div>
          ) : null}
          emptyView={
            <section className="empty-view" aria-labelledby="empty-h">
              <h2 id="empty-h">No run loaded</h2>
              <p>Give Hermes a task below. Anything that changes code or pushes waits for your authorization.</p>
              <div className="keys">
                <button type="button" className="key">Run tests, report failures</button>
                <button type="button" className="key">Check pve backups</button>
              </div>
            </section>
          }
          loadingView={<div aria-busy="true" aria-label="Loading run" style={{padding: '24px 8px'}}><div className="sk" style={{width: '40%'}} /><div className="sk" /><div className="sk" style={{width: '70%'}} /><div className="sk" style={{width: '55%'}} /></div>}
        />
      </div>
    </div>
  );
}
