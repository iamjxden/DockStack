import React from 'react';
import type { DatasetCandidate } from '../lib/dataset';

export function DatasetList({ datasets }: { datasets: DatasetCandidate[] }) {
  if (datasets.length === 0) {
    return <p style={{ margin: 0, opacity: 0.8 }}>No structured dataset candidates detected yet.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {datasets.map((dataset) => (
        <div key={dataset.captureId} style={{ border: '1px solid #243244', borderRadius: 10, padding: 10, background: '#0c131c' }}>
          <div style={{ fontWeight: 700 }}>{dataset.kind}</div>
          <div style={{ fontSize: 12, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dataset.sourceUrl}</div>
          <div style={{ marginTop: 6, fontSize: 12 }}>rows: {dataset.recordCount}</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dataset.fields.map((field) => (
              <span key={field} style={{ fontSize: 11, background: '#152131', border: '1px solid #28405b', padding: '4px 6px', borderRadius: 999 }}>{field}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
