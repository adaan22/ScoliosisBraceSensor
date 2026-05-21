const READING_KEY = /^Reading\s*\d+$/i;

export type ParsedTensionReading = {
  time: string;
  tensionValue: number;
};

/** Parse ESP32 JSON: average of Reading 1–6 + device Time. */
export function parseTensionMessage(
  raw: string,
  sessionStart: Date,
): ParsedTensionReading | null {
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return null;
  }

  const readings: number[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (!READING_KEY.test(key)) continue;
    const n = Number(value);
    if (Number.isFinite(n)) readings.push(n);
  }

  if (readings.length === 0) {
    return null;
  }

  const tensionValue = readings.reduce((a, b) => a + b, 0) / readings.length;
  const timeRaw = data.Time;
  let readingTime: Date;

  if (typeof timeRaw === 'number' && Number.isFinite(timeRaw)) {
    if (timeRaw >= 1_000_000_000) {
      readingTime = new Date(timeRaw * 1000);
    } else {
      readingTime = new Date(sessionStart.getTime() + timeRaw * 1000);
    }
  } else {
    readingTime = new Date();
  }

  return {
    time: readingTime.toISOString(),
    tensionValue,
  };
}
