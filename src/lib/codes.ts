const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return result;
}

/** Format: SPARK-XXXX-XXXX (no O/0/I/1) */
export function generateSparkCode(): string {
  return `SPARK-${randomSegment(4)}-${randomSegment(4)}`;
}

/** Partner tracking link code */
export function generateTrackingCode(): string {
  return `TRACK-${randomSegment(4)}-${randomSegment(4)}`;
}
