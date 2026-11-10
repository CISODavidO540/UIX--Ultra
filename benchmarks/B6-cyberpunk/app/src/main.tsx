import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
import './fonts.css';
import './netrunner.css';
import './naive.css';
import './directed.css';
import './nightcity-theme.css';
import './nightcity.css';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import AiChat, {type RunState} from './AiChat';
import {DirectedApp} from './Bench';
import {NightCityApp} from './NightCity';

// ?variant=stock|naive|directed  ?mode=dark|light  ?state=attention|running|done|error|empty|loading
const q = new URLSearchParams(location.search);
const variant = q.get('variant') ?? 'directed';
const mode = variant === 'nightcity' ? 'dark' : ((q.get('mode') as 'light' | 'dark' | null) ?? 'dark'); // Night City is dark-only (Gothic precedent)
const state = (q.get('state') as RunState | null) ?? 'attention';
document.documentElement.dataset.bench = variant;
document.title = `B6 cyberpunk · ${variant}`;

createRoot(document.getElementById('root')!).render(
  <Theme theme={neutralTheme} mode={mode}>
    {variant === 'nightcity' ? <NightCityApp initial={state} /> : variant === 'directed' ? <DirectedApp initial={state} /> : <div style={{height: '100dvh'}}><AiChat state="running" /></div>}
  </Theme>,
);
