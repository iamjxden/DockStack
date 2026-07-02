import React from 'react';
import type { DatasetCandidate } from '../lib/dataset';

export function DatasetPreview({ dataset }: { dataset: DatasetCandidate | null }) {
  if (!dataset) {
    return <p style={{ margin: 0, opacity: 0.8 }}>Select a dataset candidate to preview structured rows.</p>;
  }

  const fields = dataset.fields;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontWeight: 700 }}>{dataset.kind}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{dataset.sourceUrl}</div>
      <div style={{ fontSize: 12 }}>rows detected: {dataset.recordCount}</div>
      <div style={{ overflow: 'auto', maxHeight: 240 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>{fields.map((field) => <th key={field} align="left">{field}</th>)}</tr>
          </thead>
          <tbody>
            {dataset.previewRows.map((row, idx) => (
              <tr key={idx} style={{ borderTop: '1px solid #1d2938' }}>
                {fields.map((field) => <td key={field} style={{ verticalAlign: 'top', paddingRight: 8 }}>{String(row[field] ?? '')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
