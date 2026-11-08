/* Complete dated archive, fetched by dive on demand. Source scores remain question-scoped. */
(()=>{
'use strict';
const norm=normalizeFactText,loadCache=new Map();
const oldCanonical=canonicalAnswer,oldVerify=verifyFact,oldCompletion=completionOptions,oldShow=showQ,oldExamples=archivedTierExamples;
const own=(map,key)=>map&&Object.prototype.hasOwnProperty.call(map,key)?map[key]:undefined;
canonicalAnswer=(q,text)=>own(q?.archiveRawNames,String(text).trim().toLocaleLowerCase('de-DE'))||oldCanonical(q,text);
verifyFact=(q,text)=>q.archiveLookup?!!own(q.archiveRawNames,String(text).trim().toLocaleLowerCase('de-DE'))||q.archiveLookup.has(norm(text)):oldVerify(q,text);
completionOptions=(q,input)=>{
 if(!q||!q.archiveLookup||q.answers.length<1000)return oldCompletion(q,input);
 const key=norm(input);if(key.length<5||q.archiveLookup.has(key))return{suggestion:'',ambiguous:false};
 const parts=key.split(' ').length,groups=new Map();
 // Prefix-only suggestions are bounded; never run fuzzy edit-distance against a huge list.
 for(const answer of q.answers){const name=norm(answer);if(!name.startsWith(key))continue;
  const canonical=norm(canonicalAnswer(q,answer));groups.set(canonical,answer);
  if(groups.size>1)return{suggestion:'',ambiguous:true};
 }
 const answer=[...groups.values()][0],name=answer&&norm(answer);
 return{suggestion:answer&&name.split(' ').length===parts&&key.length/name.length>=.8?answer:'',ambiguous:false};
};
archivedTierExamples=q=>q.archiveExamples?'<details class="tier-examples"><summary>BEISPIELE FÜR DIE PUNKTSTUFEN</summary><ul>'+SCORE_TIERS.filter(t=>q.archiveExamples[t.points]?.length).map(t=>'<li><b>'+esc(t.name)+' · '+t.points+' P:</b> '+q.archiveExamples[t.points].map(a=>esc(window.ABGRUND_DISPLAY?.answer(q,a)||a)).join(', ')+'</li>').join('')+'</ul><small>Gespeicherte Archivpunkte. Deutsche und englische Bezeichnungen derselben Antwort zählen gleich.</small></details>':oldExamples(q);
async function fetchDive(path){
 if(!loadCache.has(path))loadCache.set(path,(async()=>{
  const r=await fetch('./'+path);if(!r.ok)throw Error('archive unavailable');const bytes=new Uint8Array(await r.arrayBuffer());let text;
  if(bytes[0]===31&&bytes[1]===139){const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));text=await new Response(stream).text()}else text=new TextDecoder().decode(bytes);
  const rows=JSON.parse(text);if(!Array.isArray(rows))throw Error('invalid archive');return rows;
 })().catch(e=>{loadCache.delete(path);throw e}));
 return loadCache.get(path);
}
async function loadQuestion(q){
 if(!q.archiveAssets||q.archiveLoaded)return q;
 const sources=await Promise.all(q.archiveAssets.map(async asset=>{const dive=await fetchDive(asset.path);const record=dive.find(x=>x.id===asset.id);if(!record)throw Error('missing question');return record}));
 const answers=new Map((q.answers||[]).map(a=>[norm(a),a]));
 q.archiveGermanNames||={};q.archiveCanonicalByNorm||=new Map();q.answerAliases||={};q.scoreOverrides||={};q.archiveRawScores||={};q.archiveRawNames||=Object.create(null);q.suppliedTiers=true;
 // Dated records are processed from old to new. Newer snapshots determine repeated scores.
 for(const source of sources)for(const [answer,points,aliases=[]] of source.rows){
  const candidates=aliases.filter(a=>norm(a)!==norm(answer)&&!/^the /i.test(a)&&!/^\p{Ll}/u.test(a));
  if(candidates.length){const preferred=candidates.find(a=>/[äöüÄÖÜß]/.test(a))||candidates[0];q.archiveGermanNames[norm(answer)]=preferred}
  const raw=answer.trim().toLocaleLowerCase('de-DE');q.archiveRawNames[raw]=answer;q.archiveRawScores[raw]=points;const key=norm(answer);if(!key)continue;q.archiveCanonicalByNorm.set(key,answer);answers.set(key,answer);q.archiveRawNames[answer.trim().toLocaleLowerCase('de-DE')]=answer;q.archiveRawScores[answer.trim().toLocaleLowerCase('de-DE')]=points;q.scoreOverrides[key]=points;
  for(const alias of aliases){const a=norm(alias);if(!a){q.archiveRawNames[alias.trim().toLocaleLowerCase('de-DE')]=answer;continue}if(a===key)continue;answers.set(a,alias);q.answerAliases[a]=answer}
 }
 // An alias never shadows a full canonical answer from the archive.
 for(const source of sources)for(const [answer] of source.rows)delete q.answerAliases[norm(answer)];
 q.answers=[...answers.values()];q.archiveLookup=new Set(answers.keys());q.archiveLoaded=true;
 return q;
}
async function resolveGerman(q,text){
 if(!q.archiveLoaded||text.length>180||!norm(text))return false;
 const cacheKey='abgrundGermanAliasV1:'+q.archiveId+':'+norm(text);
 const apply=canonical=>{if(!q.archiveCanonicalByNorm.has(norm(canonical)))return false;q.answerAliases[norm(text)]=canonical;q.archiveLookup.add(norm(text));if(!q.answers.some(a=>norm(a)===norm(text)))q.answers.push(text);return canonical};
 try{const cached=localStorage.getItem(cacheKey);if(cached){const canonical=apply(cached);if(canonical)return canonical}}catch{}
 try{const url='https://de.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=langlinks%7Cpageprops&ppprop=disambiguation&lllang=en&lllimit=max&titles='+encodeURIComponent(text);
  const r=await fetch(url,{signal:AbortSignal.timeout(2200)});if(!r.ok)return false;const data=await r.json(),matches=new Set();
  for(const page of Object.values(data.query?.pages||{})){if(page.missing!==undefined||page.pageprops?.disambiguation!==undefined)continue;for(const link of page.langlinks||[]){const canonical=q.archiveCanonicalByNorm.get(norm(link['*']));if(canonical)matches.add(canonical)}}
  if(matches.size!==1)return false;const canonical=[...matches][0];if(!apply(canonical))return false;try{localStorage.setItem(cacheKey,canonical)}catch{}return canonical;
 }catch{return false}
}
window.ABGRUND_ARCHIVE={loadQuestion,resolveGerman,ready:null};let renderRequest=0;
showQ=async()=>{
 const request=++renderRequest,q=deck[save.idx];if(!q)return oldShow();
 stopTimer();$('answer').disabled=true;$('submitAnswer').disabled=true;$('question').textContent=q.q;$('hint').textContent='Frage wird vorbereitet …';
 try{await window.ABGRUND_ARCHIVE.ready;if(!(save.questionDeadlineIndex===save.idx&&save.questionDeadline&&Date.now()>=save.questionDeadline))await window.ABGRUND_ARCHIVE.loadQuestion(q);if(request!==renderRequest)return;
  await window.ABGRUND_COMMUNITY?.prepare(q);if(request!==renderRequest)return;oldShow();
 }catch(e){if(request!==renderRequest)return;$('response').classList.add('show','invalid');$('response').innerHTML='Die Antworten konnten nicht geladen werden. Deine Runde bleibt gespeichert. <button class="nextbtn" id="archiveRetry" type="button">ERNEUT VERSUCHEN</button>';$('archiveRetry').onclick=showQ;$('hint').textContent='Die Zeit läuft erst, wenn die Frage bereit ist.'}
};
const begin=$('begin');begin.disabled=true;
window.ABGRUND_ARCHIVE.ready=(async()=>{
 const r=await fetch('./archive-manifest.json');if(!r.ok)throw Error('missing manifest');const rows=await r.json();
 const byQuestion=new Map(bank.map(q=>[norm(q.q),q]));
 for(const row of rows){let q=byQuestion.get(norm(row.q));if(!q){q={q:row.q,answers:[],reviewedOnly:true};bank.push(q);byQuestion.set(norm(row.q),q)}
  q.archiveAssets||=[];q.archiveAssets.push({id:row.id,path:row.path});q.archiveId=row.validationId;q.archiveDate=row.date;q.archiveOriginal=row.original;q.archiveCount=(q.archiveCount||0)+row.count;q.archiveExamples=row.examples;q.full=row.top;q.top=row.top;
  q.archiveSource='https://krilliongame.com/krillion-answers/'+row.date+'/';
 }
 if(!save.started)save=makeSession();
 else if(save.deckQuestions){const ids=save.deckQuestions.map(text=>bank.findIndex(q=>q.q===text));if(ids.every(i=>i>=0))save.deckIds=ids;else save=makeSession()}
 if(save.deckIds.some(i=>!bank[i]))save=makeSession();deck=save.deckIds.map(i=>bank[i]);
 begin.disabled=save.started&&!save.done&&!document.body.classList.contains('run-complete');
 if(save.started&&!save.done){begin.disabled=false;begin.textContent='▶ RUNDE FORTSETZEN'}
 const meta=document.querySelector('meta[name="description"]');if(meta)meta.content='ABGRUND: '+bank.length+' Wissensfragen, vollständige Antwortlisten und gleichwertige deutsche Antworten.';
 return rows;
})().catch(e=>{begin.disabled=false;console.warn('Archive temporarily unavailable');return []});
})();
