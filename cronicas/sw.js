/* Dedicated offline cache: shared engine, separate installable application. */
const CACHE='cronicas-app-v1';
const SCOPE=new URL('./',self.location.href), ROOT=new URL('../',SCOPE);
const APP_FILES=['./','index.html','manifest.webmanifest','app.css','app.js','icon-192.png','icon-512.png'];
const GAME_FILES=['jogos.js','jogos.css','campaign-landscape.js','nile-boss.js','fonts/portal-pixel.css','fonts/Anton-Regular.woff2',
  'img/chronicle-cover.webp','img/cronicas-titulo.png','img/egito-roteiro.webp','img/chronicle-islands.webp',
  ...['gabi','gio'].flatMap(n=>['portrait','swim','trilha'].map(t=>'img/'+n+'-'+t+'.webp')),
  ...Array.from({length:6},(_,i)=>'img/chronicle-world-'+i+'.webp'),
  'img/chronicle-variants.webp','img/fauna-do-nilo.webp','img/cronicas-objetos.webp','img/cronicas-marcos.webp',
  'img/oficina-escribas.webp','img/chronicle-nile.webp','img/cronicas-chefes-v77.png','img/cronicas-arenas-v77.png',
  'img/acervo-36-v77.png','img/guardiao-nilo-poses-v78.png','img/guardiao-nilo-efeitos-v79.png','img/cronicas-agachar-v80.png',
  'img/nilo-panorama-v81.png','img/nilo-objetos-v81.png'];
const urls=[...APP_FILES.map(p=>new URL(p,SCOPE).href),...GAME_FILES.map(p=>new URL(p,ROOT).href)];
const known=new Set(urls),canonical=url=>new URL(url.pathname,url.origin).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(urls.map(url=>new Request(url,{cache:'reload'})));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('cronicas-app-v')&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url),key=canonical(url);
  const appNavigation=event.request.mode==='navigate'&&url.origin===SCOPE.origin&&url.pathname.startsWith(SCOPE.pathname);
  if(!known.has(key)&&!appNavigation)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    // Prefer the version stored atomically during installation; never mix engine and assets.
    const saved=await cache.match(key);if(saved)return saved;
    if(appNavigation){const home=await cache.match(SCOPE.href);if(home)return home;}
    try{return await fetch(event.request)}catch{return new Response('Conteúdo indisponível offline.',{status:503});}
  })());
});
