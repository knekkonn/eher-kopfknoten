const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 for(const viewport of [{width:320,height:568},{width:390,height:844},{width:820,height:1180},{width:1024,height:768},{width:1440,height:900}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());await page.route('https://fonts.gstatic.com/**',r=>r.abort());
  await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.ABGRUND_ARCHIVE?.ready);await page.evaluate(()=>window.ABGRUND_ARCHIVE.ready);
  const fits=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow at '+viewport.width);
  await fits();await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.fonts.check('600 16px Manrope')),'local font loaded');
  if(viewport.width<1024){await page.locator('#menuToggle').click();assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true')}
  await page.locator('#rules').click();await page.locator('#modal.open').waitFor();await page.waitForFunction(()=>document.querySelector('#modal').contains(document.activeElement));
  await page.locator('#gotit').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'closeModal');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'gotit');await fits();
  await page.keyboard.press('Escape');assert.equal(await page.locator('#modal').evaluate(n=>n.classList.contains('open')),false);assert.equal(await page.evaluate(()=>document.activeElement.id),viewport.width<1024?'menuToggle':'rules');
  await page.locator('#motionToggle').click();assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');assert.equal(await page.locator('#diver img').evaluate(n=>getComputedStyle(n).animationName),'none');
  await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');
  await page.locator('#begin').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);await fits();
  assert(await page.locator('.progresshud i').evaluateAll(nodes=>new Set(nodes.map(n=>Math.round(n.getBoundingClientRect().top))).size===1),'all seven progress markers stay on one row');
  assert(await page.locator('#diver').isVisible(),'equipped character remains visible in game');
  assert.equal(await page.locator('#diver').evaluate(n=>n.parentElement.className),'world-swimmer');
  assert(await page.locator('#submitAnswer>span').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)>=14),'action label remains readable');
  assert.equal(await page.locator('.gamecard').getAttribute('aria-live'),null);assert.equal(await page.locator('#timerText').getAttribute('aria-live'),'off');
  await page.locator('#skipAnswer').click();await page.locator('#continueDive').waitFor();await fits();
  const idx=await page.evaluate(()=>save.idx);if(viewport.width<1024)await page.locator('#menuToggle').click();await page.locator('#rules').click();await page.waitForFunction(()=>document.querySelector('#modal').contains(document.activeElement));
  await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>save.idx),idx,'Enter in dialog does not advance the round');
  await page.keyboard.press('Escape');await page.locator('#continueDive').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);await fits();
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.getElementById('motionToggle').disabled);assert.equal(await page.locator('.gamecard').evaluate(n=>getComputedStyle(n).animationName),'none');
  if(process.env.ABGRUND_SCREENSHOTS)await page.screenshot({path:process.env.ABGRUND_SCREENSHOTS+'/question-'+viewport.width+'.png',fullPage:true});
  if(viewport.width===1440){await page.evaluate(()=>reveal({text:'<img src=x onerror=window.xss=1>',points:10,meters:100,tierId:'plankton'}));assert.equal(await page.locator('#diveOverlay img').count(),0);assert((await page.locator('#diveOverlay').innerText()).includes('<img src=x'));assert.equal(await page.evaluate(()=>window.xss),undefined)}
  assert.deepEqual(errors,[]);console.log('Experience: menu, focus, motion preference, game and responsive layout OK at '+viewport.width);await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
