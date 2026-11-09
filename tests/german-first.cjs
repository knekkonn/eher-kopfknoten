const fs=require('node:fs'),assert=require('node:assert/strict'),engine=require('../scripts/game-engine.cjs');
(async()=>{
 await engine.ready;const functions=engine.run('({label:window.ABGRUND_GERMAN_FIRST.label,verify:verifyFact,tier:tierForAnswer,canonical:canonicalAnswer,n:normalizeFactText,completion:completionOptions})');
 const report=[];let checked=0,translated=0;
 for(const q of engine.run('bank')){
  await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);let german=0;
  for(const answer of q.answers){const label=functions.label(q,answer);assert(functions.verify(q,label),q.q+': '+label);assert.equal(functions.tier(q,label).points,functions.tier(q,answer).points,q.q+': '+answer+' -> '+label);checked++;if(label!==functions.canonical(q,answer)){german++;translated++}}
  report.push({question:q.q,archiveId:q.archiveId||null,answers:q.answers.length,germanPresentation:german,unchanged:q.answers.length-german});
 }
 const pokemon=engine.run('bank').find(q=>q.archiveId==='d111-p4');assert(pokemon);await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(pokemon);assert.equal(functions.label(pokemon,'Bulbasaur'),'Bisasam');assert(functions.verify(pokemon,'Bisasam'));assert.equal(functions.tier(pokemon,'Bisasam').points,functions.tier(pokemon,'Bulbasaur').points);
 // Common answers in the new dives should read naturally in German without changing their identity or score.
 for(const [id,english,german,points] of [
  ['d113-p7','Hot air balloon','Heißluftballon',10],
  ['d114-p2','Brightness','Helligkeit',10],
  ['d114-p4','Hoop','Korb',10],
  ['d116-p1','Electricity','Stromrechnung',10],
  ['d116-p7','Newspaper ad','Zeitungsanzeige',10],
  ['d117-p3','Ankle','Knöchel',10]
 ]){
  const q=engine.run('bank').find(q=>q.archiveId===id);assert(q,id);await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);
  assert.equal(functions.label(q,english),german,id+' German display');
  assert(functions.verify(q,german),id+' accepts the German answer');
  assert.equal(functions.canonical(q,german),english,id+' keeps the original answer identity');
  assert.equal(functions.tier(q,english).points,points,id+' original points');
  assert.equal(functions.tier(q,german).points,points,id+' translated points');
  assert.equal(functions.completion(q,english).suggestion,german,id+' suggests German first');
 }
 const delivery=engine.run('bank').find(q=>q.q==='Nenne einen Zustelldienst.');for(const [answer,points] of [['DHL',10],['DoorDash',60],['Deutsche Post',10]]){assert(functions.verify(delivery,answer));assert.equal(functions.tier(delivery,answer).points,points)}
 for(const word of ['constructor','__proto__']){assert.equal(typeof functions.canonical(delivery,word),'string');assert.equal(functions.verify(delivery,word),false);assert.equal(functions.label(delivery,word),word)}
 let guams=0;for(const q of engine.run('bank'))if(functions.verify(q,'Guam')){assert.equal(functions.tier(q,'Guam').points,60,q.q);guams++}assert(guams>=3);
 const country=engine.run('bank').find(q=>q.q==='Nenne ein Land in Afrika.');assert.equal(functions.label(country,'Egypt'),'Ägypten');assert.equal(functions.completion(country,'Egypt').suggestion,'Ägypten');
 assert(!engine.run('bank').filter(q=>q.q==='Nenne ein Land.').some(q=>functions.verify(q,'Guam')),'Guam is not a sovereign state');
 for(const [question,input,points,shown] of [['Nenne einen Zustelldienst.','DHL',10,'DHL'],['Nenne einen Zustelldienst.','DoorDash',60,'DoorDash'],['Nenne ein Land in Afrika.','Egypt',10,'Ägypten']]){
  engine.ctx.question=question;engine.ctx.input=input;engine.run("{const i=bank.findIndex(q=>q.q===question);save={started:true,idx:0,depth:0,points:0,answers:[],done:false,deckIds:[i],rotationOwner:'guest'};deck=[bank[i]];validationPending=false;$('answer').value=input;startTimer()}");await engine.run('submitAnswer()');const answer=engine.run('save.answers[0]');assert.equal(answer.points,points);assert.equal(answer.text,shown);assert(Number.isFinite(answer.responseMs));
 }
 if(process.env.WRITE_GERMAN_AUDIT)fs.writeFileSync('german-answer-audit.json',JSON.stringify({questions:report.length,answers:checked,germanPresentation:translated,guamCategories:guams,policy:'Category-checked German labels resolve to the exact same canonical answer and score. Proper names and literal word tasks stay unchanged. Unverified archive aliases are not used as translations. Counts include accepted spelling variants, not only unique concepts. Unchanged does not imply that every entry is a proper name.',prompts:report},null,2)+'\n');
 console.log(checked+' answers audited across '+report.length+' prompts; '+translated+' German presentations preserve points; DHL/DoorDash/Deutsche Post and '+guams+' Guam categories: OK.');
})().catch(e=>{console.error(e);process.exit(1)});
