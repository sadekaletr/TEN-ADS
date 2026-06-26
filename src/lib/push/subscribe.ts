/** MVP stub — full web-push (VAPID) in a follow-up phase. */
export type PushSubscribeResult =
  | { ok: true; endpoint: string }
  | { ok: false; reason: string };

export async function subscribeToPush(): Promise<PushSubscribeResult> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return { ok: false, reason: "unsupported" };
  }
  if (!("PushManager" in window)) {
    return { ok: false, reason: "push_not_configured" };
  }
  return { ok: false, reason: "push_not_configured" };
}
