import React from 'react';
import type { CaptureRecord } from '../lib/types';

export function CaptureTable({ captures }: { captures: CaptureRecord[] }) {
  return (
    <div style={{ overflow: 'auto', maxHeight: 280 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th align="left">Kind</th>
            <th align="left">Method</th>
            <th align="left">Status</th>
            <th align="left">URL</th>
          </tr>
        </thead>
        <tbody>
          {captures.map((capture) => (
            <tr key={capture.id}>
              <td>{capture.kind}</td>
              <td>{capture.method}</td>
              <td>{capture.status ?? '-'}</td>
              <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{capture.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
