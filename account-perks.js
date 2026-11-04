/* Account-only cosmetic rewards and release notes. Scores are read from synced rounds. */
(()=>{
'use strict';
const VERSION='2026-11-04';
const SKINS=[
{id:'diver',name:'Taucher',min:0,emoji:'🤿',color:'#7ce4d9'},
{id:'jelly',name:'Leuchtqualle',min:100,emoji:'🪼',color:'#83c8ff'},
{id:'crab',name:'Korallenkrabbe',min:200,emoji:'🦀',color:'#ff9981'},
{id:'phantom',name:'Phantom',min:400,emoji:'🐙',color:'#c9a0ff'},
{id:'angler',name:'Goldangler',min:600,emoji:'🐡',color:'#ffd68a'},
{id:'leviathan',name:'Leviathan',min:1000,emoji:'🐉',color:'#83f4cd'}];
let uid=null,db=null,fire=null,auth=null,profile=null,score=0,selected='diver',unsub=()=>{},lastSeen='',ready=false;
const css=document.createElement('style');css.textContent=`
.abg-perk-overlay{position:fixed;inset:0;background:#00101cce;z-index:99999;display:grid;place-items:center;padding:20px;backdrop-filter:blur(9px)}
.abg-perk-panel{width:min(540px,96vw);max-height:85vh;overflow:auto;background:linear-gradient(155deg,#0b2a39,#061522);border:1px solid #79e6dd65;border-radius:22px;padding:25px;color:#e6f8fa;box-shadow:0 20px 90px #000b;font-family:Manrope,system-ui}
.abg-perk-panel h2{font-size:24px;margin:8px 0 14px}.abg-perk-panel p{line-height:1.55;color:#a8c7d3}.abg-perk-panel button{border:1px solid #7de6dc77;background:#10313f;color:#e9ffff;border-radius:10px;padding:12px;cursor:pointer}
.abg-perk-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:16px 0}
.abg-perk-grid button{display:flex;flex-direction:column;gap:5px;align-items:center;min-height:116px}
.abg-perk-grid button[aria-pressed=true]{background:#155b60;border-color:#8ff8e9}.abg-perk-grid button:disabled{opacity:.45;cursor:not-allowed}
.abg-perk-avatar{font-size:35px;filter:drop-shadow(0 0 12px currentColor)}
.abg-perk-close{width:100%;background:#7ce4d9!important;color:#06232b!important;font-weight:800}
`;document.head.appendChild(css);
const localBest=()=>Math.max(0,...(window.ABGRUND_HISTORY?.list?.()||[]).map(x=>Number(x.score)||0));
function modal(title,body,action){document.querySelector('.abg-perk-overlay')?.remove();const wrap=document.createElement('div');wrap.className='abg-perk-overlay';const panel=document.createElement('section');panel.className='abg-perk-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');const h=document.createElement('h2');h.textContent=title;panel.append(h);const b=document.createElement('div');panel.append(b);body(b);const close=document.createElement('button');close.className='abg-perk-close';close.textContent=action||'WEITER TAUCHEN';close.onclick=()=>wrap.remove();panel.append(close);wrap.append(panel);document.body.append(wrap);wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};}
function release(){if(!uid||!ready||lastSeen===VERSION)return;lastSeen=VERSION;persist();modal('NEUES AUS DER TIEFE',b=>{const p=document.createElement('p');p.textContent='Mehr gültige Antworten, neue Skins und bessere Namensvorschläge. Deine höchste Punktzahl in EINER Runde schaltet Skins frei. Abgelehnte Antworten können künftig überprüft werden.';b.append(p)});}
function persist(){if(!uid||!db||!fire)return;fire.setDoc(fire.doc(db,'users',uid,'profile','preferences'),{skin:selected,seenUpdate:lastSeen}).catch(e=>console.warn('Perk preferences:',e.code||e.message));}
function choose(){if(!uid)return;score=Math.max(score,localBest());modal('DEINE TIEFSEE-SKINS',b=>{const p=document.createElement('p');p.textContent='Rundenbestleistung: '+score+' Punkte. Skins sind rein kosmetisch und beeinflussen deine Punkte nicht.';b.append(p);const grid=document.createElement('div');grid.className='abg-perk-grid';for(const skin of SKINS){const button=document.createElement('button'),available=score>=skin.min;button.disabled=!available;button.setAttribute('aria-pressed',String(selected===skin.id));const avatar=document.createElement('span');avatar.className='abg-perk-avatar';avatar.style.color=skin.color;avatar.textContent=skin.emoji;const name=document.createElement('strong');name.textContent=skin.name;const threshold=document.createElement('small');threshold.textContent=available?'FREIGESCHALTET':skin.min+' P IN EINER RUNDE';button.append(avatar,name,threshold);button.onclick=()=>{selected=skin.id;persist();choose()};grid.append(button)}b.append(grid)})}
const trigger=document.createElement('button');trigger.type='button';trigger.textContent='✦ SKINS';trigger.hidden=true;trigger.onclick=choose;trigger.style.cssText='background:#102b3a;color:#91eee2;border:1px solid #7de6dc55;border-radius:10px;padding:10px;cursor:pointer;font:11px monospace';document.getElementById('accountButton')?.insertAdjacentElement('afterend',trigger);
async function init(){try{const [a,f,g]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')]);fire=f;const app=a.getApps()[0]||a.initializeApp(window.ABGRUND_FIREBASE_CONFIG);db=f.getFirestore(app,window.ABGRUND_FIRESTORE_DATABASE||'(default)');auth=g.getAuth(app);g.onAuthStateChanged(auth,async u=>{unsub();unsub=()=>{};uid=u?.uid||null;ready=false;trigger.hidden=!uid;selected='diver';lastSeen='';score=localBest();if(!uid)return;unsub=f.onSnapshot(f.doc(db,'users',uid,'profile','preferences'),snap=>{const data=snap.data()||{};selected=SKINS.some(x=>x.id===data.skin)?data.skin:'diver';lastSeen=data.seenUpdate||'';ready=true;release()},()=>{ready=true;release()});f.onSnapshot(f.collection(db,'users',uid,'games'),snap=>{score=Math.max(localBest(),...snap.docs.map(d=>Number(d.data().score)||0));if(score<SKINS.find(s=>s.id===selected)?.min){selected='diver';persist()}},()=>{});});}catch(e){console.warn('Account perks unavailable',e.message)}}
window.ABGRUND_FEATURES={rejected:async(q,answer)=>{if(!uid||!db||!fire||!answer?.trim())return;try{await fire.addDoc(fire.collection(db,'rejectedAnswers'),{uid,question:q.q,answer:answer.trim(),status:'pending',createdAt:fire.serverTimestamp()})}catch(e){console.warn('Answer review queue:',e.code||e.message)}}};
init();
})();
