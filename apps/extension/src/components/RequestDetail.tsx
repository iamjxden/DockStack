import React from 'react';
import type { CaptureRecord } from '../lib/types';

function pretty(value: unknown) {
  if (value == null) return '';
  try {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return JSON.stringify(JSON.parse(value), null, 2);
      }
      return value;
    }
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function RequestDetail({ capture }: { capture: CaptureRecord | null }) {
  if (!capture) {
    return <p style={{ margin: 0, opacity: 0.8 }}>Select a capture to inspect full request and response details.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div><strong>{capture.method}</strong> {capture.url}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>kind: {capture.kind} · status: {capture.status ?? '-'} · content-type: {capture.contentType ?? '-'}</div>
      <div>
        <strong>Request Headers</strong>
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 140, background: '#091018', padding: 10, borderRadius: 8 }}>{pretty(capture.requestHeaders)}</pre>
      </div>
      <div>
        <strong>Response Headers</strong>
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 140, background: '#091018', padding: 10, borderRadius: 8 }}>{pretty(capture.responseHeaders)}</pre>
      </div>
      <div>
        <strong>Request Body</strong>
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 140, background: '#091018', padding: 10, borderRadius: 8 }}>{pretty(capture.requestBody)}</pre>
      </div>
      <div>
        <strong>Response Body</strong>
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 220, background: '#091018', padding: 10, borderRadius: 8 }}>{pretty(capture.responseBody)}</pre>
      </div>
    </div>
  );
}
