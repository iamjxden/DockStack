import React, { useEffect, useMemo, useState } from 'react';
import { CaptureTable } from '../../components/CaptureTable';
import { DatasetList } from '../../components/DatasetList';
import { DatasetPreview } from '../../components/DatasetPreview';
import { Panel } from '../../components/Panel';
import { RequestDetail } from '../../components/RequestDetail';
import { SessionList } from '../../components/SessionList';
import { StatsCards } from '../../components/StatsCards';
import { SENSITIVE_NOTICE } from '../../lib/consent';
import { detectDatasets, type DatasetCandidate } from '../../lib/dataset';
import { copyText, downloadTextFile } from '../../lib/download';
import { nativeApi } from '../../lib/native';
import { getSettings } from '../../lib/settings';
import { summarizeCaptures } from '../../lib/summary';
import { startSession, stopSession } from '../../lib/session';
import { getCurrentSession, getTermsAccepted, listRecentCaptures, listSessions, setTermsAccepted } from '../../lib/storage';
import type { CaptureKind, CaptureRecord, CaptureSession } from '../../lib/types';

export default function App() {
  const [currentSession, setCurrentSessionState] = useState<CaptureSession | null>(null);
  const [storedSessions, setStoredSessions] = useState<CaptureSession[]>([]);
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [selectedCapture, setSelectedCapture] = useState<CaptureRecord | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<DatasetCandidate | null>(null);
  const [scope, setScope] = useState<CaptureSession['scope']>('domain');
  const [sensitiveMode, setSensitiveMode] = useState(false);
  const [termsAccepted, setTermsAcceptedState] = useState(false);
  const [nativeStatus, setNativeStatus] = useState('checking');
  const [exportStatus, setExportStatus] = useState<string>('');
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | CaptureKind>('all');

  const filteredCaptures = useMemo(() => {
    return captures.filter((capture) => {
      const matchesKind = kindFilter === 'all' || capture.kind === kindFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || capture.url.toLowerCase().includes(query) || capture.method.toLowerCase().includes(query);
      return matchesKind && matchesSearch;
    });
  }, [captures, kindFilter, search]);

  const datasets = useMemo(() => detectDatasets(filteredCaptures), [filteredCaptures]);
  const summary = useMemo(() => summarizeCaptures(filteredCaptures), [filteredCaptures]);

  async function refresh() {
    const settings = await getSettings();
    const nextCurrentSession = await getCurrentSession();
    const nextStoredSessions = await listSessions();
    const nextCaptures = await listRecentCaptures();
    setCurrentSessionState(nextCurrentSession);
    setStoredSessions(nextStoredSessions);
    setCaptures(nextCaptures.slice(0, settings.captureRetentionLimit));
    setScope(settings.defaultScope);
    setTermsAcceptedState(await getTermsAccepted());
    const ping = await nativeApi.init();
    setNativeStatus(ping.ok ? 'connected' : 'fallback');
    setSelectedCapture((prev) => nextCaptures.find((capture) => capture.id === prev?.id) ?? nextCaptures[0] ?? null);
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!selectedDataset && datasets.length > 0) setSelectedDataset(datasets[0]);
    if (selectedDataset && !datasets.find((dataset) => dataset.captureId === selectedDataset.captureId)) {
      setSelectedDataset(datasets[0] ?? null);
    }
  }, [datasets, selectedDataset]);

  async function handleStart() {
    if (sensitiveMode && !termsAccepted) return;
    await startSession(scope, sensitiveMode, termsAccepted);
    setExportStatus('');
    await refresh();
  }

  async function handleStop() {
    await stopSession();
    await refresh();
  }

  async function handleExport(format: 'json' | 'csv') {
    if (!currentSession) return;
    const result = await nativeApi.exportSession(currentSession.id, format);
    const exportPath = (result.data as { path?: string } | undefined)?.path ?? '';
    setExportStatus(result.ok ? `exported ${format}: ${exportPath}` : `export failed: ${result.error}`);
  }

  async function handleAnalyze() {
    if (datasets.length === 0) {
      setAnalysisStatus('no dataset candidate available yet');
      return;
    }
    const result = await nativeApi.analyzeWithOllama(
      'Summarize the likely dataset, suggest a human-friendly dataset name, and identify the most useful fields.',
      selectedDataset ?? datasets[0],
    );
    setAnalysisStatus(result.ok ? String((result.data as any)?.output ?? 'analysis complete') : `analysis failed: ${result.error}`);
  }

  async function handleCopyCapture() {
    if (!selectedCapture) return;
    await copyText(JSON.stringify(selectedCapture, null, 2));
    setExportStatus('copied selected capture as JSON');
  }

  function handleDownloadCapture() {
    if (!selectedCapture) return;
    downloadTextFile(`dockstack-capture-${selectedCapture.id}.json`, JSON.stringify(selectedCapture, null, 2), 'application/json;charset=utf-8');
    setExportStatus('downloaded selected capture JSON');
  }

  function handleDownloadDataset() {
    if (!selectedDataset) return;
    downloadTextFile(`dockstack-dataset-${selectedDataset.captureId}.json`, JSON.stringify(selectedDataset.previewRows, null, 2), 'application/json;charset=utf-8');
    setExportStatus('downloaded dataset preview JSON');
  }

  return (
    <div style={{ width: 700, padding: 16, background: '#0b0f14', color: '#f4f7fb', minHeight: 840, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>DockStack</h1>
      <p style={{ opacity: 0.84, marginTop: 0 }}>
        Local-first capture, structured extraction, storage, and export workspace.
      </p>

      <Panel title="Capture Overview">
        <StatsCards summary={summary} />
      </Panel>

      <div style={{ height: 12 }} />

      <Panel title="Capture Control">
        <div style={{ display: 'grid', gap: 10 }}>
          <label>
            Scope:&nbsp;
            <select value={scope} onChange={(e) => setScope(e.target.value as CaptureSession['scope'])}>
              <option value="tab">Current tab</option>
              <option value="domain">Current domain</option>
              <option value="workspace">Workspace</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={sensitiveMode} onChange={(e) => setSensitiveMode(e.target.checked)} /> Enable sensitive capture
          </label>
          {sensitiveMode && (
            <div style={{ border: '1px solid #6a4f00', padding: 10, borderRadius: 8, background: '#1f1804' }}>
              <p style={{ marginTop: 0 }}>{SENSITIVE_NOTICE}</p>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={async (e) => {
                    await setTermsAccepted(e.target.checked);
                    setTermsAcceptedState(e.target.checked);
                  }}
                /> I understand and accept the sensitive capture terms.
              </label>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button onClick={handleStart} disabled={Boolean(currentSession)} style={{ padding: '10px 12px' }}>Start</button>
            <button onClick={handleStop} disabled={!currentSession} style={{ padding: '10px 12px' }}>Stop</button>
            <button onClick={() => handleExport('json')} disabled={!currentSession} style={{ padding: '10px 12px' }}>Export JSON</button>
            <button onClick={() => handleExport('csv')} disabled={!currentSession} style={{ padding: '10px 12px' }}>Export CSV</button>
            <button onClick={handleAnalyze} style={{ padding: '10px 12px' }}>Analyze</button>
            <button onClick={refresh} style={{ padding: '10px 12px' }}>Refresh</button>
          </div>
          <small>Native core: {nativeStatus}</small>
          {currentSession && <small>Active session: {currentSession.id}</small>}
          {exportStatus && <small>{exportStatus}</small>}
          {analysisStatus && <small style={{ whiteSpace: 'pre-wrap' }}>{analysisStatus}</small>}
        </div>
      </Panel>

      <div style={{ height: 12 }} />

      <Panel title="Capture Filters">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search URL or method"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220 }}
          />
          <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as 'all' | CaptureKind)}>
            <option value="all">All kinds</option>
            <option value="fetch">fetch</option>
            <option value="xhr">xhr</option>
            <option value="devtools">devtools</option>
            <option value="websocket">websocket</option>
          </select>
          <button onClick={() => { setSearch(''); setKindFilter('all'); }}>Clear</button>
        </div>
      </Panel>

      <div style={{ height: 12 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Panel title="Detected Datasets">
          <DatasetList datasets={datasets} selectedCaptureId={selectedDataset?.captureId} onSelect={setSelectedDataset} />
        </Panel>
        <Panel title="Dataset Preview">
          <DatasetPreview dataset={selectedDataset} />
          <div style={{ marginTop: 10 }}>
            <button onClick={handleDownloadDataset} disabled={!selectedDataset}>Download Preview JSON</button>
          </div>
        </Panel>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Panel title="Recent Captures">
          <CaptureTable captures={filteredCaptures} selectedCaptureId={selectedCapture?.id} onSelect={setSelectedCapture} />
        </Panel>
        <Panel title="Request Detail Inspector">
          <RequestDetail capture={selectedCapture} />
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleCopyCapture} disabled={!selectedCapture}>Copy Capture JSON</button>
            <button onClick={handleDownloadCapture} disabled={!selectedCapture}>Download Capture JSON</button>
          </div>
        </Panel>
      </div>

      <div style={{ height: 12 }} />

      <Panel title="Session History">
        <SessionList sessions={storedSessions} />
      </Panel>
    </div>
  );
}
