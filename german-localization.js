/* Exact translations with category checks. No network work on the game timer. */
(()=>{'use strict';
const n=normalizeFactText,lexicon=new Map(),vocabulary=new Map();
const commonGuards={bat:/tier|vogel|saugetier/,seal:/tier|saugetier|arktis|antarktis/,notebook:/buro|schreib|papier|seiten/,tie:/kleid|formell|mode/,core:/frucht|obst/,flesh:/frucht|obst/,trunk:/baum|pflanz|holz/,mercury:/element|metall|stoff/};
for(const [input,german,kind,title] of window.ABGRUND_GERMAN_LEXICON||[]){
 const key=n(input),entry={german,kind,title};
 if(lexicon.has(key)&&lexicon.get(key)?.german!==german)lexicon.set(key,null);else if(!lexicon.has(key))lexicon.set(key,entry);
}
for(const section of window.ABGRUND_GERMAN_VOCABULARY||[])for(const row of section.rows){
 const [question,input,german]=section.scope==='question'?row:[null,...row];
 const key=n(input);if(!vocabulary.has(key))vocabulary.set(key,[]);
 vocabulary.get(key).push({german,kind:section.scope,question,guard:section.scope!=='question'&&row.length>2?new RegExp(n(row.slice(2).join('|')).replaceAll(' ','|')):null});
}
function context(q){
 const text=n(q.q),literal=/\b(?:deutsches|englisches) wort\b/.test(text);
 const film=/film/.test(text),series=/serie|sitcom|fernsehsendung|tv komodie/.test(text);
 const character=/\bfigur\b|\bprotagonist|\bbosewicht|superheld|bibel/.test(text);
 const book=/\bbuch\b|\broman\b|\berzahlung\b|theaterstuck|werk von/.test(text);
 const game=/\bspiel\b|\bbrettspiel\b|\bkartenspiel\b|gesellschaftsspiel/.test(text);
 const language=/\bsprache\b|amtssprache/.test(text)&&!/programmiersprache/.test(text);
 const country=/\bland\b|\blander\b|\blandes\b|\bgebiet\b|\bbinnenland\b|\binselstaat\b|\bsowjetrepublik\b|\behemalige sowjetrepublik\b|\bnationalmannschaft\b|cricket world cup|rugby union wm|copa america|eurovision/.test(text)&&!/bundesstaat|\bprovinz\b/.test(text);
 const place=country||/\bstadt\b|\bhauptstadt\b|\bort\b|\binsel\b|\bfluss\b|\bsee\b|\bmeer\b|\bwuste\b|\bgebirge|\bgebirgskette\b|\bberg\b|\bnationalpark\b|\bregion\b|\bbucht\b|\bkolonie|landesteil|\bbauwerk\b|\bbundesstaat\b|\bprovinz\b/.test(text);
 const interfaceQuestion=/telefon einstellung|tastenkombination|email postfach|e mail postfach|fot(o|oeditor)|funktion auf|vorinstalliert|standardmassig in windows|computer teil/.test(text);
 const genericBrand=/keine marken|marken.*nicht|marken zahlen|marken apps/.test(text);
 const names=(!genericBrand&&/marke|unternehmen|anbieter|kette|internetdienstleister|nachrichtenorganisation|franchise|plattform|websit|suchmaschine|telefonanbieter|fluggesellschaft|betriebssystem|programmiersprache|\bapp\b|\banwendung\b|\bprogramm\b|\bprodukt.*(?:apple|amazon|google)|\bapple gerat\b/.test(text))||/\bsong\b|\blied\b|\bkunstler\b|\bsanger|\brapper\b|\bband\b|boyband|girlgroup|\bmusiker\b|\bspieler\b|\bspielerin\b|\bfussballer\b|\bbasketballer\b|\bschauspieler|\bperson\b|\bpromi\b|\bmaler\b|\bkomponist|\bphysiker\b|\bwissenschaftler\b|\bprasident|\bstaatsoberhaupt\b|\bregierungschef\b|\bgewinner|\bweltmeister\b|\bverein\b|\bmannschaft\b|\bteam\b|\byoutuber\b|\bstreamer\b|\bcomedian\b|\bastronaut\b|\bceo\b|\bkaiser\b/.test(text);
 const food=/gericht|essen|frucht|obst|gemuse|gewurz|kraut|getrank|eis\b|eissorte|sorbet|zutat|suppe|brot|nudel|sosse|sose|sauce|kase|nuss|beere|getreide|hulse|milch|pizza|keks|donut|bagel|sandwich|curry|wurst|su[sß]igkeit|schokolade|dessert|nachspeise|lebensmittel|salat|ei zuzubereiten/.test(text);
 const animal=/tier|vogel|saugetier|haiart|schlangenart|pinguinart|walart|katzenart|hunderasse|insekt|primatenart|amphibienart|spinnenart|katzenrasse|pokemon|schalentier|nageti|greifvogel/.test(text);
 const body=/korper|menschlichen|medizin|symptom|krankheit|gehirn|muskel|knochen|kopf|haar/.test(text);
 const astronomy=/planet|mond|sonnensystem|sternbild|astronom|weltraum/.test(text);
 const color=/farb|farbung|tonung|schattierung|gelbton|blauschattierung|schattierung|\bhaartyp\b/.test(text);
 const sport=/sport|disziplin|fitness|kraftubung|calisthenics|boxen|box|gymnastik|yoga|olymp|schach|schlag|wurf|foul|regelverstoss/.test(text);
 return{text,literal,film,series,character,book,game,language,country,place,interfaceQuestion,names,food,animal,body,astronomy,color,sport};
}
function allowed(c,kind){
 if(c.literal)return false;
 if(kind==='question')return true;
 // A brand, artist, song or programming language keeps its proper name.
 if(c.names&&kind!=='interface')return false;
 if(kind==='country')return c.country;
 if(kind==='place')return c.place;
 if(kind==='language')return c.language;
 if(kind==='interface')return c.interfaceQuestion;
 if(kind==='film')return c.film;
 if(kind==='series')return c.series;
 if(kind==='character')return c.character;
 if(kind==='book')return c.book;
 if(kind==='game')return c.game;
 if(kind==='organism')return(c.animal||c.food||/pflanz|baum|holzart|blumen|pilzart|lebewesen/.test(c.text))&&!c.body;
 if(kind==='food')return c.food||/substanz|tube|dose|pulver|flasche|rolle|stab|schuttel/.test(c.text);
 if(kind==='body')return c.body;
 if(kind==='astronomy')return c.astronomy;
 if(kind==='color')return c.color;
 if(kind==='sport')return c.sport||c.game;
 if(kind==='music')return/instrument|musik|orchester/.test(c.text);
 if(kind==='religion')return/religio|gott|gottin|symbol|bibel|fest|feiertag|hindu|christ|juden|islam|buddhis/.test(c.text);
 if(kind==='math')return/mathe|mess|einheit|diagramm|grafik|geometr|\bform\b|zahl|prozent/.test(c.text);
 if(kind==='material')return/stoff|substanz|material|textil|element|metall|mineral|gestein|gas|edelstein|pulver|zutat/.test(c.text);
 if(kind==='clothing')return/kleid|schuh|hut|haar|frisur|bart|textil|mode|brille/.test(c.text);
 if(kind==='object'&&(c.food||c.animal||c.body||c.astronomy||c.color||c.sport))return false;
 return !c.names&&!c.film&&!c.series&&!c.character&&!c.book&&!c.language&&!c.country;
}
function literalFits(c,german){
 // A translation must not change the letter condition in the question.
 if(/deutscher oder englischer|englischer name/.test(c.text))return true;
 const starts=c.text.match(/name.*mit ([a-z]) beginnt/),ends=c.text.match(/name.*auf ([a-z]+) endet/),contains=c.text.match(/name.* ([a-z]{2,}) enthalt/);
 const key=n(german);return(!starts||key.startsWith(starts[1]))&&(!ends||key.endsWith(ends[1]))&&(!contains||key.includes(contains[1]));
}
function candidate(q,input){
 const c=q.germanContext||=context(q),key=n(input);
 if(c.literal)return '';
 const entries=vocabulary.get(key)||[];
 for(const entry of [...entries].reverse()){
  if(entry.question&&n(entry.question)!==c.text)continue;
  if(!allowed(c,entry.kind)||(entry.guard&&!entry.guard.test(c.text))||!literalFits(c,entry.german))continue;
  return entry.german;
 }
 const entry=lexicon.get(key);
 if(!entry||!allowed(c,entry.kind)||(commonGuards[key]&&!commonGuards[key].test(c.text))||!literalFits(c,entry.german))return '';
 // Preserve disambiguating qualifiers rather than guessing another title's sense.
 return entry.german;
}
window.ABGRUND_LOCALIZATION={candidate,context,literalFits,allowed};
})();
