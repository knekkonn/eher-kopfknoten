/* Corrections to answer equivalence and known fitness drink brands. */
(()=>{
'use strict';
const find=text=>bank.find(q=>normalizeFactText(q.q)===normalizeFactText(text));
const add=(q,x)=>{if(!q.answers.some(a=>normalizeFactText(a)===normalizeFactText(x)))q.answers.push(x)};
const aliases=(q,target,items)=>{q.answerAliases||={};for(const a of items)q.answerAliases[normalizeFactText(a)]=target};
const yellow=find('Nenne einen Gelbton.');
if(yellow){
 yellow.answers||=[];yellow.scoreOverrides||={};yellow.estimatedScores||={};
 for(const name of ['Aureolin','Kobaltgelb','Cobalt yellow','Kobaltgelb Aureolin'])add(yellow,name);
 yellow.full='Aureolin';yellow.top='Aureolin';
 aliases(yellow,'banana yellow',['Bananengelb','Banana yellow']);
 aliases(yellow,'canary yellow',['Kanariengelb']);
 aliases(yellow,'Light yellow',['Hellgelb']);
 aliases(yellow,'Sand yellow',['Sandgelb']);
 aliases(yellow,'Indian yellow',['Indischgelb']);
 aliases(yellow,'Aureolin',['Kobaltgelb','Cobalt yellow','Kobaltgelb Aureolin']);
 yellow.scoreOverrides[normalizeFactText('banana yellow')]=10;
 yellow.estimatedScores[normalizeFactText('banana yellow')]='editorial';
}
const drinks=find('Nenne eine Marke für Sport- oder Fitnessgetränke.');
if(drinks){
 drinks.answers||=[];drinks.scoreOverrides||={};drinks.estimatedScores||={};
 for(const name of ['ESN','ESN Isoclear','ESN IsoClear','Isoclear','ESN Hydorade','Hydorade'])add(drinks,name);
 aliases(drinks,'ESN',['ESN Isoclear','ESN IsoClear','Isoclear','ESN Hydorade','Hydorade']);
 drinks.scoreOverrides[normalizeFactText('ESN')]=10;
 drinks.estimatedScores[normalizeFactText('ESN')]='editorial';
}
const films=find('Nenne einen Film mit Zendaya.');
if(films){
 films.answers||=[];films.scoreOverrides||={};films.estimatedScores||={};
 aliases(films,'Dune: Part Two',['Dune 2','Dune Teil 2','Dune Part Two']);
 for(const name of ['Dune Teil 2','Dune Part Two','Smallfoot'])add(films,name);
 delete films.scoreOverrides[normalizeFactText('Dune 2')];
 delete films.estimatedScores[normalizeFactText('Dune 2')];
 films.scoreOverrides[normalizeFactText('Smallfoot')]=30;
 films.estimatedScores[normalizeFactText('Smallfoot')]='editorial';
}
})();