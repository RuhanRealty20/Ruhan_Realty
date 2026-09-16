const listeners = new Set();
export function track(event, payload = {}) {
  const data = { event, ...payload, path: window.location.pathname, timestamp: new Date().toISOString() };
  if (import.meta.env.DEV) console.info('[analytics]', data);
  window.dataLayer?.push(data);
  listeners.forEach((listener) => listener(data));
}
export function subscribeAnalytics(listener) { listeners.add(listener); return () => listeners.delete(listener); }
