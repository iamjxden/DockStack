import type { CaptureRecord } from "./types";

export interface DatasetCandidate {
  captureId: string;
  sourceUrl: string;
  recordCount: number;
  fields: string[];
  kind: "json-array" | "json-embedded-array";
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function detectArray(value: unknown): unknown[] | null {
  if (Array.isArray(value) && value.length > 0 && value.every((item) => isPlainRecord(item) || item === null)) {
    return value;
  }
  if (isPlainRecord(value)) {
    for (const nested of Object.values(value)) {
      if (Array.isArray(nested) && nested.length > 0 && nested.every((item) => isPlainRecord(item) || item === null)) {
        return nested;
      }
    }
  }
  return null;
}

export function detectDatasets(captures: CaptureRecord[]): DatasetCandidate[] {
  const candidates: DatasetCandidate[] = [];
  for (const capture of captures) {
    const contentType = capture.contentType?.toLowerCase() ?? '';
    const body = capture.responseBody;
    if (!body || !(contentType.includes('json') || body.trim().startsWith('{') || body.trim().startsWith('['))) continue;
    try {
      const parsed = JSON.parse(body);
      const data = detectArray(parsed);
      if (!data) continue;
      const firstRecord = data.find((item) => isPlainRecord(item)) as Record<string, unknown> | undefined;
      const fields = firstRecord ? Object.keys(firstRecord).slice(0, 12) : [];
      candidates.push({
        captureId: capture.id,
        sourceUrl: capture.url,
        recordCount: data.length,
        fields,
        kind: Array.isArray(parsed) ? 'json-array' : 'json-embedded-array',
      });
    } catch {
      continue;
    }
  }
  return candidates.slice(0, 12);
}
