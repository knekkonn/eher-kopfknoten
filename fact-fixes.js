/* Explicit question-scoped corrections; never infer a person from a first name. */
(()=>{
 const n=normalizeFactText;
 const add=(q,canonical,aliases=[])=>{
  q.answers||=[];q.answerAliases||={};
  for(const x of [canonical,...aliases])if(!q.answers.some(a=>n(a)===n(x)))q.answers.push(x);
  for(const x of aliases)q.answerAliases[n(x)]=canonical;
 };
 for(const q of bank){
  const p=n(q.q);
  if(p.includes('europa league'))add(q,'Eintracht Frankfurt',['Frankfurt','Eintracht']);
  if(p.includes('sternbild'))add(q,'Cancer',['Krebs']);
  if(p==='nenne ein tier dessen name mit k beginnt')add(q,'Karausche');
  if(p.includes('premier league')&&p.includes('verein')&&p.includes('fruher'))add(q,'Hull City',['Hull']);
  if(p==='nenne eine beliebte nachspeise aus frankreich')add(q,'Tarte',['tart']);
 }
})();
