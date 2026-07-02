import type { CaptureRecord, CaptureSession } from './types';

export function matchesScope(session: CaptureSession, captureUrl: string, pageUrl?: string | null, tabUrl?: string | null): boolean {
  if (session.scope === 'workspace') return true;
  const base = pageUrl || tabUrl || captureUrl;
  try {
    const capture = new URL(captureUrl, base);
    const source = new URL(base);
    if (session.scope === 'tab') return source.href === (pageUrl || tabUrl || source.href);
    if (session.scope === 'domain') return capture.hostname === source.hostname;
    return true;
  } catch {
    return true;
  }
}
