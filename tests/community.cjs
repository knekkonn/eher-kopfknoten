const TEST_BASE=require('node:path').resolve(__dirname,'..'),TEST_TEMP=require('node:os').tmpdir();
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process'),{webcrypto}=require('node:crypto');
(async()=>{
const database=TEST_TEMP+'/community-test-'+webcrypto.randomUUID()+'.sqlite';
cp.execFileSync('/usr/bin/python3',['-c','import sqlite3,sys; c=sqlite3.connect(sys.argv[1]); c.executescript(open(sys.argv[2]).read()); c.commit()',database,TEST_BASE+'/community/schema.sql']);
const execute=statements=>JSON.parse(cp.execFileSync('/usr/bin/python3',[TEST_BASE+'/tests/sqlite-bridge.py',database],{input:JSON.stringify(statements),encoding:'utf8'}));
class Statement{constructor(sql,params=[]){this.sql=sql;this.params=params}bind(...params){return new Statement(this.sql,params)}async run(){return execute([this])[0]}async all(){return execute([this])[0]}async first(){return execute([this])[0].results[0]||null}}
const db={prepare:sql=>new Statement(sql),batch:async statements=>execute(statements)};
let now=Date.UTC(2026,10,2,12);class Clock extends Date{static now(){return now}};
const pair=await webcrypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk=await webcrypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='test-key';jwk.alg='RS256';
const cache=new Map(),cacheApi={match:async r=>cache.get(r.url)?.clone(),put:async(r,v)=>cache.set(r.url,v.clone())};
const testFetch=async request=>{const url=typeof request==='string'?request:request.url;if(url.includes('googleapis.com/service_accounts'))return Response.json({keys:[jwk]});if(url.includes('/archive-validation/')){const part=url.split('/archive-validation/')[1][0];return new Response(fs.readFileSync(TEST_BASE+'/archive-validation/'+part+'.bin'))}throw Error('Unexpected URL '+url)};
const context=vm.createContext({console,crypto:webcrypto,Date:Clock,Intl,URL,TextEncoder,TextDecoder,Uint8Array,Response,Request,AbortSignal,atob,fetch:testFetch,caches:{default:cacheApi}});
vm.runInContext(fs.readFileSync(TEST_BASE+'/community/worker.js','utf8').replace('export default {','globalThis.worker={'),context);
const worker=context.worker,pending=[],ctx={waitUntil:p=>pending.push(p)};
const b64=b=>Buffer.from(b).toString('base64url');
async function jwt(uid,verified=true,aud='krillion-d74e1'){const h=b64(JSON.stringify({alg:'RS256',kid:'test-key'})),c=b64(JSON.stringify({sub:uid,aud,iss:'https://securetoken.google.com/krillion-d74e1',iat:Math.floor(now/1000)-1,auth_time:Math.floor(now/1000)-1,exp:Math.floor(now/1000)+86400,email_verified:verified,firebase:{sign_in_provider:'password'}}));const signature=await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(h+'.'+c));return h+'.'+c+'.'+b64(signature)}
async function call(path,body,token,origin='https://knekkonn.github.io'){const response=await worker.fetch(new Request('https://community.test'+path,{method:body?'POST':'GET',headers:{origin,...(token?{authorization:'Bearer '+token}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined}),{DB:db},ctx);return{status:response.status,data:await response.json()}}
const a=await jwt('alice'),b=await jwt('bob'),unverified=await jwt('new-user',false),manifest=JSON.parse(fs.readFileSync(TEST_BASE+'/archive-manifest.json','utf8')),questions=manifest.slice(0,7).map(x=>x.validationId),gz=require('node:zlib');
const records=m=>JSON.parse(gz.gunzipSync(fs.readFileSync(TEST_BASE+'/'+m.path)).toString()).find(x=>x.id===m.id).rows;
assert.equal((await call('/rounds',{questions})).status,401);assert.equal((await call('/rounds',{questions},await jwt('eve',true,'other-project'))).status,401);assert.equal((await call('/rounds',{questions},a.slice(0,-3)+'abc')).status,401);assert.equal((await call('/rounds',{questions},a,'https://attacker.example')).status,403);
assert.equal((await call('/rounds',{questions:[...questions.slice(0,6),questions[0]]},a)).status,400);
let r=await call('/rounds',{questions},a);assert.equal(r.status,200);const round=r.data.id;
assert.equal((await call('/begin',{round,index:0},b)).status,404);assert.equal((await call('/begin',{round,index:1},a)).status,409);
const initial=(await call('/begin',{round,index:0},a)).data;assert.equal(initial.remainingMs,30000);now+=10000;assert.equal((await call('/begin',{round,index:0},a)).data.remainingMs,20000,'reload never resets the server deadline');
let expected=0;
for(let index=0;index<7;index++){
 if(index)await call('/begin',{round,index},a);const answer=records(manifest[index])[0];now+=1000;const result=await call('/answer',{round,index,answer:answer[0]},a);assert.equal(result.status,200,JSON.stringify(result));assert.equal(result.data.points,answer[1]);expected+=answer[1];
 const repeat=await call('/answer',{round,index,answer:'wrong'},a);assert.equal(repeat.data.points,answer[1]);assert.equal(repeat.data.repeated,true);
}
let publicStats=(await call('/stats')).data;assert.equal(publicStats.players,1);assert.equal(publicStats.rounds,1);assert.equal(publicStats.average,expected);
assert.equal((await db.prepare('SELECT COUNT(*) n FROM observations').first()).n,7,'replays do not duplicate observations');
let second=(await call('/rounds',{questions},unverified)).data.id;await call('/begin',{round:second,index:0},unverified);now+=33000;let expired=await call('/answer',{round:second,index:0,answer:records(manifest[0])[0][0]},unverified);assert.equal(expired.data.points,0);assert.equal(expired.data.timedOut,true);
assert.equal((await db.prepare('SELECT COUNT(*) n FROM observations').first()).n,7,'unverified accounts never alter population statistics');
let third=(await call('/rounds',{questions},b)).data.id;await call('/begin',{round:third,index:0},b);assert.equal((await call('/answer',{round:third,index:0,answer:'made-up-answer'},b)).status,422);assert.equal((await call('/begin',{round:third,index:1},b)).status,409);
context.testBase=30;assert(vm.runInContext('calibratedPoints(30,60,6,1000)<=calibratedPoints(30,60,6,29000)',context));assert(vm.runInContext('calibratedPoints(30,60,6,1000)<calibratedPoints(30,60,6,29000)',context),'response speed changes tiers near a threshold');
const common=records(manifest[0]).find(x=>x[1]===10),rare=records(manifest[0])[0];const commonHash=await vm.runInContext('hash('+JSON.stringify(questions[0]+'\n'+common[0].toLowerCase())+')',context),rareHash=await vm.runInContext('hash('+JSON.stringify(questions[0]+'\n'+rare[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9]+/g).join(' '))+')',context);
for(let i=0;i<30;i++)await db.prepare('INSERT INTO observations(day,uid,qid,answer_hash,response_ms,baseline) VALUES(?,?,?,?,?,?)').bind('2026-10-'+String(28+Math.floor(i/10)).padStart(2,'0'),'seed-'+i%10,questions[0],(i<20?commonHash:rareHash).slice(0,32),i<20?1500:23000,i<20?10:100).run();
now=Date.UTC(2026,10,3,12);await vm.runInContext('rollup',context)(db,now);const scored=(await db.prepare('SELECT * FROM daily_scores WHERE qid=?').bind(questions[0]).all()).results;assert(scored.length>=2,'qualified population creates daily scores');const fast=scored.find(x=>x.answer_hash===commonHash.slice(0,32)),slow=scored.find(x=>x.answer_hash===rareHash.slice(0,32));assert(fast.points<slow.points);let count=(await db.prepare('SELECT COUNT(*) n FROM daily_scores').first()).n;await vm.runInContext('rollup',context)(db,now);assert.equal((await db.prepare('SELECT COUNT(*) n FROM daily_scores').first()).n,count,'daily rollup is idempotent');
await Promise.all(pending);fs.unlinkSync(database);console.log('Community: Firebase JWT validation, ownership, server deadlines, replay protection, verified-only observations, daily calibration and population averages OK');
})().catch(e=>{console.error(e);process.exitCode=1});
