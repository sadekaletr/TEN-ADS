export function whatsAppShareUrl(text: string, url: string) {
  const message = `${text}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function campaignShareMessage(title: string, code: string, baseUrl: string) {
  const url = `${baseUrl}/c/${encodeURIComponent(code)}`;
  return whatsAppShareUrl(`🎁 ${title} — استلم جائزتك على TENEGTA Spark`, url);
}
