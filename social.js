/* Private profiles and mutually confirmed friendships. No email/name directory is exposed. */
(()=>{'use strict';
let fire,db,auth,uid=null,generation=0,identity=null,stopFriends=()=>{},stops=new Map(),relations=[],profiles=new Map(),publishTimer;
const trigger=document.createElement('button');trigger.type='button';trigger.id='profileButton';trigger.className='toplink';trigger.textContent='◎ PROFIL & FREUNDE';trigger.hidden=true;document.getElementById('accountButton')?.insertAdjacentElement('afterend',trigger);
const ownStats=()=>window.ABGRUND_STATS.summary(window.ABGRUND_HISTORY?.list?.()||[],identity?.nickname||'Taucher');
function el(tag,text,className){const node=document.createElement(tag);if(text!=null)node.textContent=text;if(className)node.className=className;return node}
function action(label,fn){const button=el('button',label,'social-action');button.type='button';button.onclick=()=>Promise.resolve().then(fn).catch(e=>notice(e.code==='permission-denied'?'Zugriff nicht erlaubt. Bitte Anmeldung und Freundschaft prüfen.':'Das hat nicht geklappt. Bitte Verbindung prüfen.'));return button}
function notice(text){const node=document.getElementById('socialStatus');if(node)node.textContent=text;else toast(text)}
function close(){document.querySelector('.social-overlay')?.remove()}
function panel(title){close();const overlay=el('div',null,'social-overlay'),card=el('section',null,'social-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',title);card.append(el('h2',title));const body=el('div');card.append(body,el('p','','social-status'),action('SCHLIESSEN',close));card.querySelector('.social-status').id='socialStatus';overlay.append(card);overlay.onclick=e=>{if(e.target===overlay)close()};document.body.append(overlay);return body}
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
function chart(stats){
 const wrap=el('div',null,'profile-chart'),count=stats.recent.length,average=stats.recent.reduce((a,b)=>a+b,0)/count;
 wrap.append(el('h3','Deine letzten '+count+' '+(count===1?'Runde':'Runden')),el('p','Ø '+average.toLocaleString('de-DE',{maximumFractionDigits:1})+' Punkte in diesem Verlauf','profile-chart-summary'));
 const units=el('p',null,'profile-chart-units');units.append(el('span','Punkte'),el('span','Runde →'));wrap.append(units);
 const plot=el('div',null,'profile-plot'),axis=el('div',null,'profile-axis'),bars=el('div',null,'profile-bars'),accessible=el('ol',null,'sr-only');
 axis.setAttribute('aria-hidden','true');for(const value of ['700','350','0'])axis.append(el('span',value));bars.setAttribute('aria-hidden','true');
 for(const [i,score] of stats.recent.entries()){
  const round=stats.rounds-count+i+1,bar=el('div');bar.style.height=Math.max(0,score/700*100)+'%';bar.title='Runde '+round+': '+score+' Punkte';bar.append(el('span',String(score)),el('span',String(round),'round-label'));bars.append(bar);accessible.append(el('li',bar.title));
 }
 plot.append(axis,bars);wrap.append(plot,accessible);return wrap;
}
function renderStats(body,stats){
 const average=stats.rounds?stats.totalPoints/stats.rounds:0,known=stats.metricsRounds*7;
 const values=[['Tauchgänge',stats.rounds],['Bestleistung',stats.best+' P'],['Punktedurchschnitt',stats.rounds?average.toLocaleString('de-DE',{maximumFractionDigits:1})+' P':'—'],['Punkte insgesamt',stats.totalPoints.toLocaleString('de-DE')],['Perfekte 700er-Runden',stats.perfectRounds],['Ø gültige Abgabezeit',stats.measured?(stats.responseMs/stats.measured/1000).toLocaleString('de-DE',{maximumFractionDigits:1})+' s':'Nicht erfasst'],['Schnellste Antwort',stats.measured?(stats.fastestMs/1000).toLocaleString('de-DE',{maximumFractionDigits:1})+' s':'—'],['Langsamste Antwort',stats.measured?(stats.slowestMs/1000).toLocaleString('de-DE',{maximumFractionDigits:1})+' s':'—'],['Antworten unter 5 Sekunden',stats.quick],['Richtig beantwortet',stats.answered],['Fragen übersprungen',stats.skipped],['Zeit abgelaufen',stats.timeouts],['Ungültige Versuche',stats.failed],['Begriffe gemeldet',stats.reports],['Seltene Treffer (85/100 P)',stats.rare],['100-Punkte-Antworten',stats.full],['Antwortquote',known?(stats.answered/known*100).toFixed(1)+' %':'—'],['Skip-Quote',known?(stats.skipped/known*100).toFixed(1)+' %':'—'],['Timeout-Quote',known?(stats.timeouts/known*100).toFixed(1)+' %':'—']];
 const grid=el('div',null,'profile-stat-grid');for(const [label,value] of values){const tile=el('div');tile.append(el('small',label),el('strong',String(value)));grid.append(tile)}body.append(grid);
 const badges=el('div',null,'profile-badges');for(const [count,label] of [[stats.quick,'Blitz-Taucher'],[stats.skipped,'Abkürzungs-Profi'],[stats.timeouts,'Duell mit der Uhr'],[stats.reports,'Wörter-Scout'],[stats.full,'Perlentaucher']])if(count)badges.append(el('span',label+' · '+count));if(badges.childNodes.length)body.append(badges);
 body.append(el('p','Zeit- und Detailstatistiken: '+stats.metricsRounds+' von '+stats.rounds+' Runden erfasst. Ältere Runden behalten ihre Punkte; fehlende Zeiten werden nicht geschätzt.','social-caption'));
 if(stats.recent.length)body.append(chart(stats));
 if(known){const line=el('div',null,'outcome-bar');for(const [key,label] of [['answered','Richtig'],['skipped','Übersprungen'],['timeouts','Zeit abgelaufen']]){const part=el('span',null,key);part.style.width=stats[key]/known*100+'%';part.title=label+': '+stats[key];part.setAttribute('aria-label',part.title);part.setAttribute('role','img');line.append(part)}body.append(el('h3','DEIN TAUCHVERHALTEN'),line,el('p',stats.answered+' beantwortet · '+stats.skipped+' übersprungen · '+stats.timeouts+' mal Zeit abgelaufen','social-caption'))}
}
function showFriend(friendId){const stats=profiles.get(friendId);if(!stats){notice('Das Profil ist noch nicht verfügbar. Die Person muss sich mit der neuen Version anmelden.');return}const body=panel(stats.nickname+' · PROFIL');renderStats(body,stats);body.append(el('p','Nur bestätigte Freunde können dieses Profil sehen. Synchronisierte persönliche Spielstatistik.','social-caption'),action('ZURÜCK ZU DEINEM PROFIL',show));}
function show(){
 if(!uid||!identity)return;
 const body=panel('DEIN TAUCHPROFIL');const jump=el('a','Direkt zu deinen Freunden ↓','profile-jump');jump.href='#profileFriends';body.append(jump);renderStats(body,ownStats());
 const name=el('input');name.maxLength=24;name.value=identity.nickname;name.setAttribute('aria-label','Dein Profilname');body.append(el('h3','PROFILNAME'),name,action('NAMEN SPEICHERN',async()=>{const nickname=name.value.trim();if(nickname.length<2){notice('Bitte 2–24 Zeichen eingeben.');return}await fire.updateDoc(fire.doc(db,'users',uid,'profile','social'),{nickname});identity.nickname=nickname;await publish();notice('Profilname gespeichert.')}));
 const friendsHeading=el('h3','DEIN FREUNDESCODE');friendsHeading.id='profileFriends';friendsHeading.tabIndex=-1;jump.onclick=e=>{e.preventDefault();friendsHeading.scrollIntoView({block:'start'});friendsHeading.focus({preventScroll:true})};body.append(friendsHeading,el('p',identity.code,'friend-code'),action('CODE KOPIEREN',async()=>{await navigator.clipboard.writeText(identity.code);notice('Freundescode kopiert.')}));
 const input=el('input');input.placeholder='Freundescode einfügen';input.autocomplete='off';input.maxLength=32;input.setAttribute('aria-label','Freundescode');body.append(el('h3','FREUND HINZUFÜGEN'),input,action('FREUNDSCHAFT ANFRAGEN',async()=>{
  const owner=uid,epoch=generation,code=input.value.trim().toLowerCase();if(!/^[a-f0-9]{32}$/.test(code)){notice('Bitte einen vollständigen Freundescode eingeben.');return}
  const snap=await fire.getDoc(fire.doc(db,'friendCodes',code)),other=snap.data()?.uid;if(epoch!==generation||owner!==uid)return;if(!other){notice('Freundescode nicht gefunden.');return}if(other===uid){notice('Das ist dein eigener Code.');return}if(relations.some(r=>r.other===other)){notice('Es besteht bereits eine Freundschaft oder Anfrage.');return}
  const from=uid,to=other,data={from,to,fromName:identity.nickname,status:'pending',createdAt:fire.serverTimestamp()},batch=fire.writeBatch(db);batch.set(fire.doc(db,'users',from,'friends',to),data);batch.set(fire.doc(db,'users',to,'friends',from),data);await batch.commit();notice('Freundschaftsanfrage gesendet.');
 }));
 const list=el('div');list.id='friendList';body.append(el('h3','FREUNDE & ANFRAGEN'),list,el('p','Erst nach Annahme sehen beide Seiten die Profilstatistiken. E-Mail-Adressen, einzelne Antworten und private Rundendokumente bleiben verborgen.','social-caption'));renderFriendList();
}
async function updateRelation(relation,accept){
 const batch=fire.writeBatch(db),a=fire.doc(db,'users',uid,'friends',relation.other),b=fire.doc(db,'users',relation.other,'friends',uid);
 if(accept){batch.update(a,{status:'accepted'});batch.update(b,{status:'accepted'})}else{batch.delete(a);batch.delete(b)}await batch.commit();
}
function renderFriendList(){const list=document.getElementById('friendList');if(!list)return;list.replaceChildren();if(!relations.length)list.append(el('p','Noch keine Freunde. Teile deinen Code mit jemandem.'));
 for(const relation of relations){const row=el('div',null,'friend-row'),stats=profiles.get(relation.other),incoming=relation.to===uid;
  row.append(el('strong',stats?.nickname||(incoming?relation.fromName:'Anfrage gesendet')));
  if(relation.status==='accepted'){row.append(el('small',stats?stats.rounds+' Runden · Ø '+(stats.rounds?stats.totalPoints/stats.rounds:0).toLocaleString('de-DE',{maximumFractionDigits:1})+' P':'Profil noch nicht synchronisiert'),action('PROFIL ANSEHEN',()=>showFriend(relation.other)),action('ENTFERNEN',()=>updateRelation(relation,false)))}
  else if(incoming)row.append(action('ANNEHMEN',()=>updateRelation(relation,true)),action('ABLEHNEN',()=>updateRelation(relation,false)));else row.append(action('ANFRAGE ZURÜCKZIEHEN',()=>updateRelation(relation,false)));
  list.append(row);
 }
}
function friendAverage(){return window.ABGRUND_STATS.friendAverage(relations.filter(r=>r.status==='accepted').map(r=>profiles.get(r.other)))}
function endSummary(){document.getElementById('friendAverage')?.remove();if(!uid)return;const board=document.querySelector('.final-board');if(!board)return;const stats=friendAverage(),section=el('section',null,'chart-panel');section.id='friendAverage';section.append(el('h3','DEINE FREUNDE'),el('strong',stats.players?stats.average.toLocaleString('de-DE',{maximumFractionDigits:1})+' PUNKTE IM DURCHSCHNITT':'Noch keine geteilten Runden'),el('p',stats.players?stats.players+' bestätigte Freunde mit Runden · jede Person zählt gleich.':'Füge Freunde im Profil hinzu. Der Vergleich erscheint, sobald Profile synchronisiert sind.','social-caption'));board.append(section)}
const oldFinish=finish;finish=()=>{oldFinish();endSummary()};trigger.onclick=async()=>{if(!uid)return;try{const owner=uid,epoch=generation;if(!identity){const value=await ensureIdentity(owner);if(epoch!==generation)return;identity=value}show()}catch{toast('Profil konnte nicht geladen werden. Bitte Verbindung prüfen.')}};
async function ensureIdentity(owner){
 const ref=fire.doc(db,'users',owner,'profile','social');return fire.runTransaction(db,async tx=>{const snap=await tx.get(ref);if(snap.exists())return snap.data();const data={code:Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),nickname:'Taucher'};const codeRef=fire.doc(db,'friendCodes',data.code);if((await tx.get(codeRef)).exists())throw Error('code-collision');tx.set(ref,data);tx.set(codeRef,{uid:owner});return data});
}
async function publish(){if(!uid||!identity||!window.ABGRUND_ACCOUNTS?.synced?.())return;const owner=uid,data={...ownStats(),updatedAt:fire.serverTimestamp()};try{await fire.setDoc(fire.doc(db,'users',owner,'profile','stats'),data)}catch(e){console.warn('Profile sync:',e.code||e.message)}}
window.addEventListener('abgrund-history',()=>{clearTimeout(publishTimer);publishTimer=setTimeout(publish,300)});
(async()=>{try{
 const [a,f,g]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')]);fire=f;const app=a.getApps()[0]||a.initializeApp(window.ABGRUND_FIREBASE_CONFIG);db=f.getFirestore(app,window.ABGRUND_FIRESTORE_DATABASE||'(default)');auth=g.getAuth(app);
 g.onAuthStateChanged(auth,async user=>{
  const request=++generation;stopFriends();for(const stop of stops.values())stop();stops.clear();relations=[];profiles.clear();close();uid=user?.uid||null;identity=null;trigger.hidden=!uid;endSummary();if(!uid)return;const owner=uid;
  try{const value=await ensureIdentity(owner);if(request!==generation)return;identity=value;await publish();if(request!==generation)return;
   stopFriends=f.onSnapshot(f.collection(db,'users',owner,'friends'),snap=>{
    if(request!==generation)return;relations=snap.docs.map(doc=>({other:doc.id,...doc.data()}));const accepted=new Set(relations.filter(r=>r.status==='accepted').map(r=>r.other));
    for(const [id,stop] of stops)if(!accepted.has(id)){stop();stops.delete(id);profiles.delete(id)}
    for(const id of accepted)if(!stops.has(id))stops.set(id,f.onSnapshot(f.doc(db,'users',id,'profile','stats'),profile=>{if(request!==generation)return;const data=profile.data();if(data)profiles.set(id,data);else profiles.delete(id);renderFriendList();endSummary()},()=>{if(request!==generation)return;profiles.delete(id);renderFriendList();endSummary()}));
    renderFriendList();endSummary();
   },e=>console.warn('Friends sync:',e.code));
  }catch(e){console.warn('Social profile:',e.code||e.message)}
 });
}catch(e){console.warn('Social unavailable:',e.message)}})();
window.ABGRUND_SOCIAL={show,friendAverage};
})();
