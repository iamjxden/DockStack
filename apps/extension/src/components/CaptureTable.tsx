import React from 'react';
import type { CaptureRecord } from '../lib/types';

interface CaptureTableProps {
  captures: CaptureRecord[];
  selectedCaptureId?: string | null;
  onSelect?: (capture: CaptureRecord) => void;
}

export function CaptureTable({ captures, selectedCaptureId, onSelect }: CaptureTableProps) {
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
          {captures.map((capture) => {
            const active = capture.id === selectedCaptureId;
            return (
              <tr
                key={capture.id}
                onClick={() => onSelect?.(capture)}
                style={{
                  cursor: 'pointer',
                  background: active ? '#162331' : 'transparent',
                  borderTop: '1px solid #1d2938',
                }}>
                <td>{capture.kind}</td>
                <td>{capture.method}</td>
                <td>{capture.status ?? '-'}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{capture.url}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
