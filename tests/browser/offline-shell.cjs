const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.ABGRUND_BROWSER?{executablePath:process.env.ABGRUND_BROWSER}:{})}),context=await browser.newContext(),page=await context.newPage();
 await page.goto(process.env.ABGRUND_URL||'http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>navigator.serviceWorker?.controller,{timeout:30000});
 await page.waitForFunction(async()=>{const names=await caches.keys();const name=names.find(x=>x.startsWith('abgrund-shell-'));return !!name&&!!(await(await caches.open(name)).match('./index.html'))},{timeout:30000});
 await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.ABGRUND_DEPTH?.maximum===7000,{timeout:10000});
 assert.equal(await page.locator('#begin').count(),1);console.log('Offline navigation keeps the current game shell available');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
