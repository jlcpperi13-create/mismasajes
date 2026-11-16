// Service worker del panel. No guarda nada en caché a propósito:
// así cada cambio que subas a GitHub se ve al momento.
// Más adelante aquí irán también los avisos push.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:30px;text-align:center"><h2>Sin conexión</h2><p>Revisa los datos o el wifi y vuelve a abrir la app.</p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
