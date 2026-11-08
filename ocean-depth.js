/* Presentation only: one point remains ten metres; animation never changes timers or scores. */
(()=>{'use strict';
const MAX=7000,zones=[
 {at:0,name:'Lichtzone',description:'Sonnenlicht erreicht das Wasser.'},
 {at:200,name:'Dämmerzone',description:'Das Sonnenlicht wird schwächer.'},
 {at:1000,name:'Mitternachtszone',description:'Hier dringt kein Sonnenlicht mehr hin.'},
 {at:4000,name:'Abyssalzone',description:'Weite, dunkle Tiefsee.'},
 {at:6000,name:'Hadalzone',description:'Du erreichst die tiefen Ozeangräben.'}
];
const zoneAt=d=>zones.findLast(z=>d>=z.at)||zones[0],format=n=>Math.round(n).toLocaleString('de-DE');
const root=document.documentElement,hud=document.getElementById('hudDepth'),chip=hud?.parentElement;
if(!chip)return;
chip.classList.add('depth-hud');
const mini=document.createElement('div');mini.className='depth-mini';mini.setAttribute('role','meter');mini.setAttribute('aria-label','Tauchtiefe in Metern');mini.setAttribute('aria-valuemin','0');mini.setAttribute('aria-valuemax',String(MAX));mini.innerHTML='<span></span>';chip.append(mini);
let target=Math.min(MAX,Math.max(0,Number(save?.depth)||0)),displayed=target,frame=0,journey=null;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),isStill=()=>reduced.matches||root.dataset.motion==='paused'||document.hidden;
const status=document.createElement('p');status.className='sr-only';status.setAttribute('role','status');document.body.append(status);
function ensureJourney(){
 const core=document.querySelector('.reveal-core');
 if(!core){journey=null;return}
 if(core.querySelector('.depth-journey'))return;
 journey=document.createElement('section');journey.className='depth-journey';journey.setAttribute('aria-label','Dein Tauchfortschritt');
 journey.innerHTML='<div class="journey-scale" aria-hidden="true"><span class="journey-surface">0 m</span><div class="journey-track">'+zones.slice(1).map(z=>'<i style="top:'+z.at/MAX*100+'%"></i>').join('')+'<span class="journey-marker"></span></div><span class="journey-floor">7.000 m</span></div><div class="journey-copy"><p class="journey-zone"></p><strong class="journey-depth"></strong><p class="journey-description"></p><p class="journey-next"></p></div>';
 const bubble=core.querySelector('.reveal-bubble');if(bubble)bubble.replaceWith(journey);else core.prepend(journey);
 render(displayed);
}
function render(depth){
 displayed=depth;window.ABGRUND_WORLD?.draw(depth);const zone=zoneAt(Math.round(depth)),next=zones.find(z=>z.at>Math.round(depth)),progress=depth/MAX;
 root.style.setProperty('--ocean-progress',String(progress));
 // Water progressively loses visible light; only the scenery darkens, never the controls.
 const darkness=depth<=200?.12+depth/200*.18:depth<=1000?.3+(depth-200)/800*.45:.75+(depth-1000)/6000*.22;
 root.style.setProperty('--ocean-darkness',darkness.toFixed(4));
 mini.style.setProperty('--marker-y',(progress*46)+'px');mini.setAttribute('aria-valuenow',String(Math.round(target)));mini.setAttribute('aria-valuetext',format(target)+' Meter · '+zoneAt(target).name);
 if(hud)hud.textContent=format(depth)+' m';
 if(journey?.isConnected){
  journey.querySelector('.journey-marker').style.transform='translateY('+(progress*176)+'px)';
  journey.querySelector('.journey-zone').textContent=zone.name;
  journey.querySelector('.journey-depth').textContent=format(depth)+' m';
  journey.querySelector('.journey-description').textContent=zone.description;
  journey.querySelector('.journey-next').textContent=next?'Nächste Zone bei '+format(next.at)+' m':depth>=MAX?'7.000 m · Maximale Rundentiefe erreicht':'Rundenziel: 7.000 m';
 }
}
function settle(){cancelAnimationFrame(frame);frame=0;render(target)}
function update(value){
 const next=Math.min(MAX,Math.max(0,Number(value)||0));ensureJourney();
 if(next===target){if(!frame)render(next);return}
 const previous=target,from=displayed;target=next;cancelAnimationFrame(frame);frame=0;
 const crossed=zones.filter(z=>z.at>previous&&z.at<=next);
 status.textContent=crossed.length?crossed.map(z=>z.name+' erreicht').join('. ')+'. '+format(next)+' Meter.':'';
 if(next<=previous||isStill()){settle();return}
 const start=performance.now(),duration=800+Math.min(600,(next-previous)*.4);
 const tick=now=>{const t=Math.min(1,(now-start)/duration),eased=1-Math.pow(1-t,3);render(from+(target-from)*eased);if(t<1)frame=requestAnimationFrame(tick);else{frame=0;render(target)}};
 frame=requestAnimationFrame(tick);
}
window.ABGRUND_DEPTH={update,zoneAt,maximum:MAX};
new MutationObserver(ensureJourney).observe(document.getElementById('diveOverlay'),{childList:true});
new MutationObserver(()=>{if(isStill())settle()}).observe(root,{attributes:true,attributeFilter:['data-motion']});
reduced.addEventListener('change',()=>{if(isStill())settle()});document.addEventListener('visibilitychange',()=>{if(document.hidden)settle()});
ensureJourney();render(target);
})();
