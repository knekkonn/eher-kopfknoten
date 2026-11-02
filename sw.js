const CACHE='abgrund-shell-v15';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./krillion-patch.js?v=20261102b','./krillion-archive-extra.js?v=20261102','./answer-expansion.js?v=20261102c','./tier-calibration.js?v=20261102','./answer-corrections.js?v=20261102e','./firebase-config.js?v=1','./accounts.js?v=1','./accounts.css?v=1'];
const MAIN_PATCH='<script src="./krillion-patch.js?v=20261101"></script>';
const EXTRA_PATCH='<script src="./krillion-archive-extra.js?v=20261101"></script>';
function injectPatches(html){
  let out=html;
  if(!out.includes('krillion-patch.js'))out=out.replace('</body>',MAIN_PATCH+'</body>');
  if(!out.includes('krillion-archive-extra.js'))out=out.replace('</body>',EXTRA_PATCH+'</body>');
  return out;
}
async function patchedNavigation(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(!response.ok)return response;
    const type=response.headers.get('content-type')||'';
    if(!type.includes('text/html'))return response;
    const html=injectPatches(await response.text());
    const headers=new Headers(response.headers);headers.delete('content-length');
    const out=new Response(html,{status:response.status,statusText:response.statusText,headers});
    const cache=await caches.open(CACHE);cache.put(request,out.clone()).catch(()=>{});
    return out;
  }catch{
    const cached=await caches.match(request)||await caches.match('./index.html')||await caches.match('./');
    if(!cached)return Response.error();
    const type=cached.headers.get('content-type')||'';
    if(!type.includes('text/html'))return cached;
    const html=injectPatches(await cached.text());
    const headers=new Headers(cached.headers);headers.delete('content-length');
    return new Response(html,{status:cached.status,statusText:cached.statusText,headers});
  }
}
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
  const clients=await self.clients.matchAll({type:'window'});
  await Promise.all(clients.map(c=>c.navigate(c.url).catch(()=>{})));
})()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const isNav=e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(isNav){e.respondWith(patchedNavigation(e.request));return;}
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
    return r;
  }).catch(()=>caches.match(e.request)));
});
