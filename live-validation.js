/* Conservative live checks: exact encyclopedia entries and explicit prompt-specific categories. */
(()=>{'use strict';
const rules=new Map([
 ['Nenne einen Zustelldienst.',/^(courier companies|postal organizations|postal services|food delivery companies|paketdienste?|postunternehmen|lieferdienste?)( in .+| of .+)?$/i],
 ['Nenne eine Kette von Coffeeshops.',/^(coffeehouse chains|coffee shop chains|coffee chains|kaffeehausketten?)$/i],
 ['Nenne ein Küchenkraut oder Gewürz.',/^(spices|culinary herbs|herbs|gewürze?|gewürzpflanzen?|küchenkräuter|küchenkraut)$/i],
 ['Nenne ein chemisches Element.',/^(chemical elements|chemische elemente|chemisches element)$/i],
 ['Nenne ein Kaffeegetränk.',/^(coffee drinks|coffee beverages|kaffeegetränke|kaffeezubereitung|types of coffee)$/i],
 ['Nenne ein Saiteninstrument.',/^(string instruments|stringed instruments|plucked string instruments|bowed string instruments|saiteninstrumente?|zupfinstrumente?|streichinstrumente?)$/i],
 ['Nenne ein Blasinstrument.',/^(wind instruments|blasinstrumente?)$/i],
 ['Nenne ein Nagetier.',/^(rodents|rodents of .+|nagetiere|rodent species)$/i],
 ['Nenne eine Kampfkunst.',/^(martial arts|kampfsportarten|kampfsportart|kampfkünste|kampfkunst|japanese martial arts|chinese martial arts|korean martial arts|combat sports)$/i],
 ['Nenne einen Cocktail.',/^(cocktails|alcoholic cocktails|non-alcoholic cocktails|cocktails with .+|cocktails made with .+|alkoholhaltiger cocktail|alkoholfreier cocktail|cocktail)$/i],
 ['Nenne ein Musikinstrument.',/^(musical instruments|string instruments|wind instruments|percussion instruments|musikinstrumente?|saiteninstrumente?|blasinstrumente?|schlaginstrumente?)( of .+| from .+)?$/i],
 ['Nenne eine Zitrusfrucht.',/^(citrus|citrus fruits|zitrusfrüchte|citrus hybrids)$/i]
].map(([q,re])=>[normalizeFactText(q),re]));
async function check(q,input){
 const rule=rules.get(normalizeFactText(q.q)),text=input.trim();if(!rule||text.length<3||text.length>180)return null;
 const cacheKey='abgrundLiveProofV2:'+normalizeFactText(q.q)+':'+normalizeFactText(text);
 const accept=proof=>{
  if(!proof||typeof proof.canonical!=='string'||proof.points!==30) return null;
  const original=proof.canonical,known=[original,proof.german].find(name=>typeof name==='string'&&verifyFact(q,name));
  const canonical=known?canonicalAnswer(q,known):original,wasLive=Number.isFinite(q.livePoints?.[normalizeFactText(canonical)]);
  const points=known?tierForAnswer(q,canonical).points:30,estimated=!known||wasLive;
  q.answers||=[];q.answerAliases||={};
  for(const name of [original,proof.german].filter(x=>typeof x==='string'&&x)){
   if(!q.answers.includes(name))q.answers.push(name);q.archiveLookup?.add(normalizeFactText(name));if(normalizeFactText(name)!==normalizeFactText(canonical))q.answerAliases[normalizeFactText(name)]=canonical;
  }
  if(proof.german){q.germanNames||={};q.germanNames[normalizeFactText(canonical)]=proof.german}
  if(estimated){q.livePoints||={};q.livePoints[normalizeFactText(canonical)]=30}
  return {...proof,canonical,points,estimated};
 };
 try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(saved&&Date.now()-saved.at<86400000)return accept(saved.proof)}catch{}
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),1800);
 try{
  const responses=await Promise.allSettled(['de','en'].map(async lang=>{
   const url='https://'+lang+'.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=categories%7Cpageprops%7Clanglinks&ppprop=disambiguation&lllang=de&cllimit=max&titles='+encodeURIComponent(text);
   const r=await fetch(url,{signal:controller.signal});if(!r.ok)return null;const data=await r.json();
   for(const page of Object.values(data.query?.pages||{})){
    if(typeof page.title!=='string'||page.missing!==undefined||page.pageprops?.disambiguation!==undefined)continue;
    const exact=normalizeFactText(page.title)===normalizeFactText(text)||(data.query?.redirects||[]).some(x=>normalizeFactText(x.from)===normalizeFactText(text)&&x.to===page.title);
    if(!exact||!(page.categories||[]).some(c=>typeof c.title==='string'&&rule.test(c.title.replace(/^(Category|Kategorie):/i,''))))continue;
    return {canonical:page.title,german:lang==='de'?page.title:page.langlinks?.find(x=>x.lang==='de')?.['*'],points:30,source:'https://'+lang+'.wikipedia.org/wiki/'+encodeURIComponent(page.title),estimated:true};
   }return null;
  }));
  const proof=responses.find(r=>r.status==='fulfilled'&&r.value)?.value;if(!proof)return null;
  try{localStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),proof}))}catch{}return accept(proof);
 }catch{return null}finally{clearTimeout(timeout)}
}
window.ABGRUND_LIVE={check,supported:q=>rules.has(normalizeFactText(q.q))};
})();
