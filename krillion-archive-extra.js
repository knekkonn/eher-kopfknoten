/* Extra dated Krillion archive records from source pages supplied by project owner. */
(() => {
'use strict';
if(typeof bank==='undefined'||typeof normalizeFactText!=='function')return;
const n=v=>normalizeFactText(String(v??'')),add=(a,v)=>{if(v&&!a.some(x=>n(x)===n(v)))a.push(v)};
const rows=[
['2026-10-25','Nenne eine Art von Bett zum Schlafen.','Babuchuang',[['Babuchuang',100],['Adjustable air bed',85],['Air-fluidized bed',85]]],
['2026-10-25','Nenne ein Lebensmittel oder eine Zutat, die mehr als 100 US-Dollar pro Kilogramm kostet.','Hasma',[['Hasma',100],['7 Pot pepper',85],['A2 bilona ghee',85]]],
['2026-10-25','Nenne einen Song, der Platz 1 der Billboard Hot 100 erreicht hat.','Sukiyaki',[['Sukiyaki',100],["(Can't Live Without Your) Love and Affection",85],["(Hey Won't You Play) Another Somebody Done Somebody Wrong Song",85]]],
['2026-10-25','Nenne einen Nationalpark irgendwo auf der Welt.','Keibul Lamjao',[['Keibul Lamjao',100],['Abaco National Park',85],['Abel Beth Maacah National Park',85]]],
['2026-10-25','Nenne eine TV-Komödie mit mindestens 1.000 IMDb-Bewertungen.','Little Mole',[['Little Mole',100],['¡Mucha Lucha!',85],["'Til Death",85]]],
['2026-10-25','Nenne ein Land, in dem irgendwo Wüstenklima vorkommt.','United Kingdom',[['United Kingdom',100],['Burkina Faso',85],['Cabo Verde',85]]],
['2026-10-25','Nenne einen aktuellen Spieler eines Premier-League- oder NFL-Teams.','Tom King',[['Tom King',100],['A.J. Haulcy',85],["A'Shawn Robinson",85]]],
['2026-07-16','Nenne ein Tier, dessen Name mit K beginnt.','Kouprey',[['Kouprey',100],['Kagu',85],['Kakariki',85]]],
['2026-07-16','Nenne ein Land in Afrika.','São Tomé and Príncipe',[['São Tomé and Príncipe',100],['Burundi',85],['Cabo Verde',85]]],
['2026-07-16','Nenne eine Nudelform.','Su filindeu',[['Su filindeu',100],['Acini di pepe',85],['Anelli',85]]],
['2026-07-16','Nenne einen abendfüllenden Pixar-Film.','Elio',[['Elio',100],['Cars 3',85],['Onward',85]]],
['2026-07-16','Nenne ein chemisches Element, dessen englischer Name auf „-ium“ endet.','Dysprosium',[['Dysprosium',100],['Actinium',85],['Berkelium',85]]],
['2026-07-16','Nenne eine Sportart, die irgendwann Teil der Olympischen Sommerspiele war.','Basque pelota',[['Basque pelota',100],['Cricket',85],['Croquet',85]]],
['2026-07-16','Nenne ein Instrument, das in einem Sinfonieorchester vorkommt.','Wagner tuba',[['Wagner tuba',100],['Alto flute',85],['Bass clarinet',85]]],
['2026-07-18','Nenne die Hauptstadt eines europäischen Landes.','Valletta',[['Valletta',100],['Andorra la Vella',85],['Astana',85]]],
['2026-07-18','Nenne eine Zitrusfrucht.','Etrog',[['Etrog',100],["Buddha's hand",85],['Calamansi',85]]],
['2026-07-18','Nenne einen Film, der den Oscar für den besten Film gewonnen hat.','Wings',[['Wings',100],['A Man for All Seasons',85],['All About Eve',85]]],
['2026-07-18','Nenne ein offiziell anerkanntes Sternbild.','Equuleus',[['Equuleus',100],['Antlia',85],['Apus',85]]],
['2026-07-18','Nenne ein NBA-Team.','Kansas City Kings',[['Kansas City Kings',100],['Toronto Huskies',100],['Anderson Packers',85]]],
['2026-07-18','Nenne ein Wurzelgemüse.','Crosne',[['Crosne',100],['Arracacha',85],['Arrowroot',85]]],
['2026-07-18','Nenne einen griechischen Gott oder eine griechische Göttin.','Coeus',[['Coeus',100],['Aeolus',85],['Aether',85]]],
['2026-07-21','Nenne ein Binnenland.','Uzbekistan',[['Uzbekistan',100],['Andorra',85],['Botswana',85]]],
['2026-07-21','Nenne eine Haiart.','Cookie cutter shark',[['Cookie cutter shark',100],['Angel shark',85],['Bamboo shark',85]]],
['2026-07-21','Nenne einen Cocktail.','Remember the Maine',[['Remember the Maine',100],['Aviation',85],['Bijou',85]]],
['2026-07-21','Nenne eine Figur aus Harry Potter.','Bathilda Bagshot',[['Bathilda Bagshot',100],['Aberforth',85],['Albus Severus Potter',85]]],
['2026-07-21','Nenne einen Mond eines Planeten in unserem Sonnensystem.','Skathi',[['Skathi',100],['Adrastea',85],['Ananke',85]]],
['2026-07-21','Nenne eine Kampfkunst.','Systema',[['Systema',100],['Baguazhang',85],['Bajiquan',85]]],
['2026-07-21','Nenne ein Fabelwesen.','Catoblepas',[['Catoblepas',100],['Ammit',85],['Aswang',85]]]
];
let addedQuestions=0,addedAnswers=0;
for(const [date,text,full,picks] of rows){let q=bank.find(x=>n(x.q)===n(text));if(!q){q={q:text,answers:[],full,top:full,reviewedOnly:true,sourceDate:date,sourceUrl:`https://krilliongame.com/krillion-answers/${date}/#krilling-practice`};bank.push(q);addedQuestions++;}q.answers||=[];q.scoreOverrides||={};q.full||=full;q.top||=full;for(const [answer,score] of picks){const before=q.answers.length;add(q.answers,answer);if(q.answers.length>before)addedAnswers++;q.scoreOverrides[n(answer)]=score;}}
const countryAliases=[['Vereinigtes Königreich','United Kingdom'],['Großbritannien','United Kingdom'],['Grossbritannien','United Kingdom'],['Kap Verde','Cabo Verde'],['São Tomé und Príncipe','São Tomé and Príncipe'],['Sao Tome und Principe','São Tomé and Príncipe']];
for(const q of bank){q.answerAliases||={};const vals=[...q.answers,q.full,q.top].filter(Boolean);for(const [alias,target] of countryAliases){const canonical=vals.find(v=>n(v)===n(target));if(canonical)q.answerAliases[n(alias)]=canonical;}}
try{if(typeof save!=='undefined'&&typeof makeSession==='function'&&!save.started&&!save.done){save=makeSession();deck=save.deckIds.map(i=>bank[i]);if(typeof store==='function')store();}}catch{}
window.KRILLION_EXTRA_REPORT={archiveQuestions:rows.length,addedQuestions,addedAnswers,bankSize:bank.length,updated:'2026-11-01'};
})();
