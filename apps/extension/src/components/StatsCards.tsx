import React from 'react';
import type { CaptureSummary } from '../lib/summary';

export function StatsCards({ summary }: { summary: CaptureSummary }) {
  const cards = [
    ['Total captures', summary.total],
    ['JSON responses', summary.jsonCount],
    ['Errors', summary.errorCount],
    ['Hosts', summary.uniqueHostCount],
    ['Fetch', summary.fetchCount],
    ['XHR', summary.xhrCount],
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
      {cards.map(([label, value]) => (
        <div key={String(label)} style={{ border: '1px solid #223447', borderRadius: 10, background: '#0c131c', padding: 10 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.72 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
