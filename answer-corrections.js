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

/* Make equivalent NBA team names consistent and revise obvious 100-point examples. */
(()=>{
'use strict';const n=normalizeFactText;
const find=t=>bank.find(q=>n(q.q)===n(t));
const add=(q,a)=>{q.answers||=[];if(!q.answers.some(x=>n(x)===n(a)))q.answers.push(a)};
const set=(q,a,p)=>{q.scoreOverrides||={};q.estimatedScores||={};q.scoreOverrides[n(a)]=p;q.estimatedScores[n(a)]='editorial'};
const rename=(q,a)=>{add(q,a);q.full=a;q.top=a;if(q.scoreOverrides)delete q.scoreOverrides[n(a)];if(q.estimatedScores)delete q.estimatedScores[n(a)]};
let q=find('Nenne eine Mannschaft aus der NBA.');
if(q){
 q.q='Nenne eine aktuelle oder frühere Mannschaft aus der NBA.';
 q.answerAliases||={};rename(q,'Buffalo Braves');set(q,'New Orleans Pelicans',30);
 delete q.scoreOverrides[n('Raptors')];delete q.estimatedScores[n('Raptors')];
 delete q.scoreOverrides[n('Trail Blazers')];delete q.estimatedScores[n('Trail Blazers')];
 set(q,'Charlotte Hornets',60);set(q,'Portland Trail Blazers',85);
 const groups=[['Los Angeles Lakers','Lakers'],['Boston Celtics','Celtics'],['Golden State Warriors','Warriors'],['Chicago Bulls','Bulls'],['Miami Heat','Heat'],['New York Knicks','Knicks'],['Brooklyn Nets','Nets'],['Philadelphia 76ers','Sixers','76ers'],['San Antonio Spurs','Spurs'],['Dallas Mavericks','Mavericks','Mavs'],['Phoenix Suns','Suns'],['Denver Nuggets','Nuggets'],['Milwaukee Bucks','Bucks'],['Cleveland Cavaliers','Cavaliers','Cavs'],['Toronto Raptors','Raptors'],['Detroit Pistons','Pistons'],['Houston Rockets','Rockets'],['Oklahoma City Thunder','Thunder'],['Atlanta Hawks','Hawks'],['Orlando Magic','Magic'],['Indiana Pacers','Pacers'],['Minnesota Timberwolves','Timberwolves'],['Memphis Grizzlies','Grizzlies'],['Sacramento Kings','Kings'],['Portland Trail Blazers','Trail Blazers','Blazers'],['Charlotte Hornets','Hornets'],['New Orleans Pelicans','Pelicans'],['Utah Jazz','Jazz'],['Washington Wizards','Wizards'],['Los Angeles Clippers','Clippers']];
 for(const [canonical,...variants] of groups){add(q,canonical);for(const variant of variants){add(q,variant);q.answerAliases[n(variant)]=canonical}}
}
q=find('Nenne ein Land, das bei einer Rugby-Union-WM der Männer oder Frauen im Finale stand.');
if(q){q.answerAliases||={};rename(q,'United States');for(const x of ['USA','Vereinigte Staaten','Vereinigte Staaten von Amerika']){add(q,x);q.answerAliases[n(x)]='United States'}set(q,'england',10)}
q=find('Nenne einen Ort, in dem ein Formel-1-Rennen stattfindet oder stattgefunden hat.');
if(q){rename(q,'Dallas');set(q,'spielberg',15)}
q=find('Nenne einen Gewinner der Champions-League-Torschützenliste.');
if(q){rename(q,'Claudio Sulser');set(q,'andriy shevchenko',30)}
})();

/* Approximate country familiarity for a German-speaking audience. */
(()=>{
'use strict';const n=normalizeFactText,find=t=>bank.find(q=>n(q.q)===n(t));
const groups=[
[10,['Belgien','Belgium']],[10,['Russland','Russia']],[10,['Deutschland','Germany']],[10,['Frankreich','France']],[10,['Spanien','Spain']],[10,['Italien','Italy']],[10,['Vereinigte Staaten','United States','USA']],[10,['Vereinigtes Königreich','United Kingdom','UK']],[10,['Brasilien','Brazil']],[10,['Argentinien','Argentina']],[10,['China']],[10,['Japan']],[10,['Indien','India']],[10,['Portugal']],[10,['Niederlande','Netherlands','Holland']],[10,['Türkei','Turkey','Türkiye']],[10,['Ägypten','Egypt']],[10,['Marokko','Morocco']],[10,['Australien','Australia']],[10,['Kanada','Canada']],
[15,['Schweiz','Switzerland']],[15,['Österreich','Austria']],[15,['Dänemark','Denmark']],[15,['Norwegen','Norway']],[15,['Polen','Poland']],[15,['Irland','Ireland']],[15,['Griechenland','Greece']],[15,['Südafrika','South Africa']],[15,['Mexiko','Mexico']],[15,['Thailand']],
[30,['Kenia','Kenya']],[30,['Nigeria']],[30,['Ghana']],[30,['Kolumbien','Colombia']],[30,['Peru']],[30,['Chile']],[30,['Kroatien','Croatia']],[30,['Rumänien','Romania']],[30,['Luxemburg','Luxembourg']],[30,['Nepal']],[30,['Vietnam']],[30,['Indonesien','Indonesia']],[30,['Island','Iceland']],[30,['Finnland','Finland']],
[60,['Andorra']],[60,['Uganda']],[60,['Malta']],[60,['Bolivien','Bolivia']],[60,['Paraguay']],[60,['Suriname']],[60,['Guyana']],[60,['Belize']],[60,['Namibia']],[60,['Botswana']],[60,['Sambia','Zambia']],[60,['Ruanda','Rwanda']],[60,['Benin']],[60,['Togo']],[60,['Gambia']],[60,['Gabun','Gabon']],[60,['Laos']],[60,['Kambodscha','Cambodia']],[60,['Moldau','Moldova']],[60,['Montenegro']],[60,['Liechtenstein']],
[85,['Guam']],[85,['Kiribati']],[85,['Nauru']],[85,['Palau']],[85,['Vanuatu']],[85,['Mikronesien','Micronesia']],[85,['Marshallinseln','Marshall Islands']],[85,['Komoren','Comoros']],[85,['Dschibuti','Djibouti']],[85,['Lesotho']],[85,['Guinea-Bissau','Guinea Bissau']],[85,['Zentralafrikanische Republik','Central African Republic']],[85,['São Tomé und Príncipe','São Tomé and Príncipe','Sao Tome and Principe']]
];
const geoQuestions=new Set(['Nenne ein Land.','Nenne ein Land in Afrika.','Nenne ein Binnenland.','Nenne ein Land, das für seine Küche bekannt ist.','Nenne ein Land, das an mehr als fünf Länder grenzt.','Nenne ein Land, dessen Gesamtfläche inklusive Überseegebieten größer als die von Mexiko ist.','Nenne ein Land, dessen Flagge ein Kreuz enthält – auch im Wappen.','Nenne ein Land, dessen Nationalflagge mindestens einen Stern zeigt – auch im Wappen.','Nenne ein Land, das Anteil an den Alpen, den Anden oder dem Himalaya hat.','Nenne ein Land, dessen Flagge sowohl Rot als auch Grün enthält.','Nenne ein Land, dessen Flagge Schwarz oder Orange enthält.','Nenne ein Land, in dem eine andere Religion mehr Anhänger hat als das Christentum.','Nenne ein heutiges Land, dessen Gebiet zum Reich Alexanders des Großen gehörte.'].map(n));
let updated=0, skipped=[];
for(const q of bank){if(!geoQuestions.has(n(q.q)))continue;
 q.answers||=[];q.answerAliases||={};q.scoreOverrides||={};q.estimatedScores||={};
 const isGeneral=n(q.q)===n('Nenne ein Land.');
 const oldAliases={...q.answerAliases},oldScores={...q.scoreOverrides},oldEstimates={...q.estimatedScores},oldAnswers=[...q.answers],oldQuestion=q.q;
 if(isGeneral){q.q='Nenne ein Land oder ein abhängiges Gebiet.';if(!q.answers.some(a=>n(a)===n('Guam')))q.answers.push('Guam')}
 const before=archivedTierExamples(q).match(/noch kein festes Beispiel/g)?.length||0;
 for(const [score,names] of groups){
  const first=names.find(a=>q.answers.some(x=>n(x)===n(a)));if(!first)continue;
  let canonical=canonicalAnswer(q,first), seen=new Set();
  while(q.answerAliases[n(canonical)]&&!seen.has(n(canonical))){seen.add(n(canonical));let next=q.answerAliases[n(canonical)];if(n(next)===n(canonical))break;canonical=next}
  const full=n(perfectAnswerFor(q)),sameFull=names.some(a=>n(a)===full)||n(canonical)===full;
  if(sameFull)canonical=perfectAnswerFor(q);
  const key=n(canonical);
  for(const a of names){const ak=n(a);if(!q.answers.some(x=>n(x)===ak))q.answers.push(a);if(ak!==key){q.answerAliases[ak]=canonical;delete q.scoreOverrides[ak];delete q.estimatedScores[ak]}}
  if(!sameFull){q.scoreOverrides[key]=score;q.estimatedScores[key]='editorial'}
 }
 const targeted=(canonical,score,variants=[])=>{q.scoreOverrides[n(canonical)]=score;q.estimatedScores[n(canonical)]='editorial';for(const a of variants)q.answerAliases[n(a)]=canonical};
 if(n(oldQuestion)===n('Nenne ein Land, dessen Gesamtfläche inklusive Überseegebieten größer als die von Mexiko ist.')){targeted('Kasachstan',30,['Kazakhstan']);targeted('Saudi-Arabien',60,['Saudi Arabia'])}
 if(n(oldQuestion)===n('Nenne ein heutiges Land, dessen Gebiet zum Reich Alexanders des Großen gehörte.'))targeted('Usbekistan',60,['Uzbekistan']);
 if(n(oldQuestion)===n('Nenne ein Binnenland.'))targeted('Österreich',10,['Austria']);
 const after=archivedTierExamples(q).match(/noch kein festes Beispiel/g)?.length||0;
 if(after>before){q.answerAliases=oldAliases;q.scoreOverrides=oldScores;q.estimatedScores=oldEstimates;q.answers=oldAnswers;q.q=oldQuestion;skipped.push(oldQuestion)}else updated++;
}
window.ABGRUND_COUNTRY_REPORT={updated,skipped:skipped.length,skippedQuestions:skipped};
})();

/* IBA cocktail classics and common German spellings. Points are editorial estimates. */
(()=>{
'use strict';
const n=normalizeFactText,q=bank.find(item=>n(item.q)===n('Nenne einen Cocktail.'));
if(!q)return;
q.answers||=[];q.answerAliases||={};q.scoreOverrides||={};q.estimatedScores||={};
const groups=[
 ['Negroni',15,[]],
 ['Moscow Mule',15,['Moskau Mule','Moskauer Mule']],
 ['Margarita',10,[]],['Daiquiri',15,[]],['Caipirinha',10,[]],
 ['Piña Colada',10,['Pina Colada']],['Cuba Libre',10,[]],
 ['Long Island Iced Tea',10,['Long Island Ice Tea']],
 ['Sex on the Beach',10,[]],['Tequila Sunrise',15,[]],
 ['Bloody Mary',15,[]],['Cosmopolitan',15,[]],['Espresso Martini',15,[]],
 ['Dry Martini',15,[]],['Manhattan',15,[]],['Old Fashioned',15,[]],
 ['Gin Fizz',15,[]],['Whiskey Sour',15,['Whisky Sour']],
 ['Mai Tai',15,['Mai-Tai']],['Mimosa',15,[]],['Bellini',15,[]],
 ['Black Russian',15,[]],['Paloma',15,[]],['French 75',30,[]],
 ['Gin Basil Smash',30,['Basil Smash']],['Bramble',30,[]],
 ['Dark and Stormy',30,['Dark n Stormy','Dark & Stormy']]
];
for(const [canonical,points,variants] of groups){
 const key=n(canonical),existing=q.answers.some(a=>n(a)===key);
 if(!existing)q.answers.push(canonical);
 if(!existing&&q.scoreOverrides[key]==null&&q.archiveScores?.[key]==null){q.scoreOverrides[key]=points;q.estimatedScores[key]='editorial'}
 for(const variant of variants){if(!q.answers.some(a=>n(a)===n(variant)))q.answers.push(variant);if(n(variant)!==key)q.answerAliases[n(variant)]=canonical}
}
})();

/* Common German names, short names and equivalent spellings, scoped to each prompt. */
(()=>{
'use strict';
const n=normalizeFactText;
const groups=[
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','margherita',['Pizza Margherita','Pizza Margarita']],
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','salami',['Pizza Salami','Salamipizza']],
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','funghi',['Pizza Funghi','Pilzpizza','Pizza Pilze']],
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','tonno',['Pizza Tonno','Thunfischpizza','Pizza Thunfisch']],
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','hawaii',['Pizza Hawaii','Hawaiipizza']],
 ['Nenne eine Pizzasorte, die man in einer Pizzeria bestellen kann.','quattro formaggi',['Pizza Quattro Formaggi','Vier Käse','Vier-Käse-Pizza']],
 ['Nenne ein Gericht aus Kartoffeln.','pommes',['Pommes frites','Pommes Frites','French fries']],
 ['Nenne ein Gericht aus Kartoffeln.','kartoffelpüree',['Kartoffelstampf','Kartoffelmus','Kartoffelbrei']],
 ['Nenne ein Gericht aus Kartoffeln.','kartoffelpuffer',['Reibekuchen','Reiberdatschi']],
 ['Nenne eine Eissorte (auch Sorbet zählt).','schokolade',['Schoko','Schokoeis','Schokoladeneis']],
 ['Nenne eine Eissorte (auch Sorbet zählt).','vanille',['Vanilleeis']],
 ['Nenne eine Eissorte (auch Sorbet zählt).','erdbeere',['Erdbeereis']],
 ['Nenne eine Eissorte (auch Sorbet zählt).','zitrone',['Zitroneneis','Zitronensorbet']],
 ['Nenne eine Eissorte mit Fruchtgeschmack.','erdbeere',['Erdbeereis']],
 ['Nenne eine Eissorte mit Fruchtgeschmack.','zitrone',['Zitroneneis','Zitronensorbet']],
 ['Nenne eine Eissorte mit Fruchtgeschmack.','himbeere',['Himbeereis']],
 ['Nenne ein Frühstücksgericht, das in mehreren Ländern gegessen wird.','pancakes',['Pfannkuchen','Pancake']],
 ['Nenne ein Frühstücksgericht, das in mehreren Ländern gegessen wird.','rührei',['Rühreier','Scrambled eggs']],
 ['Nenne ein Fast-Food-Gericht, das kein Burger ist.','doner kebab',['Döner','Döner Kebab','Döner Kebap']],
 ['Nenne ein Fast-Food-Gericht, das kein Burger ist.','hot dog',['Hotdog']],
 ['Nenne ein Fast-Food-Gericht, das kein Burger ist.','pommes',['Pommes frites']],
 ['Nenne eine Nudelform.','macaroni',['Makkaroni','Maccheroni']],
 ['Nenne eine Nudelform.','farfalle',['Schleifennudeln']],
 ['Nenne eine Nudelform.','conchiglie',['Muschelnudeln']],
 ['Nenne ein Gericht aus Japan.','miso soup',['Misosuppe','Miso-Suppe']],
 ['Nenne ein Dessert, das gebacken wird.','apfelkuchen',['Apfel-Kuchen']],
 ['Nenne ein Dessert, das gebacken wird.','brownies',['Brownie']],
 ['Nenne ein Getränk, das typischerweise heiß serviert wird.','heiße schokolade',['Kakao','heißer Kakao','Trinkschokolade']],
 ['Nenne eine Suppe, die in Europa bekannt ist.','tomatensuppe',['Tomatencremesuppe']],
 ['Nenne eine Suppe, die in Europa bekannt ist.','borschtsch',['Borscht','Bortsch']],
 ['Nenne eine Nudelsauce.','tomatensauce',['Tomatensoße','Tomatensosse']],
 ['Nenne eine Nudelsauce.','käsesauce',['Käsesoße','Käsesosse']],
 ['Nenne eine Nudelsauce.','bolognese',['Bolognesesoße','Bolognesesauce']],
 ['Nenne ein Street-Food-Gericht.','doner kebab',['Döner','Döner Kebab','Döner Kebap']],
 ['Nenne ein Street-Food-Gericht.','hot dog',['Hotdog']],
 ['Nenne eine Stadt in Italien.','Mailand',['Milano','Milan']],
 ['Nenne eine Stadt in Italien.','Turin',['Torino']],
 ['Nenne ein Bauteil eines Autos.','Lenkrad',['Steuerrad']],
 ['Nenne einen Teil des menschlichen Fußes.','Großzehe',['großer Zeh','große Zehe']],
 ['Nenne einen Teil des menschlichen Fußes.','Kleinzehe',['kleiner Zeh','kleine Zehe']],
 ['Nenne eine Haiart.','Weißer Hai',['weißer Hai','großer weißer Hai','Great white shark']],
 ['Nenne einen Belag für Pizza.','Thunfisch',['Tunfisch','Tuna']],
 ['Nenne einen Belag für Pizza.','Zwiebeln',['Zwiebel','Onion']],
 ['Nenne einen Belag für Pizza.','Tomaten',['Tomate','Tomato']],
 ['Nenne einen Belag für Pizza.','Oliven',['Olive']],
 ['Nenne einen Schokoriegel oder eine Süßigkeitenriegel-Marke.','KitKat',['Kit Kat','Kit-Kat']],
 ['Nenne einen Schokoriegel oder eine Süßigkeitenriegel-Marke.','Kinder Riegel',['Kinderriegel','Kinder Schokolade']],
 ['Nenne eine Automarke, die Sportwagen baut.','Mercedes-Benz',['Mercedes','Mercedes Benz']],
 ['Nenne ein Gerät oder eine Maschine im Fitnessstudio.','Lat pulldown',['Latzug','Lat-Zug','Latzugmaschine']],
 ['Nenne ein Gerät oder eine Maschine im Fitnessstudio.','Smith-Maschine',['Multipresse','Smith machine']],
 ['Nenne ein Gerät oder eine Maschine im Fitnessstudio.','Hantelbank',['Trainingsbank','Gewichtsbank','weight bench']],
 ['Nenne eine Dienstleistung, die ein Friseursalon anbietet.','Haarschnitt',['Haare schneiden','Haare schneiden lassen']],
 ['Nenne eine Dienstleistung, die ein Friseursalon anbietet.','Färben',['Haare färben','Haarfarbe färben']],
 ['Nenne eine Dienstleistung, die ein Friseursalon anbietet.','Waschen',['Haare waschen']],
 ['Nenne eine Frisur oder einen Haarschnitt.','Mullet',['Vokuhila','Vorne kurz hinten lang']],
 ['Nenne eine Frisur oder einen Haarschnitt.','Dauerwelle',['Perm']],
 ['Nenne einen Gegenstand aus „Mario Kart“.','Blauer Panzer',['Stachi-Panzer','Stachipanzer','Blue shell','Spiny shell']],
 ['Nenne einen Gegenstand aus „Mario Kart“.','Stern',['Superstern','Superstar','Star']],
 ['Nenne eine Figur aus „Die Eiskönigin“ („Frozen“).','Elsa',['Königin Elsa','Queen Elsa']],
 ['Nenne eine Figur aus „Die Eiskönigin“ („Frozen“).','Anna',['Prinzessin Anna','Princess Anna']],
 ['Nenne eine Figur aus „Die Eiskönigin“ („Frozen“).','Olaf',['Schneemann Olaf']],
 ['Nenne einen Feiertag oder Festtag, der im Oktober, November oder Dezember gefeiert wird.','Nikolaustag',['Nikolaus','Sankt Nikolaus']],
 ['Nenne einen Feiertag oder Festtag, der im Oktober, November oder Dezember gefeiert wird.','Tag der Deutschen Einheit',['Deutsche Einheit','3. Oktober']],
 ['Nenne eine Chips- oder Crisps-Marke.','Funny-frisch',['Funny Frisch','Funnyfrisch']],
 ['Nenne eine Schokolade mit Waffel, Keks oder Biscuit.','Kit Kat',['KitKat','Kit-Kat']],
 ['Nenne eine Schokolade mit Waffel, Keks oder Biscuit.','Kinder Bueno',['Bueno']],
 ['Nenne eine Fast-Food-Kette, die in mehr als einem Land tätig ist.',"McDonald's",['McDonalds','Mc Donalds','Mcdonald']],
 ['Nenne eine Fast-Food-Kette, die in mehr als einem Land tätig ist.','KFC',['Kentucky Fried Chicken']],
 ['Nenne eine Fast-Food-Kette, die in mehr als einem Land tätig ist.',"Domino's",['Dominos','Dominos Pizza']],
 ['Nenne ein Tier, das in Südamerika heimisch ist.','Capybara',['Wasserschwein','Kapibara']],
 ['Nenne ein Tier, das in Südamerika heimisch ist.','Sloth',['Faultier']],
 ['Nenne eine Zitrusfrucht.','Blood orange',['Blutorange']],
 ['Nenne eine Zitrusfrucht.','Bergamot',['Bergamotte']],
 ['Nenne eine Zitrusfrucht.','Buddha\'s hand',['Buddhas Hand']],
 ['Nenne ein Wurzelgemüse.','Karotte',['Möhre','Möhren','Karotten']],
 ['Nenne einen griechischen Gott oder eine griechische Göttin.','Athena',['Athene','Pallas Athene']],
 ['Nenne einen griechischen Gott oder eine griechische Göttin.','Apollo',['Apoll','Apollon']],
 ['Nenne eine Figur aus Harry Potter.','Harry Potter',['Harry']],
 ['Nenne eine Figur aus Harry Potter.','Hermine Granger',['Hermine','Hermione','Hermione Granger']],
 ['Nenne eine Figur aus Harry Potter.','Ron Weasley',['Ron','Ronald','Ronald Weasley']],
 ['Nenne eine Figur aus Harry Potter.','Albus Dumbledore',['Dumbledore','Professor Dumbledore']],
 ['Nenne eine Figur aus Harry Potter.','Severus Snape',['Snape','Professor Snape']],
 ['Nenne eine Figur aus Harry Potter.','Lord Voldemort',['Voldemort','Tom Riddle']],
 ['Nenne eine Figur aus Harry Potter.','Draco Malfoy',['Draco']],
 ['Nenne eine Figur aus Harry Potter.','Minerva McGonagall',['McGonagall','Professor McGonagall']],
 ['Nenne eine Figur aus Harry Potter.','Rubeus Hagrid',['Hagrid']],
 ['Nenne eine Figur aus Harry Potter.','Sirius Black',['Sirius']],
 ['Nenne eine Figur aus Harry Potter.','Remus Lupin',['Lupin']],
 ['Nenne eine Figur aus Harry Potter.','Neville Longbottom',['Neville']],
 ['Nenne eine Figur aus Harry Potter.','Luna Lovegood',['Luna']],
 ['Nenne eine Figur aus Harry Potter.','Ginny Weasley',['Ginny']],
 ['Nenne eine Figur aus Harry Potter.','Bellatrix Lestrange',['Bellatrix']],
 ['Nenne eine Figur aus Harry Potter.','Dolores Umbridge',['Umbridge']],
 ['Nenne einen Mond eines Planeten in unserem Sonnensystem.','Mond',['Erdmond','der Mond']],
 ['Nenne eine Kampfkunst.','Brazilian Jiu-Jitsu',['Brasilianisches Jiu-Jitsu','Brazilian Jiu Jitsu','BJJ']],
 ['Nenne ein Fabelwesen.','Phönix',['Phoenix']]
];
let added=0,skipped=[];
for(const [question,target,variants] of groups){
 const q=bank.find(item=>n(item.q)===n(question));if(!q){skipped.push(question+': missing question');continue}
 q.answers||=[];q.answerAliases||={};
 let canonical=canonicalAnswer(q,target),seen=new Set();
 while(q.answerAliases[n(canonical)]&&!seen.has(n(canonical))){seen.add(n(canonical));const next=q.answerAliases[n(canonical)];if(n(next)===n(canonical))break;canonical=next}
 if(!q.answers.some(a=>n(a)===n(canonical))&&n(perfectAnswerFor(q))!==n(canonical)){skipped.push(question+': missing '+target);continue}
 const oldAnswers=[...q.answers],oldAliases={...q.answerAliases};
 const before=(archivedTierExamples(q).match(/noch kein festes Beispiel/g)||[]).length;
 let count=0;
 for(const variant of variants){
  const key=n(variant);if(!key||key===n(canonical))continue;
  const existing=q.answerAliases[key];
  if(existing&&n(canonicalAnswer(q,existing))!==n(canonical))continue;
  if(!q.answers.some(a=>n(a)===key)){q.answers.push(variant);count++}
  q.answerAliases[key]=canonical;
 }
 const after=(archivedTierExamples(q).match(/noch kein festes Beispiel/g)||[]).length;
 if(after>before){q.answers=oldAnswers;q.answerAliases=oldAliases;skipped.push(question+': tier preservation for '+target)}else added+=count;
}
window.ABGRUND_ALIAS_REPORT={added,skipped};
})();

/* Explicit equivalents reported by players. */
(()=>{
'use strict';
const n=normalizeFactText;
const add=(q,canonical,variants,points)=>{
 q.answers||=[];q.answerAliases||={};q.scoreOverrides||={};q.estimatedScores||={};
 if(!q.answers.some(a=>n(a)===n(canonical)))q.answers.push(canonical);
 for(const value of variants){if(!q.answers.some(a=>n(a)===n(value)))q.answers.push(value);if(n(value)!==n(canonical))q.answerAliases[n(value)]=canonical}
 const key=n(canonical);if(points!=null&&q.scoreOverrides[key]==null&&q.archiveScores?.[key]==null&&n(perfectAnswerFor(q))!==key){q.scoreOverrides[key]=points;q.estimatedScores[key]='editorial'}
};
for(const q of bank){
 const name=n(q.q);
 if(name===n('Nenne einen Verein, der aktuell oder früher in der Premier League gespielt hat.')||name===n('Nenne ein aktuelles oder ehemaliges Team aus NBA, MLB, Premier League oder NFL.'))add(q,'Hull City',['Hull','null city'],30);
 if(name===n('Nenne einen Verein, der die UEFA Europa League oder den UEFA-Pokal gewonnen hat.')||name===n('Nenne einen Gewinner der UEFA Europa League.'))add(q,'Eintracht Frankfurt',['Frankfurt','Eintracht Frankfurt am Main','SGE'],15);
 if(name===n('Nenne ein offiziell anerkanntes Sternbild.'))add(q,'Cancer',['Krebs','Sternbild Krebs'],30);
 if(name===n('Nenne ein Tier, dessen Name mit K beginnt.'))add(q,'Karausche',['Carassius carassius'],60);
}
})();
