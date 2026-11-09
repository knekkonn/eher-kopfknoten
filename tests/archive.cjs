const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes=new Map(),storage=new Map(),cloud=new Map(),listeners=new Map();
const node=id=>{if(!nodes.has(id)){const classes=new Set();nodes.set(id,{value:'',textContent:'',innerHTML:'',disabled:false,hidden:false,dataset:{},style:{setProperty(){}},classList:{add:(...a)=>a.forEach(x=>classes.add(x)),remove:(...a)=>a.forEach(x=>classes.delete(x)),contains:x=>classes.has(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)},addEventListener(){},focus(){},appendChild(){},querySelector:s=>node(id+s),querySelectorAll:()=>[]})}return nodes.get(id)};
const auth={currentUser:null};let authListener=()=>{},failNext=false;
const fire=uid=>{for(const cb of listeners.get(uid)||[]){const docs=[...(cloud.get(uid)||new Map())].map(([id,data])=>({id,data:()=>data,metadata:{hasPendingWrites:false}}));cb({docs,metadata:{fromCache:false}})}};
const fakeApp={initializeApp:()=>({})};
const fakeAuth={getAuth:()=>auth,onAuthStateChanged:(_,cb)=>{authListener=cb;cb(auth.currentUser)},GoogleAuthProvider:class{},EmailAuthProvider:{credential:(email,password)=>({email,password})},
 signInWithEmailAndPassword:async(_,email)=>{auth.currentUser={uid:email.split('@')[0],email,providerData:[{providerId:'password'}]};authListener(auth.currentUser)},
 createUserWithEmailAndPassword:async(_,email)=>{auth.currentUser={uid:email.split('@')[0],email,providerData:[{providerId:'password'}]};authListener(auth.currentUser)},
 signInWithPopup:async()=>{auth.currentUser={uid:'google',email:'google@example.com',providerData:[{providerId:'google.com'}]};authListener(auth.currentUser)},
 signOut:async()=>{auth.currentUser=null;authListener(null)},linkWithPopup:async u=>u.providerData.push({providerId:'google.com'}),linkWithCredential:async u=>u.providerData.push({providerId:'password'}),sendPasswordResetEmail:async()=>{}};
const fakeFire={getFirestore:()=>({}),collection:(_,a,uid)=>({uid}),doc:(_,a,uid,b,id)=>({uid,id}),onSnapshot:(ref,options,cb)=>{if(!listeners.has(ref.uid))listeners.set(ref.uid,new Set());listeners.get(ref.uid).add(cb);queueMicrotask(()=>fire(ref.uid));return()=>listeners.get(ref.uid).delete(cb)},setDoc:async(ref,data)=>{if(failNext){failNext=false;throw Object.assign(Error('offline'),{code:'unavailable'})}if(!cloud.has(ref.uid))cloud.set(ref.uid,new Map());cloud.get(ref.uid).set(ref.id,data);queueMicrotask(()=>fire(ref.uid))}};
const ctx=vm.createContext({console,URL,AbortController,Event,CustomEvent:class{},queueMicrotask,fakeApp,fakeAuth,fakeFire,document:{getElementById:node,createElement:()=>node('created-dialog'),querySelector:node,querySelectorAll:()=>[],body:node('body'),documentElement:node('root'),addEventListener(){}},window:{innerHeight:844,dispatchEvent(){},addEventListener(){},ABGRUND_FIREBASE_CONFIG:{apiKey:'test',authDomain:'test',projectId:'test',appId:'test'}},navigator:{},location:{href:'https://example.test/'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},fetch:async()=>{throw Error('offline')}});
vm.runInContext(script,ctx);
for(const file of ['krillion-patch.js','krillion-archive-extra.js','answer-expansion.js','tier-calibration.js','answer-corrections.js','question-pack.js','question-pack-extra.js','fact-fixes.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),complete=points=>{ctx.points=points;run("save={started:true,idx:7,depth:1000,points,answers:Array.from({length:7},()=>({text:'x',points:0,meters:0})),done:false,counted:false,deckIds:Array(7).fill(0)};deck=save.deckIds.map(i=>bank[i]);finish()");};


(async()=>{
const {Blob}=require('node:buffer'),{DecompressionStream}=require('node:stream/web');
Object.assign(ctx,{Blob,DecompressionStream,Response,TextDecoder,TextEncoder});
ctx.fetch=async path=>new Response(fs.readFileSync(String(path).replace(/^\.\//,'')));
vm.runInContext(fs.readFileSync('archive-pack.js','utf8'),ctx);
const manifest=await ctx.window.ABGRUND_ARCHIVE.ready;
vm.runInContext(fs.readFileSync('reviewed-answers.js','utf8'),ctx);
assert.equal(manifest.length,744);assert.equal(new Set(run('bank.map(q=>normalizeFactText(q.q))')).size,run('bank.length'),'no exact question duplicates');
const functions=run('({verify:verifyFact,tier:tierForAnswer,canon:canonicalAnswer,n:normalizeFactText})');
const zlib=require('node:zlib'),files=new Map();let records=0,aliases=0;
for(const meta of manifest){
 const q=run('bank').find(q=>q.archiveId===meta.validationId);assert(q,meta.q);await ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);
 if(!files.has(meta.path))files.set(meta.path,JSON.parse(zlib.gunzipSync(fs.readFileSync(meta.path)).toString()));
 const payload=files.get(meta.path).find(x=>x.id===meta.id);assert.equal(payload.rows.length,meta.count);
 for(const [answer,points,variants=[]] of payload.rows){assert(functions.verify(q,answer),answer);if(!q.reviewedCanonical?.[functions.n(answer)])assert.equal(functions.tier(q,functions.canon(q,answer)).points,points,meta.q+': '+answer);records++;
  for(const alias of variants){assert(functions.verify(q,alias),alias);if(!q.reviewedCanonical?.[functions.n(alias)]&&!q.reviewedCanonical?.[functions.n(answer)])assert.equal(functions.tier(q,functions.canon(q,alias)).points,points,meta.q+': '+alias);aliases++}
 }
}
assert.equal(records,JSON.parse(fs.readFileSync("archive-import-report.json")).importedAnswerRows);assert(aliases>=39746);assert(!run('bank.filter(q=>q.archiveId).some(q=>/ARCHIVE_DATE/.test(q.q))'));
for(const [question,answer,aliases] of ctx.window.ABGRUND_REVIEWED_ANSWERS.entries){
 const q=run('bank').find(q=>q.q===question);assert(q,question);await ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);
 for(const value of [answer,...aliases]){assert(functions.verify(q,value),question+': '+value);assert.equal(functions.tier(q,functions.canon(q,value)).points,functions.tier(q,answer).points)}
}
ctx.q=run('bank.find(q=>q.archiveCount>50000)');assert.equal(run("completionOptions(q,'John').suggestion"),'','short name cannot reveal a full news organization');
assert.equal(functions.n('北京日报'),'北京日报','non-Latin names remain distinct');
console.log(records+' source answers and '+aliases+' German aliases: exact points and acceptance verified across all 117 saved dives');
})().catch(e=>{console.error(e);process.exitCode=1});
