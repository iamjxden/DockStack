import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { defaultSettings, getSettings, saveSettings } from '../../lib/settings';
import type { ExtensionSettings } from '../../lib/types';

function Field(props: React.PropsWithChildren<{ label: string; description?: string }>) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontWeight: 700 }}>{props.label}</span>
      {props.children}
      {props.description && <span style={{ fontSize: 12, opacity: 0.72 }}>{props.description}</span>}
    </label>
  );
}

function Options() {
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function persist(next: ExtensionSettings) {
    setSettings(next);
    await saveSettings(next);
    setStatus('Saved');
    setTimeout(() => setStatus(''), 1200);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 860, margin: '0 auto', color: '#f4f7fb', background: '#0b0f14', minHeight: '100vh' }}>
      <h1>DockStack Settings</h1>
      <p style={{ opacity: 0.8 }}>
        Configure the default extension behavior, local AI endpoint, and storage-related preferences.
      </p>
      <div style={{ display: 'grid', gap: 18 }}>
        <Field label="Default capture scope" description="Used as the preselected scope in the popup.">
          <select value={settings.defaultScope} onChange={(e) => persist({ ...settings, defaultScope: e.target.value as ExtensionSettings['defaultScope'] })}>
            <option value="tab">Current tab</option>
            <option value="domain">Current domain</option>
            <option value="workspace">Workspace</option>
          </select>
        </Field>
        <Field label="Local capture retention limit" description="Controls how many recent capture records remain in extension-local storage.">
          <input type="number" min={50} max={5000} value={settings.captureRetentionLimit} onChange={(e) => persist({ ...settings, captureRetentionLimit: Number(e.target.value) || 200 })} />
        </Field>
        <Field label="Ollama endpoint" description="Local endpoint used for analysis requests.">
          <input type="text" value={settings.ollamaUrl} onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })} onBlur={() => persist(settings)} />
        </Field>
        <Field label="Ollama model" description="Model name sent to the native core for local analysis requests.">
          <input type="text" value={settings.ollamaModel} onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })} onBlur={() => persist(settings)} />
        </Field>
        <Field label="Auto refresh popup" description="Refresh capture lists automatically whenever the popup loads.">
          <input type="checkbox" checked={settings.autoRefreshPopup} onChange={(e) => persist({ ...settings, autoRefreshPopup: e.target.checked })} />
        </Field>
        <Field label="Mask secrets in UI" description="Keep masked values hidden in extension views by default.">
          <input type="checkbox" checked={settings.maskSecretsInUi} onChange={(e) => persist({ ...settings, maskSecretsInUi: e.target.checked })} />
        </Field>
      </div>
      {status && <p style={{ marginTop: 18, color: '#45e0a8' }}>{status}</p>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Options />);
