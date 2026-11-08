// Rendered typography and touch-layout regressions, including narrow and landscape screens.
const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await (process.env.ABGRUND_ENGINE==='webkit'?webkit:chromium).launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 for(const [width,height]of [[320,568],[390,844],[768,1024],[820,1180],[1024,768],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},serviceWorkers:'block',reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  const fits=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' fits '+width);
  const font=selector=>page.locator(selector).first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  const shot=async name=>{if(process.env.ABGRUND_SCREENSHOTS)await page.screenshot({path:process.env.ABGRUND_SCREENSHOTS+'/'+name+'-'+width+'.png',fullPage:true})};
  await fits('Home');assert(await font('.subhead')>=16);assert(await font('.homehub small')>=12);await shot('home');
  if(width<1024)await page.locator('#menuToggle').click();await page.locator('#rules').click();
  assert(await font('.rules-steps')>=16);assert.equal(await page.locator('.rules-steps li').count(),4);
  await page.locator('.rules-details').first().locator('summary').click();await fits('Expanded rules');await shot('rules');await page.keyboard.press('Escape');
  if(width<1024)await page.locator('#menuToggle').click();await page.locator('#accountButton').click();
  assert(await font('.account-card p')>=16);assert(await font('.account-card label')>=14);assert(await font('#accountEmail')>=16);
  assert(await page.locator('.account-card').evaluate(e=>e.scrollWidth<=e.clientWidth),'account form fits');await shot('account');await page.keyboard.press('Escape');
  await page.locator('#begin').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);
  await page.evaluate(()=>document.getElementById('question').textContent='Nenne einen Schauspieler oder eine Schauspielerin, der oder die in einem Film aus dem Marvel Cinematic Universe mitgespielt hat.');
  await fits('Long question');assert(await font('#submitAnswer>span')>=16);assert(await font('#skipAnswer>span')>=14);await shot('question');
  await page.evaluate(()=>reveal({text:'Donaudampfschifffahrtsgesellschaftskapitän',points:10,meters:100,tierId:'plankton'}));
  await page.locator('#continueDive>span').waitFor();assert.equal(await page.locator('#continueDive>span').innerText(),'Weiter');
  const colours=await page.locator('#continueDive>span').evaluate(e=>({text:getComputedStyle(e).color,button:getComputedStyle(e.parentElement).color,background:getComputedStyle(e.parentElement).backgroundColor}));
  assert.equal(colours.text,colours.button,'continue label inherits readable foreground');assert.notEqual(colours.text,colours.background);await fits('Long answer');await shot('reveal');
  await page.evaluate(()=>{save.answers=deck.map(()=>({text:'Übersprungen',points:0,meters:0,skipped:true}));save.idx=7;save.points=0;save.depth=0;finish()});
  await page.locator('.answer-review>summary').click();await fits('Expanded results');assert(await font('.answer-review li')>=16);await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.chart-heading')).fontSize)>=16);await page.waitForFunction(()=>[...document.querySelectorAll('.score-curve,.dive-log-chart')].every(s=>s.style.getPropertyValue('--chart-font')&&parseFloat(getComputedStyle(s.querySelector('text')).fontSize)*s.getBoundingClientRect().width/s.viewBox.baseVal.width>=11.9));
  assert(await page.locator('.score-curve,.dive-log-chart').evaluateAll(charts=>charts.every(s=>parseFloat(getComputedStyle(s.querySelector('text')).fontSize)*s.getBoundingClientRect().width/s.viewBox.baseVal.width>=11.9)),'chart labels retain 12 rendered pixels');await shot('results');
  assert.deepEqual(errors,[]);await page.close();console.log('Typography: home, rules, long question/answer, readable CTA and expanded results OK at '+width+'×'+height);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
