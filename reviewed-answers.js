/* Question-scoped editorial corrections, reapplied after lazy archive loads. */
(()=>{
'use strict';
const originalCanonical=canonicalAnswer;
canonicalAnswer=(q,text)=>q?.reviewedCanonical&&Object.prototype.hasOwnProperty.call(q.reviewedCanonical,normalizeFactText(text))?q.reviewedCanonical[normalizeFactText(text)]:originalCanonical(q,text);
const entries=[
 ['Nenne eine Kette von Coffeeshops.','Coffee Fellows',['Coffee-Fellows'],30],
 ['Nenne ein Winterkleidungsstück.','Ohrenwärmer',['Ohrenschützer','Ohrwaermer'],30],
 ['Nenne ein Kleidungsstück (Schmuck, Brillen und Taschen nicht mitzählen).','Ohrenwärmer',['Ohrenschützer','Ohrwaermer'],30],
 ['Nenne einen griechischen Gott oder eine griechische Göttin.','Hermes',[],30],
 ['Nenne eine Eissorte (auch Sorbet zählt).','Pampelmuse',['Pampelmuseneis','Pampelmusensorbet'],60],
 ['Nenne eine Eissorte (auch Sorbet zählt).','Physalis',['Physaliseis','Physalis-Sorbet'],60],
 ['Nenne eine Eissorte mit Fruchtgeschmack.','Pampelmuse',['Pampelmuseneis','Pampelmusensorbet'],60],
 ['Nenne eine Eissorte mit Fruchtgeschmack.','Physalis',['Physaliseis','Physalis-Sorbet'],60],
 ['Nenne ein Küchenkraut oder Gewürz.','Togarashi',['Togorashi','Togaorshi','Togarashi Pulver'],60],
 ['Nenne ein Küchenkraut oder Gewürz.','Shichimi Togarashi',['Shichimi-Togarashi'],60],
 ['Nenne ein Küchenkraut oder Gewürz.','Ichimi Togarashi',[],60]
];
function apply(q){
 for(const [question,canonical,aliases,points] of entries){
  if(normalizeFactText(q.q)!==normalizeFactText(question))continue;
  q.answers||=[];q.answerAliases||={};q.scoreOverrides||={};q.estimatedScores||={};q.reviewedCanonical||={};
  // Preserve existing archive values; new editorial estimates never imply measured rarity.
  const key=normalizeFactText(canonical);
  if(q.scoreOverrides[key]==null&&q.archiveScores?.[key]==null){q.scoreOverrides[key]=points;q.estimatedScores[key]='editorial'}
  for(const value of [canonical,...aliases]){
   const n=normalizeFactText(value);if(!q.answers.some(a=>normalizeFactText(a)===n))q.answers.push(value);
   q.archiveLookup?.add(n);q.reviewedCanonical[n]=canonical;
   if(value!==canonical)q.answerAliases[n]=canonical;
  }
 }
 return q;
}
for(const q of bank)apply(q);
const archive=window.ABGRUND_ARCHIVE;
if(archive){const load=archive.loadQuestion;archive.loadQuestion=async q=>apply(await load(q));archive.ready.then(()=>bank.forEach(apply))}
// loadQuestion's lexical caller also needs the correction after loading.
const verify=verifyFact;verifyFact=(q,text)=>{apply(q);return verify(q,text)};
window.ABGRUND_REVIEWED_ANSWERS={entries,apply};
})();
