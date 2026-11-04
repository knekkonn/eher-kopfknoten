// Run with Playwright installed and ABGRUND_BROWSER set to an optional local Chromium binary.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 const page=await browser.newPage({viewport:{width:768,height:1024},serviceWorkers:'block'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/social.js*',route=>route.fulfill({contentType:'application/javascript',body:''}));
 await page.route('**/accounts.js*',route=>route.fulfill({contentType:'application/javascript',body:''}));
 await page.route('https://www.gstatic.com/firebasejs/**',route=>{
  const url=route.request().url();let body;
  if(url.endsWith('firebase-app.js'))body='export const getApps=()=>[{}],initializeApp=()=>({});';
  else if(url.endsWith('firebase-auth.js'))body=`
   const auth={currentUser:null},listeners=[];
   export const getAuth=()=>auth;
   export const onAuthStateChanged=(_,cb)=>{listeners.push(cb);queueMicrotask(()=>cb(auth.currentUser));return()=>{}};
   window.setTestUser=uid=>{auth.currentUser=uid?{uid,providerData:[]}:null;listeners.forEach(cb=>cb(auth.currentUser))};
  `;
  else body=`
   const data=new Map(),listeners=new Set();let chain=Promise.resolve();
   export const getFirestore=()=>({});
   export const doc=(_,a,uid,b,id)=>({key:[a,uid,b,id].join('/'),kind:'doc'});
   export const collection=(_,a,uid,b)=>({key:[a,uid,b].join('/'),kind:'collection'});
   const snapshot=ref=>ref.kind==='doc'?{data:()=>data.get(ref.key),metadata:{fromCache:false}}:{docs:(data.get(ref.key)||[]).map(x=>({data:()=>x})),metadata:{fromCache:false}};
   const emit=()=>listeners.forEach(x=>x.cb(snapshot(x.ref)));
   export const onSnapshot=(ref,cb)=>{const x={ref,cb};listeners.add(x);queueMicrotask(()=>cb(snapshot(ref)));return()=>listeners.delete(x)};
   export const runTransaction=(_,fn)=>{const work=chain.then(()=>fn({get:async ref=>snapshot(ref),set:(ref,value)=>data.set(ref.key,value)}));chain=work.catch(()=>{});return work.then(result=>{queueMicrotask(emit);return result})};
   export const addDoc=async()=>{if(window.failReport)throw Object.assign(Error('offline'),{code:'unavailable'});return {id:'mock'}},serverTimestamp=()=>new Date();
   window.setTestGames=(uid,scores)=>{data.set('users/'+uid+'/games',scores.map(score=>({score})));emit()};
   window.testListenerCount=()=>listeners.size;
  `;
  return route.fulfill({contentType:'application/javascript',body});
 });
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.setTestUser&&window.setTestGames);
 assert.equal(await page.locator('.abg-perk-overlay').count(),0,'guests see no update note');
 await page.evaluate(()=>window.setTestUser('alice'));await page.getByRole('heading',{name:'NEUES AUS DER TIEFE'}).waitFor();
 await page.getByRole('button',{name:'WEITER TAUCHEN',exact:true}).click();
 await page.evaluate(()=>window.setTestGames('alice',Array(7).fill(100)));
 await page.getByRole('button',{name:'✦ SKINS',exact:true}).click();
 assert.equal(await page.locator('.abg-perk-grid button:not(:disabled)').count(),2,'sum of seven rounds never unlocks 700-point skin');
 for(const [score,count] of [[0,1],[100,2],[200,3],[400,4],[600,5],[700,6]]){
  await page.getByRole('button',{name:'WEITER TAUCHEN',exact:true}).click();await page.evaluate(score=>window.setTestGames('alice',[score]),score);
  await page.getByRole('button',{name:'✦ SKINS',exact:true}).click();assert.equal(await page.locator('.abg-perk-grid button:not(:disabled)').count(),count,'single-round threshold '+score);
 }
 await page.locator('button[data-skin=leviathan]').click();assert.equal(await page.locator('#diver').getAttribute('data-skin'),'leviathan');
 await page.evaluate(()=>window.setTestUser('bob'));await page.getByRole('heading',{name:'NEUES AUS DER TIEFE'}).waitFor();
 await page.evaluate(()=>window.setTestUser('alice'));await page.waitForTimeout(100);
 assert.equal(await page.locator('.abg-perk-overlay').count(),0,'seen update does not reappear after switching accounts');
 assert.equal(await page.evaluate(()=>window.testListenerCount()),2,'old account listeners were removed');
 await page.evaluate(()=>{
 window.failReport=true;document.getElementById('answer').value='Unbekannter Begriff';save.questionDeadline=Date.now()+20000;window.reportDeadline=save.questionDeadline;
 window.ABGRUND_FEATURES.rejected({q:'Nenne einen Zustelldienst.'},'Unbekannter Begriff');
 window.ABGRUND_REPORTS.offer({q:'Nenne einen Zustelldienst.'},'Unbekannter Begriff');document.getElementById('reportAnswer').click();
});
 assert.equal(await page.locator('#answer').inputValue(),'');assert.equal(await page.evaluate(()=>save.questionDeadline===window.reportDeadline),true);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('abgrundRejectedV1:alice')).some(x=>x.answer==='Unbekannter Begriff'&&x.priority===1)),true,'offline report is durable and prioritized');
 await page.evaluate(()=>window.setTestUser(null));assert.equal(await page.evaluate(()=>window.testListenerCount()),0);
 assert.deepEqual(errors,[]);console.log('Browser: all six single-round skin thresholds, scene replacement, account-only update notes, repeat suppression and listener cleanup OK (mock Firebase).');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
