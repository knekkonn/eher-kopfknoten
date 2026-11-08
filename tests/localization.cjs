const assert=require('node:assert/strict'),engine=require('../scripts/game-engine.cjs');
(async()=>{
 await engine.ready;
 const bank=engine.run('bank'),f=engine.run('({label:window.ABGRUND_DISPLAY.answer,canonical:canonicalAnswer,tier:tierForAnswer,verify:verifyFact,completion:completionOptions,candidate:window.ABGRUND_LOCALIZATION.candidate})');
 async function pair(question,english,german){
  const q=bank.find(q=>q.q===question);assert(q,question);await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);
  assert(f.verify(q,english),question+': '+english);assert(f.verify(q,german),question+': '+german);
  assert.equal(f.label(q,english),german,question+': German display');
  assert.equal(engine.run('normalizeFactText')(f.canonical(q,english)),engine.run('normalizeFactText')(f.canonical(q,german)),question+': identical answer');
  assert.equal(f.tier(q,english).points,f.tier(q,german).points,question+': same score');
  assert.equal(f.completion(q,english).suggestion,german,question+': German suggestion first');
 }
 for(const [english,german] of [['Chocolate','Schokolade'],['Strawberry','Erdbeere'],['Banana','Banane']])await pair('Nenne eine Eissorte (auch Sorbet zählt).',english,german);
 await pair('Nenne eine Sprache, die Amtssprache eines europäischen Landes ist.','Basque','Baskisch');
 await pair('Nenne ein lebendes Säugetier, das in Afrika heimisch ist.','Bat','Fledermaus');
 await pair('Nenne einen Planeten oder Zwergplaneten in unserem Sonnensystem.','Mercury','Merkur');
 await pair('Nenne einen abendfüllenden Pixar-Film.','Onward','Onward: Keine halben Sachen');
 const unchanged=[['Nenne eine Programmiersprache.','Python'],['Nenne ein Unternehmen, das zum S&P 500 gehört oder gehört hat.','Adobe'],['Nenne ein Theaterstück von Shakespeare.','Hamlet']];
 for(const [question,answer] of unchanged){const q=bank.find(q=>q.q===question);await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);assert.equal(f.label(q,answer),f.canonical(q,answer),answer+' keeps its proper name')}
 // Isolated context checks catch homonyms even when an archive does not contain one.
 for(const [question,input] of [['Nenne eine Programmiersprache.','Python'],['Nenne eine Marke.','Apple'],['Nenne einen Song.','Brown'],['Nenne ein englisches Wort mit dem Buchstaben B.','Banana']])assert.equal(f.candidate({q:question},input),'',question);
 assert.notEqual(f.candidate({q:'Nenne etwas, das verwendet wird, um einen Ball in einem Sport zu schlagen (das gleiche Werkzeug zählt einmal über Sportarten hinweg).'},'Bat'),'Fledermaus');
 console.log('German localization: shared answer identities and scores, German-first completion, localized film titles, proper names and contextual homonyms: OK.');
})().catch(e=>{console.error(e);process.exit(1)});
