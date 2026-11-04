const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})});
 for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1024,height:768}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765');
  await page.waitForFunction(()=>window.ABGRUND_ARCHIVE?.ready);
  await page.evaluate(()=>window.ABGRUND_ARCHIVE.ready);
  await page.locator('#begin').click();
  await page.waitForFunction(()=>document.body.classList.contains('playing'));
  await page.waitForFunction(()=>!document.getElementById('answer').disabled,{timeout:30000});
  const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,question:document.getElementById('question').textContent,diver:document.querySelector('#diver img')?.getAttribute('src'),skins:document.querySelectorAll('#abgEquipped').length}));
  if(result.scroll>result.width)throw Error('Horizontal overflow '+JSON.stringify(result));
  if(!result.question||!result.diver||errors.length)throw Error(JSON.stringify({result,errors}));
  console.log(JSON.stringify({viewport,...result,errors}));await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
