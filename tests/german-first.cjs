const fs=require('node:fs'),assert=require('node:assert/strict'),engine=require('../scripts/game-engine.cjs');
(async()=>{
 await engine.ready;const functions=engine.run('({label:window.ABGRUND_GERMAN_FIRST.label,verify:verifyFact,tier:tierForAnswer,canonical:canonicalAnswer,n:normalizeFactText,completion:completionOptions})');
 const report=[];let checked=0,translated=0;
 for(const q of engine.run('bank')){
  await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);let german=0;
  for(const answer of q.answers){const label=functions.label(q,answer);assert(functions.verify(q,label),q.q+': '+label);assert.equal(functions.tier(q,label).points,functions.tier(q,answer).points,q.q+': '+answer+' -> '+label);checked++;if(label!==functions.canonical(q,answer)){german++;translated++}}
  report.push({question:q.q,archiveId:q.archiveId||null,answers:q.answers.length,germanPresentation:german,unchangedNames:q.answers.length-german});
 }
 const delivery=engine.run('bank').find(q=>q.q==='Nenne einen Zustelldienst.');for(const [answer,points] of [['DHL',10],['DoorDash',60],['Deutsche Post',10]]){assert(functions.verify(delivery,answer));assert.equal(functions.tier(delivery,answer).points,points)}
 for(const word of ['constructor','__proto__']){assert.equal(typeof functions.canonical(delivery,word),'string');assert.equal(functions.verify(delivery,word),false);assert.equal(functions.label(delivery,word),word)}
 let guams=0;for(const q of engine.run('bank'))if(functions.verify(q,'Guam')){assert.equal(functions.tier(q,'Guam').points,60,q.q);guams++}assert(guams>=3);
 const country=engine.run('bank').find(q=>q.q==='Nenne ein Land in Afrika.');assert.equal(functions.label(country,'Egypt'),'Ägypten');assert.equal(functions.completion(country,'Egypt').suggestion,'Ägypten');
 assert(!engine.run('bank').filter(q=>q.q==='Nenne ein Land.').some(q=>functions.verify(q,'Guam')),'Guam is not a sovereign state');
 for(const [question,input,points,shown] of [['Nenne einen Zustelldienst.','DHL',10,'DHL'],['Nenne einen Zustelldienst.','DoorDash',60,'DoorDash'],['Nenne ein Land in Afrika.','Egypt',10,'Ägypten']]){
  engine.ctx.question=question;engine.ctx.input=input;engine.run("{const i=bank.findIndex(q=>q.q===question);save={started:true,idx:0,depth:0,points:0,answers:[],done:false,deckIds:[i],rotationOwner:'guest'};deck=[bank[i]];validationPending=false;$('answer').value=input;startTimer()}");await engine.run('submitAnswer()');const answer=engine.run('save.answers[0]');assert.equal(answer.points,points);assert.equal(answer.text,shown);assert(Number.isFinite(answer.responseMs));
 }
 if(process.env.WRITE_GERMAN_AUDIT)fs.writeFileSync('german-answer-audit.json',JSON.stringify({questions:report.length,answers:checked,germanPresentation:translated,guamCategories:guams,policy:'German labels where an accepted equivalent with equal points is available; proper names remain unchanged; no fabricated translations.',prompts:report},null,2)+'\n');
 console.log(checked+' answers audited across '+report.length+' prompts; '+translated+' German presentations preserve points; DHL/DoorDash/Deutsche Post and '+guams+' Guam categories: OK.');
})().catch(e=>{console.error(e);process.exit(1)});
