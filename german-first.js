/* German presentation is independent of stable, bilingual scoring identities. */
(()=>{'use strict';
const n=normalizeFactText;
const oldCompletion=completionOptions,oldTier=tierForAnswer,canonicalStep=canonicalAnswer;
canonicalAnswer=(q,text)=>{let value=String(text??'');const seen=new Set();for(let i=0;i<8;i++){const next=canonicalStep(q,value);if(next===value||seen.has(next))return next;seen.add(value);value=next}return value};
const own=(map,key)=>map&&Object.prototype.hasOwnProperty.call(map,key)?map[key]:undefined;
function label(q,text){const canonical=canonicalAnswer(q,text),key=n(canonical);const candidate=own(q.germanNames,key);if(!candidate||candidate===canonical)return canonical;return verifyFact(q,candidate)&&n(canonicalAnswer(q,candidate))===key&&tierForAnswer(q,candidate).points===tierForAnswer(q,canonical).points?candidate:canonical}
window.ABGRUND_DISPLAY={answer:label};
function register(q,canonical,german,present){
 const key=n(canonical),translated=n(german);if(!key||!translated)return false;
 // Two existing answers may happen to have equal points without being synonyms.
 // A German label must resolve to this exact scoring identity, never its neighbor.
 if(present.has(translated)||q.archiveLookup?.has(translated)){
  if(n(canonicalAnswer(q,german))!==key){
   // Old local German entries sometimes had a default score but no link at all.
   // Link only these free-standing entries; never steal another source's alias.
   if(n(canonicalAnswer(q,german))!==translated||q.archiveCanonicalByNorm?.has(translated)||own(q.reviewedCanonical,translated))return false;
   q.answerAliases||={};q.answerAliases[translated]=canonical;
  }
 }else{
  q.answers.push(german);present.add(translated);q.answerAliases||={};q.answerAliases[translated]=canonical;q.archiveLookup?.add(translated);
 }
 q.germanNames[key]=german;return true;
}
function apply(q){
 q.germanNames||={};const present=new Set((q.answers||[]).map(n));
 for(const group of window.ABGRUND_GERMAN_GROUPS?.[q.q]||[]){
  const names=group.filter(x=>typeof x==='string');if(!names.length)continue;
  const existing=names.find(name=>present.has(n(name))||q.archiveLookup?.has(n(name)));
  if(!existing)continue;
  const canonical=canonicalAnswer(q,existing),context=window.ABGRUND_LOCALIZATION?.context(q);
  if(!context||!context.literal&&window.ABGRUND_LOCALIZATION.literalFits(context,names[0]))register(q,canonical,names[0],present);
 }
 if(window.ABGRUND_LOCALIZATION&&q.germanAppliedSize!==(q.answers||[]).length){
  const seen=new Set();
  for(const answer of [...q.answers]){
   const canonical=canonicalAnswer(q,answer),key=n(canonical);if(seen.has(key))continue;seen.add(key);
   const german=window.ABGRUND_LOCALIZATION.candidate(q,canonical);if(german)register(q,canonical,german,present);
  }
  q.germanAppliedSize=q.answers.length;
 }
 q.editorialPoints||={};
 if(n(q.q)===n('Nenne einen Zustelldienst.')){
  q.answers||=[];q.answerAliases||={};
  for(const [name,points] of [['DHL',10],['DoorDash',60],['Deutsche Post',10]]){
   if(!q.answers.some(a=>n(a)===n(name)))q.answers.push(name);q.archiveLookup?.add(n(name));q.editorialPoints[n(canonicalAnswer(q,name))]=points;
  }
  for(const [variant,canonical] of [['DHL Express','DHL'],['Door Dash','DoorDash'],['Deutsche Post AG','Deutsche Post']]){q.reviewedCanonical||={};q.reviewedCanonical[n(variant)]=canonical;q.answerAliases[n(variant)]=canonical;q.archiveLookup?.add(n(variant));if(!q.answers.includes(variant))q.answers.push(variant)}
  if(q.answers.some(a=>n(a)==='hermes europe')){q.answerAliases.hermes='Hermes Europe';q.archiveLookup?.add('hermes');if(!q.answers.includes('Hermes'))q.answers.push('Hermes')}
 }
 const territory=n(q.q)===n('Nenne ein Land oder ein abhängiges Gebiet.')||n(q.q)===n('Nenne ein abhängiges Gebiet, einen Landesteil oder eine autonome Region.');
 if(territory&&!present.has('guam')){q.answers.push('Guam');q.archiveLookup?.add('guam')}
 if(territory||present.has('guam'))q.editorialPoints[n(canonicalAnswer(q,'Guam'))]=60;
 return q;
}
tierForAnswer=(q,text,views)=>{const points=own(q.editorialPoints,n(canonicalAnswer(q,text)))??own(q.livePoints,n(canonicalAnswer(q,text)));return Number.isFinite(points)?SCORE_TIERS.find(t=>t.points===points):oldTier(q,text,views)};
completionOptions=(q,input)=>{
 const result=oldCompletion(q,input);let suggestion=result.suggestion;
 if(!suggestion&&!result.ambiguous&&q&&verifyFact(q,input)&&n(label(q,input))!==n(input))suggestion=label(q,input);
 if(!suggestion)return result;
 const primary=label(q,suggestion),canonical=canonicalAnswer(q,suggestion);
 return {...result,suggestion:primary,secondary:n(primary)!==n(canonical)?canonical:''};
};
const oldTop=topAnswer;topAnswer=q=>label(q,oldTop(q));
const archive=window.ABGRUND_ARCHIVE;if(archive){const load=archive.loadQuestion;archive.loadQuestion=async q=>apply(await load(q));archive.ready.then(()=>bank.forEach(apply))}
for(const q of bank)apply(q);
window.ABGRUND_GERMAN_FIRST={apply,label};
})();
