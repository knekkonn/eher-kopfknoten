/* Firebase identities + server-timed community rounds. Guest play remains available. */
(()=>{
'use strict';const endpoint=window.ABGRUND_COMMUNITY_URL;if(!endpoint)return;
const scoreCache=new Map();let latest=null,lastStatsAt=0;
async function api(path,body,token){const r=await fetch(endpoint+path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(2500)});const value=await r.json();if(!r.ok)throw Object.assign(Error(value.error||'Community offline'),{status:r.status});return value}
const identity=()=>window.ABGRUND_ACCOUNTS?.identity?.()||null;
const token=()=>Promise.race([window.ABGRUND_ACCOUNTS?.getToken?.()||Promise.resolve(null),new Promise(resolve=>setTimeout(()=>resolve(null),1800))]);
async function refreshStats(){try{latest=await api('/stats');lastStatsAt=Date.now();window.ABGRUND_COMMUNITY.latest=latest;return latest}catch{return latest}}
async function questionScores(q){const id=q.archiveId||q.communityId;if(!id)return null;const version=save.communityRound?.version||save.communityVersion||latest?.version||'archive',key=version+':'+id;if(!scoreCache.has(key))scoreCache.set(key,api('/scores?q='+encodeURIComponent(id)+'&version='+encodeURIComponent(version)).then(r=>new Map(r.scores.map(x=>[x.answer_hash,x.points]))).catch(()=>new Map()));return scoreCache.get(key)}
async function digest(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,32)}
async function prepare(q){await ready;const uid=identity();if(save.idx===0&&!save.communityVersion){if(Date.now()-lastStatsAt>60000)await refreshStats();save.communityVersion=latest?.version||'archive';store()}
 if(save.idx===0&&!save.communityRound&&uid){try{const bearer=await token();if(bearer){const round=await api('/rounds',{questions:deck.map(x=>x.archiveId||x.communityId)},bearer);save.communityRound={...round,uid};store()}}catch{}}
 await questionScores(q);
 if(save.communityRound?.uid===uid&&uid&&!save.answers[save.idx]){try{const r=await api('/begin',{round:save.communityRound.id,index:save.idx},await token());const deadline=Date.now()+r.remainingMs;save.questionDeadline=save.questionDeadlineIndex===save.idx&&save.questionDeadline?Math.min(save.questionDeadline,deadline):deadline;save.questionDeadlineIndex=save.idx;store()}catch{save.communityRoundFailed=true}}
}
async function record(q,text,timedOut){const uid=identity(),id=q.archiveId||q.communityId;let publicPoints=null;
 if(!timedOut&&id){const scores=await questionScores(q);const h=await digest(id+'\n'+normalizeFactText(canonicalAnswer(q,text)));publicPoints=scores?.get(h)??null}
 if(save.communityRound?.uid!==uid||!uid||save.communityRoundFailed)return Number.isFinite(publicPoints)?{points:publicPoints}:null;
 try{let r;try{r=await api('/answer',{round:save.communityRound.id,index:save.idx,answer:canonicalAnswer(q,text),timedOut},await token())}catch(e){if(e.status!==422)throw e;await api('/answer',{round:save.communityRound.id,index:save.idx,unsupported:true},await token());return Number.isFinite(publicPoints)?{points:publicPoints}:null}
  if(r.complete)await refreshStats();return r;
 }catch{return Number.isFinite(publicPoints)?{points:publicPoints}:null}
}
const originalCurve=scoreCurveSvg,originalLegend=scoreCurveLegend,originalFinish=finish;
scoreCurveSvg=(history,score)=>{let svg=originalCurve(history,score);if(!Number.isFinite(latest?.average))return svg;const x=28+latest.average/700*304;let curve='';if(latest.players>=10&&latest.histogram?.length){const density=v=>latest.histogram.reduce((s,b)=>s+b.count*Math.exp(-.5*((v-(b.bucket+12.5))/55)**2),0);const max=Math.max(1,...Array.from({length:71},(_,i)=>density(i*10)));curve='<path class="community-density" d="'+Array.from({length:71},(_,i)=>(i?'L':'M')+(28+i/70*304).toFixed(2)+' '+(116-density(i*10)/max*82).toFixed(2)).join(' ')+'"/>'}
 return svg.replace('</svg>',curve+'<g class="community-marker"><title>Spielerdurchschnitt '+formatScoreAverage(latest.average)+' Punkte</title><line x1="'+x+'" y1="16" x2="'+x+'" y2="120"/><circle cx="'+x+'" cy="17" r="4"/></g></svg>')};
scoreCurveLegend=(history,score)=>originalLegend(history,score)+'<div class="community-summary"><span class="community-dot"></span><div><small>SPIELERDURCHSCHNITT</small><strong>'+(Number.isFinite(latest?.average)?formatScoreAverage(latest.average)+' P':'Noch keine Daten')+'</strong><p>'+(latest?.players?latest.players+' bestätigte '+(latest.players===1?'Person':'Personen')+' · '+latest.rounds+' geprüfte Runden':'Entsteht aus vollständig geprüften Runden bestätigter Konten.')+'</p></div></div><p class="chart-caption">Tägliche Punkte: Häufigkeit und Antwortzeit der letzten 30 Tage. Ab 10 Personen und 30 Antworten je Frage; vorher gelten die Archivpunkte.</p>';
finish=()=>{originalFinish();void refreshStats().then(()=>{const panel=document.querySelector('.final-board .chart-panel');if(panel){const history=readScoreHistory();panel.innerHTML='<div class="chart-heading"><span>DEIN VERGLEICH</span><small>0–700 PUNKTE</small></div>'+scoreCurveSvg(history,save.points||0)+scoreCurveLegend(history,save.points||0)}})};
const ready=(async()=>{await window.ABGRUND_ARCHIVE?.ready;try{const r=await fetch('./community-questions.json');if(r.ok){const rows=await r.json(),lookup=new Map(bank.map(q=>[normalizeFactText(q.q),q]));for(const row of rows){const q=lookup.get(normalizeFactText(row.q));if(q)q.communityId=row.id}}}catch{}await refreshStats()})();
window.ABGRUND_COMMUNITY={prepare,record,refreshStats,ready,latest};
})();
