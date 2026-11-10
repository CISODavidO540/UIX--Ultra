import {useEffect, useState} from 'react';
import AiChat, {type RunState} from './AiChat';

// B6 v2 · "Night City" — same Astryx ai-chat frame and same pieces as v1,
// rebuilt from the 2077 menu references (see ../DIRECTION-v2.md).
export function NightCityApp({initial}: {initial: RunState}) {
  const [state, setState] = useState<RunState>(initial);
  const [note, setNote] = useState('');
  const [tab, setTab] = useState('Run');
  const running = state === 'running';
  const hasRun = state !== 'empty' && state !== 'loading';

  const authorize = () => { setState('running'); setNote(''); window.setTimeout(() => setState((s) => (s === 'running' ? 'done' : s)), 1400); };
  const deny = () => { setState('done'); setNote('Not pushed · branch stays local'); };
  const stop = () => { if (running) { setState('attention'); setNote('Stopped · work so far is kept'); } };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && running) stop();
      if (e.key === 'Enter' && state === 'attention' && document.activeElement === document.body) authorize();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100dvh'}}>
      <header className="nc-deck">
        <h1 className="nc-mark">Hermes</h1>
        <nav className="nc-tabs" aria-label="Main">
          {['Run', 'Sessions', 'Skills', 'Settings'].map((t) => (
            <button key={t} type="button" className="nc-tab" aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        {hasRun && (
          <div className="nc-stats" aria-label="Run facts">
            <div className="nc-stat"><b>18.4<small>K</small></b><span>context / 200k</span></div>
            <div className="nc-stat"><b>5</b><span>tool calls</span></div>
            <div className="nc-stat"><b>2:41</b><span>elapsed</span></div>
            <div className={`nc-stat ${state === 'attention' ? 'attn' : ''}`} role="status">
              <b>{state === 'attention' ? '1' : '0'}</b>
              <span>{state === 'attention' ? 'needs you' : running ? <span className="nc-live">running</span> : state === 'error' ? 'paused' : 'waiting'}</span>
            </div>
          </div>
        )}
        <span className="nc-micro" aria-hidden="true">{hasRun ? 'run 7f3a · sandbox run-7f3a · kernel isolated image · ' : 'no run · '}link hermes-pop</span>
      </header>
      <div style={{flex: 1, minHeight: 0}}>
        <AiChat
          key={hasRun ? 'run' : state}
          state={state}
          agentAvatar={<span className="nc-agent" role="img" aria-label="Hermes">HM</span>}
          aboveComposer={
            <>
              {state === 'attention' && (
                <div className="nc-notice" role="region" aria-label="Needs your authorization">
                  <span className="bang" aria-hidden="true">!</span>
                  <p className="what" style={{margin: 0}}><b>Authorization required · step 2</b><code>git push origin fix/token-refresh</code> · 1 commit · does not touch main</p>
                  <button type="button" className="nc-key go" onClick={authorize}>Authorize<kbd>Enter</kbd></button>
                  <button type="button" className="nc-key" onClick={deny}>Deny</button>
                </div>
              )}
              {state === 'error' && (
                <div className="nc-banner" role="alert"><b>Link lost</b><p>hermes-pop dropped the connection. The run is paused and nothing was pushed.</p><button type="button" className="nc-key" onClick={() => setState('attention')}>Retry</button></div>
              )}
              {state === 'done' && !note && <p className="nc-status" role="status">Pushed · origin/fix/token-refresh · open the PR when ready</p>}
              {running && <div className="nc-row"><button type="button" className="nc-key" onClick={stop}>Stop<kbd>Esc</kbd></button></div>}
              {note && <p className="nc-status" role="status">{note}</p>}
            </>
          }
          banner={null}
          emptyView={
            <section className="nc-empty" aria-labelledby="nc-empty-h">
              <h2 id="nc-empty-h">No run loaded</h2>
              <p>Give Hermes a job below. Anything that changes code or pushes waits for your authorization.</p>
              <div className="nc-row"><button type="button" className="nc-key">Run tests, report failures</button><button type="button" className="nc-key">Check pve backups</button></div>
            </section>
          }
          loadingView={<div aria-busy="true" aria-label="Loading run" style={{padding: '24px 8px'}}><div className="nc-sk" style={{width: '40%'}} /><div className="nc-sk" /><div className="nc-sk" style={{width: '70%'}} /><div className="nc-sk" style={{width: '55%'}} /></div>}
        />
      </div>
    </div>
  );
}
