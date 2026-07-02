import type { CaptureRecord, CaptureSession } from './types';

const KEYS = {
  currentSession: 'dockstack.currentSession',
  sessions: 'dockstack.sessions',
  recentCaptures: 'dockstack.recentCaptures',
  termsAccepted: 'dockstack.termsAccepted',
};

export async function getCurrentSession(): Promise<CaptureSession | null> {
  const result = await chrome.storage.local.get(KEYS.currentSession);
  return result[KEYS.currentSession] ?? null;
}

export async function setCurrentSession(session: CaptureSession | null) {
  await chrome.storage.local.set({ [KEYS.currentSession]: session });
}

export async function appendSession(session: CaptureSession) {
  const result = await chrome.storage.local.get(KEYS.sessions);
  const sessions: CaptureSession[] = result[KEYS.sessions] ?? [];
  sessions.unshift(session);
  await chrome.storage.local.set({ [KEYS.sessions]: sessions.slice(0, 100) });
}

export async function listSessions(): Promise<CaptureSession[]> {
  const result = await chrome.storage.local.get(KEYS.sessions);
  return result[KEYS.sessions] ?? [];
}

export async function appendCapture(capture: CaptureRecord) {
  const result = await chrome.storage.local.get(KEYS.recentCaptures);
  const captures: CaptureRecord[] = result[KEYS.recentCaptures] ?? [];
  captures.unshift(capture);
  await chrome.storage.local.set({ [KEYS.recentCaptures]: captures.slice(0, 200) });
}

export async function listRecentCaptures(): Promise<CaptureRecord[]> {
  const result = await chrome.storage.local.get(KEYS.recentCaptures);
  return result[KEYS.recentCaptures] ?? [];
}

export async function setTermsAccepted(value: boolean) {
  await chrome.storage.local.set({ [KEYS.termsAccepted]: value });
}

export async function getTermsAccepted(): Promise<boolean> {
  const result = await chrome.storage.local.get(KEYS.termsAccepted);
  return Boolean(result[KEYS.termsAccepted]);
}
