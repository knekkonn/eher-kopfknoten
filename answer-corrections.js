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
/* Targeted corrections from the scoring and synonym audit. */
(()=>{
'use strict';
const n=normalizeFactText;
const find=t=>bank.find(q=>n(q.q)===n(t));
const setup=q=>{q.answers||=[];q.answerAliases||={};q.scoreOverrides||={};q.estimatedScores||={}};
const add=(q,s)=>{if(!q.answers.some(x=>n(x)===n(s)))q.answers.push(s)};
const alias=(q,a,c)=>{add(q,a);q.answerAliases[n(a)]=c};
const fixed=(q,a,p)=>{q.scoreOverrides[n(a)]=p;q.estimatedScores[n(a)]='editorial'};
const top=(q,a)=>{add(q,a);q.full=a;q.top=a;delete q.scoreOverrides[n(a)];delete q.estimatedScores[n(a)]};
let q=find('Nenne einen Snowboard- oder Skateboard-Trick.');
if(q){setup(q);top(q,'Gazelle Flip');add(q,'Tre Flip');alias(q,'360 Flip','Tre Flip');alias(q,'360 Kickflip','Tre Flip');delete q.scoreOverrides[n('360 Flip')];delete q.estimatedScores[n('360 Flip')];fixed(q,'Tre Flip',30);fixed(q,'Ollie',10)}
q=find('Nenne einen Teil des menschlichen Ohrs.');
if(q){setup(q);top(q,'Linsenfortsatz');alias(q,'Processus lenticularis','Linsenfortsatz');alias(q,'incus','Amboss');fixed(q,'Amboss',30)}
q=find('Nenne einen Basketballer, der für die Los Angeles Lakers gespielt hat.');
if(q){setup(q);top(q,'Coby Karl');alias(q,'Ron Artest','metta world peace');alias(q,'Metta Sandiford-Artest','metta world peace');fixed(q,'metta world peace',30)}
q=find('Nenne ein Pokémon vom Typ Feuer.');
if(q){setup(q);alias(q,'Infernopod','Centiskorch')}
q=find('Nenne einen Block aus „Minecraft“.');
if(q){setup(q);top(q,'Konstruktionsleere');alias(q,'Structure Void','Konstruktionsleere');alias(q,'chiseled stone bricks','Gemeißelte Steinziegel');fixed(q,'Gemeißelte Steinziegel',30)}
q=find('Nenne ein offiziell anerkanntes Sternbild.');
if(q){setup(q);alias(q,'Mensa','Tafelberg');delete q.scoreOverrides[n('Mensa')];delete q.estimatedScores[n('Mensa')];alias(q,'Füllen','Equuleus');alias(q,'Steinbock','Capricornus');alias(q,'Fische','Pisces');alias(q,'Südliche Krone','Corona Australis');fixed(q,'Orion',10);fixed(q,'Pisces',10);fixed(q,'Pegasus',30);fixed(q,'Corona Australis',60)}
})();

/* Equivalent English, German and abbreviated names found by auditing 100-point answers. */
(()=>{
'use strict';const n=normalizeFactText,find=t=>bank.find(q=>n(q.q)===n(t));
const alias=(q,from,to)=>{q.answers||=[];q.answerAliases||={};if(!q.answers.some(a=>n(a)===n(from)))q.answers.push(from);q.answerAliases[n(from)]=to};
const pairs=[
['Nenne einen Spieler, der einmal NBA MVP war.','bob petit','Bob Pettit'],
['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','Salsiccia e friarielli','Pizza salsiccia e friarielli'],
['Nenne einen Verein, der die UEFA Champions League gewonnen hat.','steaua bucharest','steaua bucuresti'],
['Nenne einen Verein, der die deutsche Bundesliga gewonnen hat.','Nürnberg','1 fc nurnberg'],
['Nenne ein Dessert, das gebacken wird.','Cannele','Canelé'],
['Nenne einen Gewinner der UEFA Europa League.','Zenit Saint Petersburg','zenit st petersburg'],
['Nenne einen Gewinner der UEFA Europa League.','Zenit Sankt Petersburg','zenit st petersburg'],
['Nenne eine Sprache, die Amtssprache eines europäischen Landes ist.','Luxembourgish','Luxemburgisch'],
['Nenne eine Art von Zuhause oder Behausung.','Gassho-zukuri','Gassho-zukuri-Haus'],
['Nenne ein Spiel aus „Wii Sports“ oder „Wii Sports Resort“.','Wakeboarding','Wakeboarden'],
['Nenne einen Film aus der „Rocky“- oder „Creed“-Reihe.','Rocky 5','Rocky V'],
['Nenne eine Art von Brille oder anderem Augenschutz.','Schweißerbrille','Schweißerschutzbrille'],
['Nenne ein Land, dessen Flagge sowohl Rot als auch Grün enthält.','Equatorial Guinea','Äquatorialguinea'],
['Nenne ein Tier, dessen Name auf ein anderes Tier verweist.','bee-wolf','Bienenwolf'],
['Nenne ein Tier, dessen Name auf ein anderes Tier verweist.','bee wolf','Bienenwolf'],
['Nenne ein chemisches Element.','Bh','Bohrium']
];
for(const [question,from,to] of pairs){const q=find(question);if(q)alias(q,from,to)}
let q=find('Nenne eine Sprache, die Amtssprache eines europäischen Landes ist.');
if(q){q.scoreOverrides||={};q.estimatedScores||={};delete q.scoreOverrides[n('Luxembourgish')];delete q.estimatedScores[n('Luxembourgish')];q.scoreOverrides[n('Deutsch')]=10;q.estimatedScores[n('Deutsch')]='editorial'}
q=find('Nenne ein Tier, dessen Name auf ein anderes Tier verweist.');
if(q){q.scoreOverrides||={};q.estimatedScores||={};delete q.scoreOverrides[n('bee-wolf')];delete q.estimatedScores[n('bee-wolf')];q.scoreOverrides[n('Seepferdchen')]=10;q.estimatedScores[n('Seepferdchen')]='editorial';alias(q,'seahorse','Seepferdchen')}
})();
