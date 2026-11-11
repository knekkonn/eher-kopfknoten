const CACHE='abgrund-shell-v32';
const CORE=['./ocean-world.js?v=20261109a','./ocean-depth.js?v=20261109a','./experience.css?v=20261109a','./experience.js?v=20261108b','./fonts.css?v=20261108','./fonts/manrope-latin.woff2','./fonts/manrope-latin-ext.woff2','./fonts/dm-mono-latin.woff2','./german-lexicon.js?v=20261107','./german-vocabulary.js?v=20261109b','./german-localization.js?v=20261107','./german-first.js?v=20261109a','./live-validation.js?v=20261104','./stats.js?v=20261104','./social.js?v=20261108','./reviewed-answers.js?v=20261104de2','./index.html','./manifest.webmanifest','./icon.svg','./krillion-patch.js?v=20261102b','./krillion-archive-extra.js?v=20261102','./answer-expansion.js?v=20261104de','./tier-calibration.js?v=20261102','./answer-corrections.js?v=20261102f','./question-pack.js?v=20261102','./question-pack-extra.js?v=20261102','./fact-fixes.js?v=20261102','./archive-pack.js?v=20261109a','./archive-manifest.json','./firebase-config.js?v=2','./accounts.js?v=5','./community.js?v=1','./community-questions.json','./polish.css?v=20261109a','./polish.js?v=1','./accounts.css?v=1','./account-perks.js?v=20261108ocean','./skins/diver-v2.webp','./skins/jelly-v2.webp','./skins/crab-v2.webp','./skins/phantom-v2.webp','./skins/angler-v2.webp','./skins/leviathan-v2.webp'];
async function cachedNavigation(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok&&response.headers.get('content-type')?.includes('text/html')){
      const cache=await caches.open(CACHE);cache.put(request,response.clone()).catch(()=>{});
    }
    return response;
  }catch{
    return await caches.match(request)||await caches.match('./index.html')||Response.error();
  }
}
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(path=>path==='./index.html'||path==='./archive-manifest.json'?new Request(new URL(path,self.registration.scope),{cache:'reload'}):path))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('abgrund-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
  // Keep active rounds intact; updated assets load on the next navigation.
})()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const isNav=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(isNav){e.respondWith(cachedNavigation(e.request));return;}
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
    return r;
  }).catch(async()=>await caches.match(e.request)||Response.error()));
});
