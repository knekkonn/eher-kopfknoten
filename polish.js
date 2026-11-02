(()=>{
 const shell=document.querySelector('.shell'),footer=document.querySelector('.footer'),overlay=document.getElementById('diveOverlay');
 if(shell&&footer&&overlay)shell.insertBefore(overlay,footer);
 const main=document.querySelector('.main');
 if(main)main.setAttribute('aria-label','ABGRUND Wissensspiel');
 const rules=document.getElementById('modal');if(rules){const p=document.createElement('p');p.innerHTML='Vollständige historische Antwortlisten: <a href="https://krilliongame.com/krillion-answers/" target="_blank" rel="noopener noreferrer">Krillion-Archiv</a>. Sprachabhängige Aufgaben wurden ausgeschlossen. Deutsche Wortvarianten sind mit denselben Punkten verknüpft. <a href="./archive-import-report.json" target="_blank" rel="noopener">Importprotokoll</a> · <a href="./ARCHIVE-DICTIONARY-LICENSE.txt" target="_blank" rel="noopener">Wörterbuch-Lizenz</a>.';rules.querySelector('.modalbox')?.insertBefore(p,document.getElementById('gotit'))}
const actions=document.querySelector('.answeractions');
 if(actions){const skip=document.createElement('button');skip.id='skipAnswer';skip.className='skip-answer';skip.type='button';skip.textContent='FRAGE ÜBERSPRINGEN ↷';skip.onclick=async()=>{if(validationPending||save.answers[save.idx])return;save.skipRequested=true;await submitAnswer(true)};actions.appendChild(skip);
  if(typeof MutationObserver!=='undefined'){const answer=document.getElementById('answer'),observer=new MutationObserver(()=>{skip.disabled=answer.disabled});observer.observe(answer,{attributes:true,attributeFilter:['disabled']});skip.disabled=answer.disabled}
 }
 const previousFinish=finish;
 finish=()=>{previousFinish();const board=document.querySelector('.final-board');if(!board)return;const button=document.createElement('button');button.id='finalHome';button.className='final-home';button.type='button';button.textContent='ZUM HAUPTMENÜ';button.onclick=()=>{
   stopTimer();clearDiveOverlay();document.body.classList.remove('playing','diving','answer-revealing','run-complete');document.querySelector('.gamecard').classList.remove('complete');save=makeSession();deck=save.deckIds.map(i=>bank[i]);store();document.getElementById('begin').textContent='▼ ABTAUCHEN';document.getElementById('begin').disabled=false;document.getElementById('newRound').hidden=true;document.getElementById('resumeNote').textContent='';window.scrollTo({top:0,behavior:'auto'});
  };board.appendChild(button)};
})();
