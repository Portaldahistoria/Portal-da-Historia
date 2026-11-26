/* Portal da História — offline application shell. */
const VERSION = 'portal-historia-pwa-v84';
const CORE = VERSION + '-core';
const MEDIA = 'portal-historia-pwa-v1-media';
const BASE = new URL('./', self.location.href);
const chapters = [
  '6-11','7-10','7-11',
  ...Array.from({length:12},(_,i)=>'8-'+(i+1)),
  ...Array.from({length:12},(_,i)=>'9-'+(i+1))
];
const files = [
  'img/gabi-dive.webp','img/gio-dive.webp','img/chronicle-travel.webp','img/chronicle-itineraries.webp',
  'cronicas-atlas.html','img/chronicle-variants.webp','img/chronicle-nile.webp','img/gabi-lit.webp','img/gio-lit.webp',
  'img/gabi-portrait.webp','img/gio-portrait.webp','img/gabi-walk.webp','img/gio-walk.webp','img/chronicle-fauna.webp',
  ...Array.from({length:6},(_,i)=>'img/chronicle-world-'+i+'.webp'),
  ...Array.from({length:5},(_,i)=>'img/chronicle-game-'+i+'.webp'),
  'campaign-landscape.js','jogos.css','jogos.js',
  'img/cronicas-chefes-v77.png','img/acervo-36.webp','img/gabi-trilha.webp','img/gio-trilha.webp','img/gabi-swim.webp','img/gio-swim.webp','img/chronicle-cover.webp','img/cronicas-titulo.png','img/egito-roteiro.webp','img/chronicle-islands.webp','img/fauna-do-nilo.webp','img/cronicas-objetos.webp','img/cronicas-marcos.webp','img/oficina-escribas.webp',
  './','index.html','jogos.html','og-image.png','manifest.webmanifest','app-icon-192.png','app-icon-512.png','aplicativo.html','aplicativo.js',
  'pwa.js','pwa.css','style.css','portal.css','refinement.css','fullwidth.css',
  'chronology.css','chapter-index.js','grades.js','app.js','portal.js','hero-grain.svg',
  'historical-mosaic.svg','historical-texture-white.svg','historical-texture-red.svg','portal-mark.svg','portal-texture.css','portal-history-data.js','portal-glossary.js','portal-resources.js','enem-original.js','roma-imperial.html','chapter-em.html','chapter-em.js',
  'fonts/portal-pixel.css','fonts/Anton-Regular.woff2','fonts/OFL-Anton.txt','chapter-standard.css','chapter-standard.js','chapter-medieval.css',
  'chapter-medieval.js','chapter-assessment.js','chapter-maps.js',
  'img/alta-idade-media-01.svg',
  'img/alta-idade-media-02.webp',
  'img/alta-idade-media-03.webp',
  'img/alta-idade-media-04.webp',
  'img/alta-idade-media-05.webp',
  'img/alta-idade-media-06.webp',
  'img/alta-idade-media-07.webp',
  'img/alta-idade-media-08.webp',
  'img/alta-idade-media-09.webp',
  'img/alta-idade-media-10.webp',
  'img/alta-idade-media-11.svg',
  ...chapters.map(x=>'chapters/'+x+'.html')
];
const canonical = url => new URL(url.pathname, url.origin).href;
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CORE);
    await cache.addAll(files.map(p=>new Request(new URL(p,BASE),{cache:'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k.startsWith('portal-historia-pwa-')&&k!==CORE&&k!==MEDIA) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||!['https:','http:'].includes(url.protocol))return;
  const local=url.origin===BASE.origin&&url.pathname.startsWith(BASE.pathname);
  if(local){
    event.respondWith((async()=>{
      const cache=await caches.open(CORE), key=canonical(url);
      try{
        const response=await fetch(req,{cache:'no-cache'});
        if(response.ok){try{await cache.put(key,response.clone());}catch{}return response;}
        return await cache.match(key)||response;
      }catch{
        const cached=await cache.match(key);
        if(cached)return cached;
        if(req.mode==='navigate'){
          const relative=url.pathname.slice(BASE.pathname.length).replace(/index\.html$/,'');
          const oldChapter=relative.match(/^fundamental\/(\d)-ano\/capitulo-(\d+)\/?$/);
          const oldGrade=relative.match(/^(?:fundamental|medio)\/(\d)-ano\/?$/);
          if(oldChapter)return Response.redirect(new URL('./#acervo-'+oldChapter[1]+'-'+oldChapter[2],BASE).href,302);
          if(oldGrade)return Response.redirect(new URL('./#ano-'+oldGrade[1],BASE).href,302);
          if(relative==='')return await cache.match(new URL('./',BASE));
        }
        return new Response('Conteúdo indisponível offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());return;
  }
  // Cache public visual resources already loaded during visits, without caching private documents.
  if(req.destination==='image'&&['commons.wikimedia.org','upload.wikimedia.org'].includes(url.hostname)){
    event.respondWith((async()=>{
      const cache=await caches.open(MEDIA),existing=await cache.match(req);
      if(existing)return existing;
      try{
        const result=await fetch(req);
        if(result.ok||result.type==='opaque'){
          try{await cache.put(req,result.clone());const keys=await cache.keys();if(keys.length>60)await cache.delete(keys[0]);}catch{}
        }
        return result;
      }catch{return Response.error();}
    })());
  }
});
