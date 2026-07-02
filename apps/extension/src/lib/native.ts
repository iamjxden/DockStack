import type { CaptureRecord, CaptureSession, NativeRequest, NativeResponse } from './types';

const HOST = 'io.dockstack.core';

async function sendNative<TPayload, TResponse>(kind: string, payload: TPayload): Promise<NativeResponse<TResponse>> {
  try {
    const message: NativeRequest<TPayload> = { kind, payload };
    const response = await chrome.runtime.sendNativeMessage(HOST, message);
    return response as NativeResponse<TResponse>;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Native messaging unavailable' };
  }
}

export const nativeApi = {
  init() {
    return sendNative('ping', { source: 'extension' });
  },
  startSession(session: CaptureSession) {
    return sendNative('start_session', session);
  },
  stopSession(sessionId: string) {
    return sendNative('stop_session', { sessionId });
  },
  ingestCapture(record: CaptureRecord) {
    return sendNative('ingest_capture', record);
  },
  listSessions() {
    return sendNative('list_sessions', {});
  },
  listCaptures(sessionId?: string) {
    return sendNative('list_captures', { sessionId });
  },
  exportSession(sessionId: string, format: 'json' | 'csv') {
    return sendNative('export_session', { sessionId, format });
  },
  analyzeWithOllama(prompt: string, context: unknown) {
    return sendNative('ollama_analyze', { prompt, context });
  },
};
