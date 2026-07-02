import { defineBackground } from 'wxt/sandbox';
import { appendCapture, getCurrentSession } from '../lib/storage';
import { nativeApi } from '../lib/native';
import type { CaptureRecord } from '../lib/types';

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('DockStack installed');
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'dockstack:capture') {
      handleCapture(message.payload, sender)
        .then(() => sendResponse({ ok: true }))
        .catch((error) => sendResponse({ ok: false, error: String(error) }));
      return true;
    }
    if (message?.type === 'dockstack:listSessions') {
      nativeApi.listSessions().then(sendResponse);
      return true;
    }
    if (message?.type === 'dockstack:export') {
      nativeApi.exportSession(message.sessionId, message.format).then(sendResponse);
      return true;
    }
  });

  async function handleCapture(raw: Partial<CaptureRecord>, sender: chrome.runtime.MessageSender) {
    const session = await getCurrentSession();
    if (!session) return;
    const record: CaptureRecord = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      kind: raw.kind ?? 'fetch',
      method: raw.method ?? 'GET',
      url: raw.url ?? '',
      status: raw.status,
      requestHeaders: raw.requestHeaders,
      responseHeaders: raw.responseHeaders,
      requestBody: raw.requestBody ?? null,
      responseBody: raw.responseBody ?? null,
      contentType: raw.contentType ?? null,
      pageUrl: raw.pageUrl ?? sender.tab?.url ?? null,
      createdAt: new Date().toISOString(),
    };
    await appendCapture(record);
    await nativeApi.ingestCapture(record);
  }
});
