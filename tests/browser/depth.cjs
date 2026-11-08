const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await (process.env.ABGRUND_ENGINE==='webkit'?webkit:chromium).launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 for(const [width,height]of [[320,568],[390,844],[820,1180],[1024,768]]){
  const page=await browser.newPage({viewport:{width,height},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});await page.locator('#begin').click();await page.waitForFunction(()=>window.ABGRUND_DEPTH&&!document.getElementById('answer').disabled);
  assert(await page.locator('.world-swimmer').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('.gamecard').getBoundingClientRect().bottom),'skin never covers question');
  const snapshot=await page.evaluate(()=>({deadline:save.questionDeadline,points:save.points}));
  await page.evaluate(()=>{save.depth=1000;reveal({text:'Testantwort',points:100,meters:1000,tier:'one-in-a-krillion'})});
  await page.locator('.depth-journey').waitFor();assert(await page.locator('.world-swimmer').isVisible(),'skin accompanies descent feedback');await page.waitForFunction(()=>document.querySelector('.journey-depth').textContent==='1.000 m');
  assert.equal(await page.locator('.journey-zone').innerText(),'Mitternachtszone');
  assert.equal(await page.locator('.depth-mini').getAttribute('aria-valuenow'),'1000');
  assert.deepEqual(await page.evaluate(()=>({deadline:save.questionDeadline,points:save.points})),snapshot,'visual animation never changes score or deadline');
  let darkness=Number(await page.locator('html').evaluate(e=>e.style.getPropertyValue('--ocean-darkness')));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [depth,zone] of [[0,'Lichtzone'],[199,'Lichtzone'],[200,'Dämmerzone'],[999,'Dämmerzone'],[1000,'Mitternachtszone'],[3999,'Mitternachtszone'],[4000,'Abyssalzone'],[5999,'Abyssalzone'],[6000,'Hadalzone'],[7000,'Hadalzone']]){
   await page.evaluate(d=>window.ABGRUND_DEPTH.update(d),depth);assert.equal(await page.locator('.journey-zone').innerText(),zone);assert.equal(await page.locator('.depth-mini').getAttribute('aria-valuenow'),String(depth));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'rail fits '+width);
  }
  assert(Number(await page.locator('html').evaluate(e=>e.style.getPropertyValue('--ocean-darkness')))>darkness,'deeper water is darker');
  assert(await page.locator('.world-ruler').isVisible(),'moving world ruler remains visible');
  assert(await page.locator('.world-ruler').evaluate(e=>{const marker=e.querySelector('.ruler-you').getBoundingClientRect(),ticks=e.querySelector('.ruler-ticks').getBoundingClientRect();return Math.abs(marker.y+marker.height/2-ticks.bottom)<2}),'7000 metres reaches the moving ruler bottom');
  assert.equal(await page.locator('.ruler-ticks span').last().innerText(),'7.000');
  if(process.env.ABGRUND_SCREENSHOTS)await page.screenshot({path:process.env.ABGRUND_SCREENSHOTS+'/depth-'+width+'.png',fullPage:true});
  await page.evaluate(()=>window.ABGRUND_DEPTH.update(0));assert.equal(await page.locator('.journey-depth').innerText(),'0 m','new round resets instantly');
  assert.deepEqual(errors,[]);await page.close();console.log('Depth: animation, real zone boundaries, 7000m endpoint, reduced motion and unchanged gameplay OK at '+width);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
