import React from 'react';
import ReactDOM from 'react-dom/client';

function Options() {
  return <div style={{ padding: 24, fontFamily: 'sans-serif' }}><h1>DockStack Settings</h1><p>Configuration, policy, and storage controls will live here.</p></div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Options />);
