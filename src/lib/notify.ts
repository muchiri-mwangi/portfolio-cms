// Best-effort notification to a Zapier webhook so you find out about a paid
// order or a new review without having to check /admin manually. Silently
// does nothing if ZAPIER_NOTIFY_WEBHOOK_URL isn't set — never blocks the
// action it's called from.
export async function notifyAdmin(message: string, data?: Record<string, unknown>) {
  const url = process.env.ZAPIER_NOTIFY_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, ...data, sent_at: new Date().toISOString() }),
    });
  } catch {
    // ignore — a failed notification should never break checkout or review submission
  }
}
