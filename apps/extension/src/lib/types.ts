export type CaptureKind = 'fetch' | 'xhr' | 'websocket' | 'devtools';

export interface CaptureRecord {
  id: string;
  sessionId: string;
  kind: CaptureKind;
  url: string;
  method: string;
  status?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string | null;
  responseBody?: string | null;
  contentType?: string | null;
  pageUrl?: string | null;
  createdAt: string;
}

export interface CaptureSession {
  id: string;
  startedAt: string;
  stoppedAt?: string | null;
  scope: 'tab' | 'domain' | 'workspace';
  sensitiveMode: boolean;
  termsAccepted: boolean;
}

export interface ExtensionSettings {
  defaultScope: CaptureSession['scope'];
  captureRetentionLimit: number;
  ollamaUrl: string;
  ollamaModel: string;
  autoRefreshPopup: boolean;
  maskSecretsInUi: boolean;
}

export interface NativeRequest<T = unknown> {
  kind: string;
  payload: T;
}

export interface NativeResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
