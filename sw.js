// Service worker del panel. No guarda nada en caché a propósito:
// así cada cambio que subas a GitHub se ve al momento.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:30px;text-align:center"><h2>Sin conexión</h2><p>Revisa los datos o el wifi y vuelve a abrir la app.</p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});

// ---------- Avisos push (cita nueva) ----------
self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch { p = { data: { cuerpo: e.data && e.data.text() } }; }
  const d = p.data || p.notification || {};
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.titulo || d.title || 'Nueva cita', {
      body: d.cuerpo || d.body || '',
      icon: 'icon-panel-192.png',
      badge: 'icon-panel-192.png',
      tag: 'cita-' + (d.id || Date.now()),
      vibrate: [200, 100, 200],
      requireInteraction: true,
      renotify: true,
      data: { url: d.url || './admin.html' }
    }),
    (self.navigator && self.navigator.setAppBadge) ? self.navigator.setAppBadge().catch(() => {}) : null
  ]));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(lista => {
    const w = lista.find(c => c.url.includes('admin.html'));
    return w ? w.focus() : self.clients.openWindow('./admin.html');
  }));
});
