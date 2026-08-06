const NUMBERED_READING_KEY = /^Reading\s*\d+$/i;

export type ParsedTensionReading = {
  time: string;
  tensionValue: number;
};

/** Quote unquoted ISO timestamps from ESP32 payloads so JSON.parse succeeds. */
function normalizeEsp32Json(raw: string): string {
  return raw.replace(
    /("Time"\s*:\s*)(\d{4}-\d{2}-\d{2}T[0-9:+.\-Zz]+)/,
    '$1"$2"',
  );
}

function parseReadingTime(timeRaw: unknown, sessionStart: Date): Date {
  if (typeof timeRaw === 'number' && Number.isFinite(timeRaw)) {
    if (timeRaw >= 1_000_000_000) {
      return new Date(timeRaw * 1000);
    }
    return new Date(sessionStart.getTime() + timeRaw * 1000);
  }

  if (typeof timeRaw === 'string' && timeRaw.trim()) {
    const parsedTime = new Date(timeRaw);
    if (!Number.isNaN(parsedTime.getTime())) {
      return parsedTime;
    }
  }

  return new Date();
}

/** Parse ESP32 JSON: {"Time":YYYY-MM-DDTHH:MM:SS-06:00, "Reading":N} */
export function parseTensionMessage(
  raw: string,
  sessionStart: Date,
): ParsedTensionReading | null {
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(normalizeEsp32Json(raw));
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return null;
  }

  // Preferred format: single "Reading" value
  if ('Reading' in data) {
    const n = Number(data.Reading);
    if (!Number.isFinite(n)) {
      return null;
    }
    return {
      time: parseReadingTime(data.Time, sessionStart).toISOString(),
      tensionValue: n,
    };
  }

  // Legacy: average of Reading 1–6
  const readings: number[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (!NUMBERED_READING_KEY.test(key)) continue;
    const n = Number(value);
    if (Number.isFinite(n)) readings.push(n);
  }

  if (readings.length === 0) {
    return null;
  }

  return {
    time: parseReadingTime(data.Time, sessionStart).toISOString(),
    tensionValue: readings.reduce((a, b) => a + b, 0) / readings.length,
  };
}
