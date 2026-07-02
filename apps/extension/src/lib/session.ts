import { appendSession, getCurrentSession, setCurrentSession } from './storage';
import { nativeApi } from './native';
import type { CaptureSession } from './types';

function uid() {
  return crypto.randomUUID();
}

export async function startSession(scope: CaptureSession['scope'], sensitiveMode: boolean, termsAccepted: boolean) {
  const session: CaptureSession = {
    id: uid(),
    startedAt: new Date().toISOString(),
    scope,
    sensitiveMode,
    termsAccepted,
  };
  await setCurrentSession(session);
  await appendSession(session);
  await nativeApi.startSession(session);
  return session;
}

export async function stopSession() {
  const session = await getCurrentSession();
  if (!session) return null;
  session.stoppedAt = new Date().toISOString();
  await setCurrentSession(null);
  await nativeApi.stopSession(session.id);
  return session;
}
