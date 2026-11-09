/* Original scene choreography inspired by the supplied gameplay recording. No remote runtime. */
(()=>{'use strict';
const body=document.body,main=document.getElementById('main'),answer=document.querySelector('.answerfield'),overlay=document.getElementById('diveOverlay');
const dock=document.createElement('section');dock.className='ocean-answer-dock';dock.setAttribute('aria-label','Deine Antwort eingeben');dock.append(answer);main.append(dock);main.insertBefore(overlay,dock);
const swimmer=document.createElement('div');swimmer.className='world-swimmer';swimmer.setAttribute('aria-hidden','true');main.insertBefore(swimmer,dock);
const world=document.createElement('div');world.className='ocean-life';world.setAttribute('aria-hidden','true');world.innerHTML='<div class="ocean-rays"></div><div class="ocean-particles">'+Array.from({length:18},(_,i)=>'<i style="--x:'+((i*37+13)%100)+'%;--delay:-'+(i*1.7)+'s;--duration:'+(14+i%7*2)+'s;--size:'+(2+i%3)+'px"></i>').join('')+'</div><div class="dive-wake"></div>';body.prepend(world);
const ruler=document.createElement('aside');ruler.className='world-ruler';ruler.setAttribute('aria-hidden','true');ruler.innerHTML='<span class="ruler-unit">Meter</span><div class="ruler-ticks"></div><span class="ruler-you"></span>';body.append(ruler);
const ticks=ruler.querySelector('.ruler-ticks'),marker=ruler.querySelector('.ruler-you'),wakeHost=world.querySelector('.dive-wake');
const banner=document.createElement('div');banner.className='ocean-milestone';banner.setAttribute('aria-hidden','true');body.append(banner);
const card=document.querySelector('.gamecard');
function positionSwimmer(){if(card.getClientRects().length)swimmer.style.setProperty('--swimmer-top',(card.offsetTop+card.offsetHeight+20)+'px')}
new ResizeObserver(positionSwimmer).observe(card);addEventListener('resize',positionSwimmer);
let depth=0,previousZone='',previousPlaying=false,previousReveal=false,previousFinal=false,surfaceFrame=0;
const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)'),still=()=>reduced.matches||root.dataset.motion==='paused'||document.hidden;
function place(){const character=document.getElementById('diver');if(!character)return;const destination=body.classList.contains('playing')?swimmer:document.querySelector('.preview-skin');if(destination&&character.parentElement!==destination)destination.append(character)}
function draw(value){
 depth=value;const start=Math.max(0,Math.min(6000,value-500));
 const first=Math.ceil(start/200)*200,values=Array.from({length:6},(_,i)=>first+i*200).filter(v=>v<=Math.min(7000,start+1000));
 while(ticks.children.length<values.length)ticks.append(document.createElement('span'));while(ticks.children.length>values.length)ticks.lastElementChild.remove();
 values.forEach((v,i)=>{const tick=ticks.children[i],label=Math.round(v).toLocaleString('de-DE');tick.style.top=((v-start)/1000*100)+'%';if(tick.textContent!==label)tick.textContent=label});
 marker.style.top='calc(24px + (100% - 48px) * '+((value-start)/1000)+')';
 root.style.setProperty('--world-camera',Math.min(320,value*.06)+'px');root.style.setProperty('--ray-strength',String(Math.max(0,1-value/1000)));
 const zone=window.ABGRUND_DEPTH?.zoneAt(Math.round(value));
 if(zone&&zone.name!==previousZone){if(previousZone&&value>0&&!body.classList.contains('run-complete')){banner.textContent=zone.name;banner.classList.remove('is-visible');void banner.offsetWidth;banner.classList.add('is-visible')}previousZone=zone.name}
}
function wake(){if(still())return;const host=wakeHost,rect=swimmer.getBoundingClientRect();if(rect.width){host.style.left=(rect.x+rect.width/2)+'px';host.style.top=(rect.y+rect.height/2)+'px'}host.replaceChildren(...Array.from({length:12},(_,i)=>{const bubble=document.createElement('i');bubble.style.setProperty('--drift',((i%5-2)*20)+'px');bubble.style.setProperty('--delay',(i*.045)+'s');bubble.style.setProperty('--size',(3+i%4*2)+'px');return bubble}))}
function surface(){
 cancelAnimationFrame(surfaceFrame);const from=depth,start=performance.now();
 const tick=now=>{const t=still()?1:Math.min(1,(now-start)/1400),remaining=from*Math.pow(1-t,3);root.style.setProperty('--ocean-darkness',String(.12+.85*(remaining/7000)));root.style.setProperty('--world-camera',Math.min(320,remaining*.06)+'px');root.style.setProperty('--ray-strength',String(1-remaining/7000));if(t<1)surfaceFrame=requestAnimationFrame(tick);else surfaceFrame=0};surfaceFrame=requestAnimationFrame(tick);
}
function state(){
 const playing=body.classList.contains('playing'),reveal=body.classList.contains('answer-revealing'),final=body.classList.contains('run-complete');place();
 if(playing&&!previousPlaying){wake()}
 if(reveal&&!previousReveal){wake()}
 if(final&&!previousFinal){body.classList.add('ocean-surfacing');surface()}
 if(!final&&previousFinal){body.classList.remove('ocean-surfacing');cancelAnimationFrame(surfaceFrame);surfaceFrame=0;draw(Number(save.depth)||0)}
 positionSwimmer();previousPlaying=playing;previousReveal=reveal;previousFinal=final;
}
window.ABGRUND_WORLD={draw};new MutationObserver(state).observe(body,{attributes:true,attributeFilter:['class']});state();draw(Number(save.depth)||0);
new MutationObserver(()=>{if(still()){wakeHost.replaceChildren();banner.classList.remove('is-visible')}}).observe(root,{attributes:true,attributeFilter:['data-motion']});
})();
