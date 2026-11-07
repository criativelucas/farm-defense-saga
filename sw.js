// offline cache: network first, falling back to the saved copy, so updates arrive when online
const V='fds-v3',FILES=["./", "jardim-do-fruto.html", "index.html", "manifest.webmanifest", "assets/logo.png", "assets/icon-192.png", "assets/icon-512.png", "js/engine.js", "js/skin.js", "js/content.js", "js/maps.js", "js/tiles.js", "js/game.js", "js/draw.js", "js/sprites.js", "js/vfx.js", "js/ui.js", "js/cards.js", "js/meta.js", "js/td.js", "js/extras.js", "js/platform.js", "js/garden.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
