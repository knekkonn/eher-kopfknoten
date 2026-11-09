const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await (process.env.ABGRUND_ENGINE==='webkit'?webkit:chromium).launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 for(const width of [390,820]){
  const page=await browser.newPage({viewport:{width,height:844},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // The visual game check uses a stable community response; private scoring is tested separately.
  await page.route('https://abgrund-community.knekkonn-hide-and-seek.workers.dev/**',r=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(r.request().url().includes('/scores?')?{scores:[]}:{version:'local',players:0,rounds:0,average:null,histogram:[]})}));
  await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.locator('#begin').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);
  await page.evaluate(async()=>{const q=bank.find(x=>x.archiveId==='d111-p4');deck[save.idx]=q;await window.ABGRUND_ARCHIVE.loadQuestion(q);showQ()});
  await page.waitForFunction(()=>!document.getElementById('answer').disabled&&document.getElementById('question').textContent==='Nenne ein Pokémon.');
  await page.locator('#answer').fill('Bisasam');await page.locator('#submitAnswer').click();await page.waitForFunction(()=>save.answers.length>0);
  const result=await page.evaluate(()=>save.answers[save.idx]);assert.equal(result.points,10);assert.equal(result.text,'Bisasam');assert.deepEqual(errors,[]);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('New archive: German Pokémon answer, score and layout OK at '+width);
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
