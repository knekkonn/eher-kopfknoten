/* Interaction polish only. Animation never extends or pauses the round timer. */
(()=>{'use strict';
const nav=document.querySelector('.toplinks'),menu=document.getElementById('menuToggle');
function menuOpen(open){nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open))}
menu.onclick=()=>menuOpen(menu.getAttribute('aria-expanded')!=='true');
nav.addEventListener('click',e=>{if(e.target.closest('button'))menuOpen(false)});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.top'))menuOpen(false)});
const compact=matchMedia('(max-width:767px)');compact.addEventListener('change',()=>menuOpen(false));
// One icon family for navigation and actions; native text remains the accessible name.
const iconPaths={
 accountButton:'M20 21v-2a7 7 0 0 0-14 0v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 profileButton:'M16 21v-2a6 6 0 0 0-12 0v2 M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M20 21v-2a6 6 0 0 0-3-5 M17 3a4 4 0 0 1 0 8',
 skinsButton:'m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0',
 share:'M12 16V3 m-5 5 5-5 5 5 M5 13v8h14v-8',
 rules:'M10 9a2 2 0 1 1 3 2c-1 .5-1 1-1 2 M12 16h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 begin:'M12 3v17 m-7-7 7 7 7-7',newRound:'M19 7a8 8 0 1 0 1 8 M19 3v5h-5',
 submitAnswer:'m5 12 4 4L19 6',skipAnswer:'m5 5 9 7-9 7Z M19 5v14',
 next:'M12 3v17 m-7-7 7 7 7-7',continueDive:'M12 3v17 m-7-7 7 7 7-7'
};
const fixedLabels={profileButton:'Profil & Freunde',skinsButton:'Skins',share:'Teilen',rules:'Spielregeln'};
function syncIcons(){for(const [id,path] of Object.entries(iconPaths)){
 const button=document.getElementById(id);if(!button)continue;
 const raw=button.textContent.replace(/^[\s◎✦↗?▼↻▶＋+]+/u,'').replace(/[↗↷↓]+/gu,'').replace(/\s+/g,' ').trim();
 const label=fixedLabels[id]||(raw?raw[0].toLocaleUpperCase('de-DE')+raw.slice(1).toLocaleLowerCase('de-DE'):'');
 if(button.dataset.uiLabel===label&&button.querySelector('.ui-icon'))continue;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),p=document.createElementNS(svg.namespaceURI,'path'),span=document.createElement('span');
 svg.classList.add('ui-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');p.setAttribute('d',path);svg.append(p);span.textContent=label;button.replaceChildren(svg,span);button.dataset.uiLabel=label;
}}
new MutationObserver(syncIcons).observe(document.body,{subtree:true,childList:true});syncIcons();

const character=document.getElementById('diver'),previewSkin=document.querySelector('.preview-skin');
const hudCharacter=document.createElement('div');hudCharacter.className='hud-character';document.querySelector('.progresshud').prepend(hudCharacter);
function placeCharacter(){const playing=document.body.classList.contains('playing'),parent=playing?hudCharacter:previewSkin;if(parent&&character.parentElement!==parent)parent.append(character)}
new MutationObserver(placeCharacter).observe(document.body,{attributes:true,attributeFilter:['class']});placeCharacter();
const timer=document.querySelector('.timerbox');document.querySelector('.cardtop').append(timer);
const preview=document.querySelector('.home-preview');
window.ABGRUND_ARCHIVE?.ready.then(async()=>{
 const q=bank.find(q=>q.q==='Nenne eine Eissorte (auch Sorbet zählt).');if(!q)return;
 await window.ABGRUND_ARCHIVE.loadQuestion(q);const answer='Schokolade';if(!verifyFact(q,answer))return;
 preview.querySelector('h2').textContent=q.q;preview.querySelector('.preview-answer-text').textContent=window.ABGRUND_DISPLAY.answer(q,answer);
 const points=tierForAnswer(q,answer,null).points;preview.querySelector('.preview-points').textContent=points+' Punkte';preview.querySelector('.preview-depth').textContent=(points*10).toLocaleString('de-DE')+' Meter tiefer';
}).catch(()=>{});
const begin=document.getElementById('begin');
if(begin.disabled){const previous=begin.textContent;begin.textContent='FRAGEN WERDEN GELADEN …';begin.setAttribute('aria-busy','true');const loading=new MutationObserver(()=>{if(!begin.disabled){if(/^fragen werden geladen/i.test(begin.textContent.trim()))begin.textContent=previous;begin.removeAttribute('aria-busy');loading.disconnect()}});loading.observe(begin,{attributes:true,attributeFilter:['disabled']})}

const motion=document.getElementById('motionToggle'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let paused=false;
try{paused=localStorage.getItem('abgrundMotion')==='paused'}catch{}
function applyMotion(){const off=paused||reduced.matches;document.documentElement.dataset.motion=off?'paused':'on';motion.setAttribute('aria-pressed',String(off));motion.textContent=reduced.matches?'Bewegung reduziert':paused?'Bewegung aktivieren':'Bewegung pausieren';motion.disabled=reduced.matches;motion.title=reduced.matches?'Dein Gerät hat reduzierte Bewegung aktiviert.':''}
motion.onclick=()=>{paused=!paused;try{localStorage.setItem('abgrundMotion',paused?'paused':'on')}catch{}applyMotion()};reduced.addEventListener('change',applyMotion);applyMotion();
function visibility(){document.body.classList.toggle('tab-hidden',document.hidden)}document.addEventListener('visibilitychange',visibility);visibility();

const focusable='button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),summary,[tabindex="0"]';
const visible=node=>node.isConnected&&node.getClientRects().length>0&&!node.closest('[hidden],[inert]');
let active=null,returnTo=null,lastTrigger=null;const inertBefore=new Map();
document.addEventListener('click',e=>{const button=e.target.closest('button,a,summary');if(button&&!button.closest('[role=dialog]'))lastTrigger=button},true);
function restoreBackground(){for(const [node,value] of inertBefore){node.inert=value}inertBefore.clear()}
function dialogChanged(){
 const dialogs=[...document.querySelectorAll('[role=dialog]')].filter(node=>node.getClientRects().length&&!node.closest('[hidden]'));
 const dialog=dialogs.at(-1)||null;if(dialog===active)return;
 const previous=active;restoreBackground();active=dialog;document.body.classList.toggle('dialog-open',!!dialog);
 if(dialog){
  if(!previous)returnTo=lastTrigger||document.activeElement;
  dialog.tabIndex=-1;const host=[...document.body.children].find(node=>node===dialog||node.contains(dialog));
  for(const node of document.body.children)if(node!==host&&!['SCRIPT','STYLE','LINK'].includes(node.tagName)){inertBefore.set(node,node.inert);node.inert=true}
  const target=[...dialog.querySelectorAll(focusable)].find(visible)||dialog;target.focus({preventScroll:true});
 }else if(previous){const target=returnTo&&visible(returnTo)?returnTo:compact.matches?menu:document.getElementById('begin');if(target&&visible(target))target.focus({preventScroll:true});returnTo=null;lastTrigger=null}
}
const observer=new MutationObserver(dialogChanged);observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});dialogChanged();
function closeDialog(){
 if(!active)return;
 if(active.id==='modal')document.getElementById('closeModal').click();
 else if(active.classList.contains('account-card'))document.getElementById('accountClose').click();
 else if(active.classList.contains('abg-perk-panel'))active.querySelector('.abg-perk-close')?.click();
 else active.closest('.social-overlay')?.remove();
}
window.addEventListener('keydown',e=>{
 if(!active){if(e.key==='Escape'&&nav.classList.contains('is-open')){e.preventDefault();menuOpen(false);menu.focus()}return}
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeDialog();return}
 if(e.key==='Enter')e.stopPropagation(); // Never advance the game behind an open dialog.
 if(e.key!=='Tab')return;
 const controls=[...active.querySelectorAll(focusable)].filter(visible);
 if(!controls.length){e.preventDefault();active.focus();return}
 const first=controls[0],last=controls.at(-1);
 if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus()}
},true);
document.addEventListener('focusin',e=>{if(active&&!active.contains(e.target)){([ ...active.querySelectorAll(focusable)].find(visible)||active).focus({preventScroll:true})}});

const answer=document.getElementById('answer');answer.setAttribute('aria-describedby','question answerSuggestion');
new MutationObserver(()=>{if(!answer.disabled&&!active&&visible(answer))answer.focus({preventScroll:true})}).observe(answer,{attributes:true,attributeFilter:['disabled']});
const overlay=document.getElementById('diveOverlay');new MutationObserver(()=>{if(active)return;const target=overlay.querySelector('#continueDive,.final-header h2');if(target&&visible(target)){target.tabIndex=target.tagName==='BUTTON'?0:-1;target.focus({preventScroll:true})}}).observe(overlay,{childList:true});
document.querySelector('.gamecard').removeAttribute('aria-live');document.getElementById('response').setAttribute('role','status');document.getElementById('timerText').setAttribute('role','timer');document.getElementById('timerText').setAttribute('aria-live','off');document.getElementById('toast').setAttribute('role','status');
})();
