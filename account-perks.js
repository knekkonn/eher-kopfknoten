/* Account-only cosmetic rewards and release notes. Scores are read from synced rounds. */
(()=>{
'use strict';
const VERSION='2026-11-04-scene-character-fix';
const SKINS=[
{id:'diver',name:'Taucher',min:0,sprite:'diver.svg',color:'#7ce4d9'},
{id:'jelly',name:'Leuchtqualle',min:100,sprite:'jelly.svg',color:'#83c8ff'},
{id:'crab',name:'Korallenkrabbe',min:200,sprite:'crab.svg',color:'#ff9981'},
{id:'phantom',name:'Phantom',min:400,sprite:'phantom.svg',color:'#c9a0ff'},
{id:'angler',name:'Goldangler',min:600,sprite:'angler.svg',color:'#ffd68a'},
{id:'leviathan',name:'Leviathan',min:700,sprite:'leviathan.svg',color:'#83f4cd'}];
let uid=null,db=null,fire=null,auth=null,profile=null,score=0,selected='diver',unsub=()=>{},lastSeen='',ready=false;
const css=document.createElement('style');css.textContent=`
.abg-perk-overlay[hidden],.abg-skin-stage[hidden],.abg-equipped[hidden]{display:none!important}
.abg-perk-overlay{position:fixed;inset:0;background:#00101cce;z-index:99999;display:grid;place-items:center;padding:20px;backdrop-filter:blur(9px)}
.abg-perk-panel{width:min(540px,96vw);max-height:85vh;overflow:auto;background:linear-gradient(155deg,#0b2a39,#061522);border:1px solid #79e6dd65;border-radius:22px;padding:25px;color:#e6f8fa;box-shadow:0 20px 90px #000b;font-family:Manrope,system-ui}
.abg-perk-panel h2{font-size:24px;margin:8px 0 14px}.abg-perk-panel p{line-height:1.55;color:#a8c7d3}.abg-perk-panel button{border:1px solid #7de6dc77;background:#10313f;color:#e9ffff;border-radius:10px;padding:12px;cursor:pointer}
.abg-perk-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}
.abg-perk-grid button{display:flex;flex-direction:column;gap:5px;align-items:center;justify-content:center;min-height:172px;position:relative;overflow:hidden;box-shadow:inset 0 0 30px #020e1c5e;transition:transform .2s,background .2s,border-color .2s}
.abg-perk-grid button[aria-pressed=true]{background:linear-gradient(155deg,#155b60,#0b2b3d);border-color:#8ff8e9}.abg-perk-grid button:not(:disabled):hover{transform:translateY(-4px)}.abg-perk-grid button:disabled{opacity:.45;cursor:not-allowed}
.abg-perk-avatar{width:min(100%,118px);height:118px;object-fit:contain;filter:drop-shadow(0 8px 16px color-mix(in srgb,currentColor 38%,transparent));animation:abg-swim 3s ease-in-out infinite;display:block;pointer-events:none}
.abg-perk-grid small{font:10px 'DM Mono',monospace;letter-spacing:.02em;color:#a2c4ce;text-align:center}
.abg-perk-grid strong{font-size:12px;letter-spacing:.02em}
@keyframes abg-swim{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-7px) rotate(5deg)}}
@keyframes abg-rise{from{opacity:0;transform:translateY(22px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes abg-glow{0%,100%{box-shadow:0 0 4px #76e5dd33}50%{box-shadow:0 0 22px #76e5dd77}}
.abg-perk-panel{animation:abg-rise .35s cubic-bezier(.2,.8,.2,1) both}
.abg-perk-grid button[aria-pressed=true]{animation:abg-glow 2s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.abg-perk-panel,.abg-perk-avatar,.abg-perk-grid button{animation:none!important;transition:none!important}}
.abg-equipped{display:flex;align-items:center;gap:10px;padding:8px 13px;border:1px solid var(--abg-skin-color,#7ce4d9);border-radius:14px;background:linear-gradient(110deg,#092332ee,#061521ee);box-shadow:0 0 20px color-mix(in srgb,var(--abg-skin-color) 18%,transparent);color:#e8f6fa;min-width:0;max-width:260px;cursor:pointer;transition:box-shadow .2s,transform .2s}
.abg-equipped:hover{transform:translateY(-2px);box-shadow:0 0 28px color-mix(in srgb,var(--abg-skin-color) 40%,transparent)}
.abg-equipped-emoji{width:50px;height:50px;object-fit:contain;animation:abg-swim 2.8s ease-in-out infinite;filter:drop-shadow(0 0 9px color-mix(in srgb,var(--abg-skin-color) 40%,transparent))}
.abg-skin-stage{position:relative;display:flex;align-items:center;gap:16px;min-height:113px;background:linear-gradient(112deg,#082434,#0b2b3b 58%,#071c2d);border:1px solid color-mix(in srgb,var(--abg-skin-color,#76e5dd) 40%,transparent);border-radius:18px;padding:6px 24px 6px 10px;margin:18px 0 15px;overflow:hidden;color:#e8faff;box-shadow:inset 0 0 42px #00101c55,0 6px 28px #0004;isolation:isolate}
.abg-skin-stage:before{content:"";position:absolute;left:12px;top:-31px;width:165px;height:165px;background:radial-gradient(circle,color-mix(in srgb,var(--abg-skin-color,#76e5dd) 22%,transparent),transparent 68%);z-index:-1}
.abg-stage-art{width:112px;height:112px;flex-shrink:0;object-fit:contain;filter:drop-shadow(0 9px 13px color-mix(in srgb,var(--abg-skin-color) 26%,transparent));animation:abg-swim 3.2s ease-in-out infinite}
.abg-stage-info{display:flex;flex-direction:column;gap:5px}.abg-stage-eyebrow{font:10px 'DM Mono',monospace;letter-spacing:.15em;color:var(--abg-skin-color)}.abg-stage-name{font:800 clamp(18px,4vw,28px) Manrope,sans-serif;letter-spacing:-.04em}.abg-stage-caption{font:11px Manrope,sans-serif;color:#a9c8d4}
.abg-stage-swap{margin-left:auto;border:1px solid #88d7d278;border-radius:10px;background:#103d4a;color:#d4fff6;padding:10px 12px;cursor:pointer;flex-shrink:0;font-size:11px}
.abg-stage-swap:hover{background:#145463}
.abg-skin-stage.abg-skin-change .abg-stage-art{animation:abg-appear .55s cubic-bezier(.2,.75,.2,1),abg-swim 3.2s ease-in-out .55s infinite}
@keyframes abg-appear{from{transform:scale(.35) rotate(-18deg);opacity:.15;filter:blur(4px)}to{transform:scale(1) rotate(0);opacity:1;filter:blur(0)}}
@keyframes abg-jelly{0%,100%{transform:translateY(3px) scaleX(1) scaleY(.96)}50%{transform:translateY(-7px) scaleX(.96) scaleY(1.06)}}
@keyframes abg-crab{0%,100%{transform:translateX(-3px) rotate(-2deg)}25%{transform:translateX(4px) rotate(2deg)}50%{transform:translateX(-2px) rotate(-2deg)}75%{transform:translateX(5px) rotate(2deg)}}
@keyframes abg-phantom{0%,100%{transform:translateY(0);opacity:.86}50%{transform:translateY(-10px);opacity:1}}
@keyframes abg-angler{0%,100%{transform:translateY(2px) rotate(-4deg);filter:drop-shadow(0 0 5px #f8d47b66)}50%{transform:translateY(-5px) rotate(4deg);filter:drop-shadow(0 0 21px #ffd77baa)}}
@keyframes abg-leviathan{0%,100%{transform:translate(-4px,3px) rotate(-3deg)}50%{transform:translate(5px,-10px) rotate(4deg)}}
.abg-skin-stage[data-skin=jelly] .abg-stage-art,.abg-perk-grid button[data-skin=jelly] img{animation:abg-jelly 3.5s ease-in-out infinite}
.abg-skin-stage[data-skin=crab] .abg-stage-art,.abg-perk-grid button[data-skin=crab] img{animation:abg-crab 3.6s ease-in-out infinite}
.abg-skin-stage[data-skin=phantom] .abg-stage-art,.abg-perk-grid button[data-skin=phantom] img{animation:abg-phantom 3s ease-in-out infinite}
.abg-skin-stage[data-skin=angler] .abg-stage-art,.abg-perk-grid button[data-skin=angler] img{animation:abg-angler 2.8s ease-in-out infinite}
.abg-skin-stage[data-skin=leviathan] .abg-stage-art,.abg-perk-grid button[data-skin=leviathan] img{animation:abg-leviathan 3.4s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.abg-skin-stage .abg-stage-art,.abg-perk-grid button img{animation:none!important}}

@media(max-width:560px){.abg-skin-stage{gap:9px;padding:5px 10px;min-height:83px}.abg-stage-art{width:83px;height:83px}.abg-stage-swap{padding:8px}.abg-stage-caption{font-size:9px}.abg-perk-grid button{min-height:148px}.abg-perk-avatar{height:95px}.abg-equipped-emoji{width:40px;height:40px}}
@media(max-width:380px){.abg-stage-swap{font-size:9px;padding:6px}.abg-stage-art{width:72px;height:72px}.abg-stage-name{font-size:17px}}
@media(prefers-reduced-motion:reduce){.abg-stage-art,.abg-skin-stage.abg-skin-change .abg-stage-art{animation:none!important}}

.abg-equipped-copy{display:flex;flex-direction:column;text-align:left;gap:3px;font:10px Manrope,sans-serif}
.abg-equipped-copy strong{color:var(--abg-skin-color);font-size:12px;letter-spacing:.07em}
.abg-equipped::after{content:'✦';color:var(--abg-skin-color);margin-left:auto}
body.playing .abg-equipped{border-width:2px}
@media(max-width:480px){.abg-equipped{max-width:160px;padding:6px 8px}.abg-equipped-emoji{font-size:25px}.abg-equipped-copy{font-size:8px}.abg-equipped-copy strong{font-size:10px}}
@media(prefers-reduced-motion:reduce){.abg-equipped-emoji{animation:none!important}}
.abg-perk-close{width:100%;background:#7ce4d9!important;color:#06232b!important;font-weight:800}
`;document.head.appendChild(css);
const spriteUrl=skin=>'./skins/'+skin.sprite;
const sceneCss=document.createElement('style');
sceneCss.textContent=`
/* In-world character: the original swimming pixel diver is replaced, not duplicated. */
#diver:has(.abg-scene-character){width:clamp(48px,5.5vw,76px);height:clamp(48px,5.5vw,76px);z-index:4;filter:drop-shadow(0 0 12px var(--abg-scene-color,#76e5dd));}
#diver .abg-scene-character{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none;animation:abg-scene-bob 2.8s ease-in-out infinite;transform-origin:center}
#diver .abg-scene-character[hidden]{display:none!important}
#diver[data-skin=jelly] .abg-scene-character{animation:abg-scene-jelly 3.3s ease-in-out infinite}
#diver[data-skin=crab] .abg-scene-character{animation:abg-scene-crab 3.5s ease-in-out infinite}
#diver[data-skin=phantom] .abg-scene-character{animation:abg-scene-phantom 3s ease-in-out infinite}
#diver[data-skin=angler] .abg-scene-character{animation:abg-scene-angler 3s ease-in-out infinite}
#diver[data-skin=leviathan] .abg-scene-character{animation:abg-scene-leviathan 3.4s ease-in-out infinite}
@keyframes abg-scene-bob{0%,100%{transform:translateY(1px) rotate(-3deg)}50%{transform:translateY(-5px) rotate(3deg)}}
@keyframes abg-scene-jelly{0%,100%{transform:scale(1,.94) translateY(3px)}50%{transform:scale(.94,1.07) translateY(-5px)}}
@keyframes abg-scene-crab{0%,100%{transform:translateX(-3px) rotate(-3deg)}50%{transform:translateX(4px) rotate(3deg)}}
@keyframes abg-scene-phantom{0%,100%{transform:translateY(3px);opacity:.82}50%{transform:translateY(-8px);opacity:1}}
@keyframes abg-scene-angler{0%,100%{transform:translateY(2px) rotate(-4deg);filter:drop-shadow(0 0 5px #ffdf84)}50%{transform:translateY(-5px) rotate(4deg);filter:drop-shadow(0 0 17px #ffdf84)}}
@keyframes abg-scene-leviathan{0%,100%{transform:translate(-3px,3px) rotate(-4deg)}50%{transform:translate(4px,-7px) rotate(4deg)}}
@media(max-width:650px){#diver:has(.abg-scene-character){width:52px;height:52px}}
@media(prefers-reduced-motion:reduce){#diver .abg-scene-character{animation:none!important}}
`;
document.head.appendChild(sceneCss);

function artImage(skin,className){
 const img=document.createElement('img');img.className=className;img.src=spriteUrl(skin);img.alt=skin.name+' – Tiefsee-Charakter';img.loading='lazy';img.decoding='async';img.draggable=false;img.onerror=()=>{img.alt='Charaktergrafik konnte nicht geladen werden'};return img;
}
const localBest=()=>Math.max(0,...(window.ABGRUND_HISTORY?.list?.()||[]).map(x=>Number(x.score)||0));
function modal(title,body,action){document.querySelector('.abg-perk-overlay')?.remove();const wrap=document.createElement('div');wrap.className='abg-perk-overlay';const panel=document.createElement('section');panel.className='abg-perk-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');const h=document.createElement('h2');h.textContent=title;panel.append(h);const b=document.createElement('div');panel.append(b);body(b);const close=document.createElement('button');close.className='abg-perk-close';close.textContent=action||'WEITER TAUCHEN';close.onclick=()=>wrap.remove();panel.append(close);wrap.append(panel);document.body.append(wrap);wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};}
function release(){if(!uid||!ready||lastSeen===VERSION)return;lastSeen=VERSION;persist();modal('NEUES AUS DER TIEFE',b=>{const p=document.createElement('p');p.textContent='Dein ausgewählter Skin ersetzt jetzt direkt den kleinen Taucher in der Unterwasser-Szene. Alle sechs Charaktere haben eigene Animationen. Deine Bestleistung in einer einzelnen Runde schaltet weitere Charaktere frei.';b.append(p)});}
function updateSceneCharacter(skin){
 // The existing #diver is the actual swimming figure in the scene, not the account badge.
 const sceneDiver=document.getElementById('diver');
 if(!sceneDiver)return;
 let sprite=sceneDiver.querySelector('img.abg-scene-character');
 if(!sprite){
  // Keep the original pixel diver available as a guest/failure fallback.
  const original=sceneDiver.querySelector('svg');
  if(original)original.style.display='none';
  sprite=document.createElement('img');
  sprite.className='abg-scene-character';
  sprite.alt='';
  sprite.setAttribute('aria-hidden','true');
  sprite.decoding='async';
  sprite.draggable=false;
  sprite.onerror=()=>{sprite.hidden=true;if(original)original.style.display='block'};
  sceneDiver.appendChild(sprite);
 }
 const active=uid?skin:SKINS[0];
 sceneDiver.dataset.skin=active.id;
 sceneDiver.style.setProperty('--abg-scene-color',active.color);
 if(sprite.getAttribute('src')!==spriteUrl(active)){sprite.hidden=false;sprite.src=spriteUrl(active)}
}
function updateEquipped(){
 const skin=SKINS.find(x=>x.id===selected)||SKINS[0];
 updateSceneCharacter(skin);
 const widget=document.getElementById('abgEquipped');
 if(!widget)return;
 widget.hidden=!uid;
 if(!uid)return;
 widget.style.setProperty('--abg-skin-color',skin.color);
 widget.querySelector('.abg-equipped-emoji').src=spriteUrl(skin);
 widget.querySelector('.abg-equipped-emoji').alt=skin.name;
 widget.querySelector('strong').textContent=skin.name;
 widget.querySelector('small').textContent='AUSGERÜSTETER SKIN';
 widget.setAttribute('aria-label','Aktueller Skin: '+skin.name+'. Skins wechseln');
}
function persist(){updateEquipped();if(uid){try{localStorage.setItem('abgrundSeenUpdate:'+uid,lastSeen);localStorage.setItem('abgrundEquippedSkin:'+uid,selected)}catch{}}if(!uid||!db||!fire)return;fire.setDoc(fire.doc(db,'users',uid,'profile','preferences'),{skin:selected,seenUpdate:lastSeen}).catch(e=>console.warn('Perk preferences:',e.code||e.message));}
function choose(){if(!uid)return;score=Math.max(score,localBest());modal('DEINE TIEFSEE-SKINS',b=>{const p=document.createElement('p');p.textContent='Rundenbestleistung: '+score+' Punkte. Skins sind rein kosmetisch und beeinflussen deine Punkte nicht.';b.append(p);const grid=document.createElement('div');grid.className='abg-perk-grid';for(const skin of SKINS){const button=document.createElement('button'),available=score>=skin.min;button.disabled=!available;button.dataset.skin=skin.id;button.setAttribute('aria-pressed',String(selected===skin.id));const avatar=artImage(skin,'abg-perk-avatar');avatar.style.color=skin.color;avatar.src=spriteUrl(skin);avatar.alt=skin.name+' als Tiefsee-Charakter';const name=document.createElement('strong');name.textContent=skin.name;const threshold=document.createElement('small');threshold.textContent=available?'FREIGESCHALTET':skin.min+' P IN EINER RUNDE';button.append(avatar,name,threshold);button.onclick=()=>{selected=skin.id;try{localStorage.setItem('abgrundEquippedSkin:'+uid,selected)}catch{}updateEquipped();persist();choose()};grid.append(button)}b.append(grid);const achievements=document.createElement('div');achievements.innerHTML='<h3>ERFOLGE & PROFIL</h3>';const games=window.ABGRUND_HISTORY?.list?.()||[];const streakDays=[...new Set(games.map(g=>g.day).filter(Boolean))].sort().reverse();let streak=0,day=new Date();for(let i=0;i<365;i++){const key=day.toISOString().slice(0,10);if(streakDays.includes(key))streak++;else if(i>0||streakDays.length&&streakDays[0]!==new Date(Date.now()-86400000).toISOString().slice(0,10))break;day.setUTCDate(day.getUTCDate()-1)}const lines=[['Erster Tauchgang',games.length>=1],['10 Tauchgänge',games.length>=10],['100 Tauchgänge',games.length>=100],['7-Tage-Serie',streak>=7],['Tiefsee-Legende',score>=700]];for(const [label,done] of lines){const el=document.createElement('p');el.textContent=(done?'🏆 ':'🔒 ')+label;achievements.append(el)}const summary=document.createElement('p');summary.textContent='Gespielte Runden: '+games.length+' · Tages-Serie: '+streak+' · Bestleistung: '+score;achievements.prepend(summary);b.append(achievements)})}
const equipped=document.createElement('button');equipped.id='abgEquipped';equipped.type='button';equipped.className='abg-equipped';equipped.hidden=true;equipped.innerHTML='<img class="abg-equipped-emoji" aria-hidden="true" alt=""><span class="abg-equipped-copy"><small>AUSGERÜSTETER SKIN</small><strong></strong></span>';equipped.onclick=choose;
const hud=document.querySelector('.hudtop');const home=document.querySelector('.homehub');if(hud)hud.insertAdjacentElement('afterend',equipped);else if(home)home.insertAdjacentElement('beforebegin',equipped);else document.querySelector('.main')?.prepend(equipped);
const trigger=document.createElement('button');trigger.type='button';trigger.textContent='✦ SKINS';trigger.hidden=true;trigger.onclick=choose;trigger.style.cssText='background:#102b3a;color:#91eee2;border:1px solid #7de6dc55;border-radius:10px;padding:10px;cursor:pointer;font:11px monospace';document.getElementById('accountButton')?.insertAdjacentElement('afterend',trigger);
async function init(){try{const [a,f,g]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')]);fire=f;const app=a.getApps()[0]||a.initializeApp(window.ABGRUND_FIREBASE_CONFIG);db=f.getFirestore(app,window.ABGRUND_FIRESTORE_DATABASE||'(default)');auth=g.getAuth(app);g.onAuthStateChanged(auth,async u=>{unsub();unsub=()=>{};uid=u?.uid||null;ready=false;trigger.hidden=!uid;selected='diver';if(uid){try{const cached=localStorage.getItem('abgrundEquippedSkin:'+uid);if(SKINS.some(x=>x.id===cached))selected=cached}catch{}}updateEquipped();lastSeen='';if(uid){try{lastSeen=localStorage.getItem('abgrundSeenUpdate:'+uid)||''}catch{}}score=localBest();if(!uid)return;unsub=f.onSnapshot(f.doc(db,'users',uid,'profile','preferences'),snap=>{const data=snap.data()||{};selected=SKINS.some(x=>x.id===data.skin)?data.skin:selected;lastSeen=data.seenUpdate||lastSeen;ready=true;updateEquipped();release()},()=>{ready=true;release()});f.onSnapshot(f.collection(db,'users',uid,'games'),snap=>{score=Math.max(localBest(),...snap.docs.map(d=>Number(d.data().score)||0));if(score<SKINS.find(s=>s.id===selected)?.min){selected='diver';updateEquipped();persist()}},()=>{});});}catch(e){console.warn('Account perks unavailable',e.message)}}
window.ABGRUND_FEATURES={rejected:async(q,answer)=>{if(!uid||!db||!fire||!answer?.trim())return;try{await fire.addDoc(fire.collection(db,'rejectedAnswers'),{uid,question:q.q,answer:answer.trim(),status:'pending',createdAt:fire.serverTimestamp()})}catch(e){console.warn('Answer review queue:',e.code||e.message)}}};
init();
})();
