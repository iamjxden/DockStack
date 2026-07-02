import React from 'react';

export function Panel(props: React.PropsWithChildren<{ title: string }>) {
  return (
    <section style={{ border: '1px solid #2b2f3a', borderRadius: 12, padding: 12, background: '#11151d' }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>{props.title}</h3>
      {props.children}
    </section>
  );
}
