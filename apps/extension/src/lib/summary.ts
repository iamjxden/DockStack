import type { CaptureRecord } from './types';

export interface CaptureSummary {
  total: number;
  fetchCount: number;
  xhrCount: number;
  devtoolsCount: number;
  jsonCount: number;
  errorCount: number;
  uniqueHostCount: number;
}

export function summarizeCaptures(captures: CaptureRecord[]): CaptureSummary {
  const hosts = new Set<string>();
  let fetchCount = 0;
  let xhrCount = 0;
  let devtoolsCount = 0;
  let jsonCount = 0;
  let errorCount = 0;

  for (const capture of captures) {
    try {
      hosts.add(new URL(capture.url).hostname);
    } catch {}
    if (capture.kind === 'fetch') fetchCount += 1;
    if (capture.kind === 'xhr') xhrCount += 1;
    if (capture.kind === 'devtools') devtoolsCount += 1;
    if ((capture.contentType ?? '').toLowerCase().includes('json')) jsonCount += 1;
    if ((capture.status ?? 200) >= 400) errorCount += 1;
  }

  return {
    total: captures.length,
    fetchCount,
    xhrCount,
    devtoolsCount,
    jsonCount,
    errorCount,
    uniqueHostCount: hosts.size,
  };
}
