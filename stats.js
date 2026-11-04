/* No personal timing is inferred for rounds recorded before metrics were introduced. */
(()=>{'use strict';
const integer=(x,max=1e12)=>Number.isInteger(x)&&x>=0&&x<=max;
function round(save){
 const answers=save.answers||[],times=answers.filter(a=>!a.timedOut&&integer(a.responseMs,30000)).map(a=>a.responseMs);
 return {answered:answers.filter(a=>!a.timedOut).length,skipped:answers.filter(a=>a.skipped).length,timeouts:answers.filter(a=>a.timedOut&&!a.skipped).length,measured:times.length,responseMs:times.reduce((a,b)=>a+b,0),fastestMs:times.length?Math.min(...times):0,slowestMs:times.length?Math.max(...times):0,reports:Math.min(99,save.reportCount||0),failed:Math.min(999,save.failedAttempts||0),quick:times.filter(x=>x<5000).length,rare:answers.filter(a=>a.points>=85).length,full:answers.filter(a=>a.points===100).length};
}
function valid(m){return m&&['answered','skipped','timeouts','measured','responseMs','fastestMs','slowestMs','reports','failed','quick','rare','full'].every(k=>integer(m[k]))&&m.answered+m.skipped+m.timeouts===7&&m.measured<=m.answered&&m.responseMs<=m.measured*30000&&m.fastestMs<=30000&&m.slowestMs<=30000&&m.reports<=99&&m.failed<=999&&m.quick<=m.measured&&m.rare<=m.answered&&m.full<=m.rare}
function summary(games,nickname='Taucher'){
 const rows=games.filter(g=>integer(g.score,700)),measured=rows.filter(g=>valid(g.metrics)),times=measured.map(g=>g.metrics).filter(m=>m.measured);
 const sum=key=>measured.reduce((s,g)=>s+g.metrics[key],0);
 return {nickname,rounds:rows.length,totalPoints:rows.reduce((s,g)=>s+g.score,0),best:Math.max(0,...rows.map(g=>g.score)),metricsRounds:measured.length,answered:sum('answered'),skipped:sum('skipped'),timeouts:sum('timeouts'),measured:sum('measured'),responseMs:sum('responseMs'),fastestMs:times.length?Math.min(...times.map(m=>m.fastestMs)):0,slowestMs:Math.max(0,...times.map(m=>m.slowestMs)),reports:sum('reports'),failed:sum('failed'),quick:sum('quick'),rare:sum('rare'),full:sum('full'),perfectRounds:rows.filter(g=>g.score===700).length,recent:rows.slice().sort((a,b)=>String(a.day||a.id).localeCompare(String(b.day||b.id))).slice(-10).map(g=>g.score)};
}
function friendAverage(rows){const active=rows.filter(s=>s&&integer(s.rounds)&&s.rounds>0&&integer(s.totalPoints,s.rounds*700));return {players:active.length,average:active.length?active.reduce((sum,s)=>sum+s.totalPoints/s.rounds,0)/active.length:null}}
window.ABGRUND_STATS={round,valid,summary,friendAverage};
})();
