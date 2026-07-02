import React from 'react';
import type { CaptureSession } from '../lib/types';

export function SessionList({ sessions }: { sessions: CaptureSession[] }) {
  if (sessions.length === 0) return <p style={{ margin: 0, opacity: 0.8 }}>No stored sessions yet.</p>;
  return (
    <div style={{ display: 'grid', gap: 8, maxHeight: 220, overflow: 'auto' }}>
      {sessions.map((session) => (
        <div key={session.id} style={{ border: '1px solid #243244', borderRadius: 10, padding: 10, background: '#0c131c' }}>
          <div style={{ fontWeight: 700 }}>{session.scope} session</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{session.id}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>started: {new Date(session.startedAt).toLocaleString()}</div>
          <div style={{ fontSize: 12 }}>sensitive: {session.sensitiveMode ? 'yes' : 'no'}</div>
        </div>
      ))}
    </div>
  );
}
