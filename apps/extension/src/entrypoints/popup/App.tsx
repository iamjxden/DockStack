import React, { useEffect, useState } from 'react';
import { CaptureTable } from '../../components/CaptureTable';
import { Panel } from '../../components/Panel';
import { SENSITIVE_NOTICE } from '../../lib/consent';
import { nativeApi } from '../../lib/native';
import { startSession, stopSession } from '../../lib/session';
import { getCurrentSession, getTermsAccepted, listRecentCaptures, setTermsAccepted } from '../../lib/storage';
import type { CaptureRecord, CaptureSession } from '../../lib/types';

export default function App() {
  const [currentSession, setCurrentSessionState] = useState<CaptureSession | null>(null);
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [scope, setScope] = useState<CaptureSession['scope']>('domain');
  const [sensitiveMode, setSensitiveMode] = useState(false);
  const [termsAccepted, setTermsAcceptedState] = useState(false);
  const [nativeStatus, setNativeStatus] = useState('checking');

  async function refresh() {
    setCurrentSessionState(await getCurrentSession());
    setCaptures(await listRecentCaptures());
    setTermsAcceptedState(await getTermsAccepted());
    const ping = await nativeApi.init();
    setNativeStatus(ping.ok ? 'connected' : 'fallback');
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStart() {
    if (sensitiveMode && !termsAccepted) return;
    await startSession(scope, sensitiveMode, termsAccepted);
    await refresh();
  }

  async function handleStop() {
    await stopSession();
    await refresh();
  }

  return (
    <div style={{ width: 520, padding: 16, background: '#0b0f14', color: '#f4f7fb', minHeight: 640, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>DockStack</h1>
      <p style={{ opacity: 0.8 }}>DevTools-grade local capture, extraction, and export workspace.</p>

      <Panel title="Capture Control">
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            Scope:&nbsp;
            <select value={scope} onChange={(e) => setScope(e.target.value as CaptureSession['scope'])}>
              <option value="tab">Current tab</option>
              <option value="domain">Current domain</option>
              <option value="workspace">Workspace</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={sensitiveMode} onChange={(e) => setSensitiveMode(e.target.checked)} /> Enable sensitive capture
          </label>
          {sensitiveMode && (
            <div style={{ border: '1px solid #6a4f00', padding: 10, borderRadius: 8, background: '#1f1804' }}>
              <p style={{ marginTop: 0 }}>{SENSITIVE_NOTICE}</p>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={async (e) => {
                    await setTermsAccepted(e.target.checked);
                    setTermsAcceptedState(e.target.checked);
                  }}
                /> I understand and accept the sensitive capture terms.
              </label>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleStart} disabled={Boolean(currentSession)} style={{ padding: '10px 12px' }}>Start</button>
            <button onClick={handleStop} disabled={!currentSession} style={{ padding: '10px 12px' }}>Stop</button>
            <button onClick={refresh} style={{ padding: '10px 12px' }}>Refresh</button>
          </div>
          <small>Native core: {nativeStatus}</small>
          {currentSession && <small>Active session: {currentSession.id}</small>}
        </div>
      </Panel>

      <div style={{ height: 12 }} />

      <Panel title="Recent Captures">
        <CaptureTable captures={captures} />
      </Panel>
    </div>
  );
}
