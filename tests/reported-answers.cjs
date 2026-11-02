const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes=new Map(),storage=new Map(),node=id=>{if(!nodes.has(id)){const c=new Set();nodes.set(id,{value:'',textContent:'',innerHTML:'',disabled:false,dataset:{},style:{setProperty(){}},classList:{add:(...x)=>x.forEach(a=>c.add(a)),remove:(...x)=>x.forEach(a=>c.delete(a)),contains:x=>c.has(x),toggle:(x,on)=>on?c.add(x):c.delete(x)},addEventListener(){},focus(){},querySelector:s=>node(id+s),querySelectorAll:()=>[]})}return nodes.get(id)};
const context=vm.createContext({console,URL,AbortController,Event,document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],body:node('body'),documentElement:node('root'),addEventListener(){}},window:{innerHeight:844,addEventListener(){}},navigator:{},location:{href:'https://example.test/'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},fetch:async()=>{throw Error('offline')}});
vm.runInContext(script,context);
for(const file of ['krillion-patch.js','krillion-archive-extra.js','answer-expansion.js','tier-calibration.js','answer-corrections.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const run=s=>vm.runInContext(s,context);
async function answer(question,input){context.question=question;context.input=input;run("{stopTimer();const i=bank.findIndex(q=>q.q===question);if(i<0)throw Error('Missing question '+question);save={started:true,idx:0,depth:0,points:0,answers:[],done:false,deckIds:[i]};deck=[bank[i]];validationPending=false;$('answer').value=input;startTimer();}");await run('submitAnswer()');return run('save.answers[0]')}
(async()=>{
 const groups=[
  ['Nenne einen Verein, der aktuell oder früher in der Premier League gespielt hat.',['Hull City','Hull','null city']],
  ['Nenne ein aktuelles oder ehemaliges Team aus NBA, MLB, Premier League oder NFL.',['Hull City','Hull','null city']],
  ['Nenne einen Verein, der die UEFA Europa League oder den UEFA-Pokal gewonnen hat.',['Eintracht Frankfurt','Frankfurt','SGE']],
  ['Nenne einen Gewinner der UEFA Europa League.',['Eintracht Frankfurt','Frankfurt','SGE']],
  ['Nenne ein offiziell anerkanntes Sternbild.',['Cancer','Krebs','Sternbild Krebs']],
  ['Nenne ein Tier, dessen Name mit K beginnt.',['Karausche','Carassius carassius']]
 ];
 for(const [question,variants] of groups){let first;for(const input of variants){const result=await answer(question,input);assert(result,question+': '+input);first??=result;assert.equal(result.points,first.points,question+' same score: '+input);assert.equal(result.text.toLowerCase(),first.text.toLowerCase(),question+' same canonical answer: '+input)}}
 context.q=run("bank.find(q=>q.q==='Nenne einen Boxweltmeister.')");
 for(const name of ['max','mohammed','muhammad','mike']){context.input=name;assert.equal(run('suggestCompletion(q,input)'),'',name+' must not reveal a boxer');assert.equal(await answer('Nenne einen Boxweltmeister.',name),undefined,name+' must not silently complete')}
 assert.equal(run("wikiTitleMatches('Muhammad','Muhammad Ali')"),false,'external fact checking cannot silently expand a partial name');
 assert.equal(run("wikiTitleMatches('Muhammad Ali','Muhammad Ali')"),true);
 context.q=run("bank.find(q=>q.q==='Nenne eine beliebte Nachspeise aus Frankreich.')");
 assert.equal(run("completionOptions(q,'tart').ambiguous"),true,'tart is ambiguous and offers neutral feedback');assert.equal(run("suggestCompletion(q,'tart')"),'');
 const suggested=run("suggestCompletion(q,'tarte tati')");assert.equal(suggested.toLowerCase(),'tarte tatin');assert.equal(await answer('Nenne eine beliebte Nachspeise aus Frankreich.','tarte tati'),undefined,'completion requires explicit selection');assert(await answer('Nenne eine beliebte Nachspeise aus Frankreich.',suggested),'explicitly selected completion accepted');
 const missing=run("bank.filter(q=>archivedTierExamples(q).includes('noch kein festes Beispiel')).map(q=>q.q)");assert.equal(missing.length,0,JSON.stringify(missing));
 console.log('Reported answers, scoring equivalence, ambiguity and explicit completion: OK');
})().catch(e=>{console.error(e);process.exitCode=1});
