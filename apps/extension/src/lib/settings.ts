import type { ExtensionSettings } from './types';

const SETTINGS_KEY = 'dockstack.settings';

export const defaultSettings: ExtensionSettings = {
  defaultScope: 'domain',
  captureRetentionLimit: 200,
  ollamaUrl: 'http://127.0.0.1:11434/api/generate',
  ollamaModel: 'qwen2.5-coder:1.5b',
  autoRefreshPopup: true,
  maskSecretsInUi: true,
};

export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...defaultSettings, ...(result[SETTINGS_KEY] ?? {}) };
}

export async function saveSettings(settings: ExtensionSettings) {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}
