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
const rotations=new Map();let revision=0;
const fakeFire={getDoc:async ref=>({data:()=>rotations.get(ref.uid)}),runTransaction:async(_,fn)=>{for(let retry=0;retry<10;retry++){const version=revision;let write;const result=await fn({get:async ref=>({data:()=>rotations.get(ref.uid)}),set:(ref,data)=>{write={ref,data}}});if(version!==revision)continue;if(failNext){failNext=false;throw Error("offline")}if(write){rotations.set(write.ref.uid,write.data);revision++}return result}throw Error("conflict")},getFirestore:()=>({}),collection:(_,a,uid)=>({uid}),doc:(_,a,uid,b,id)=>({uid,id}),onSnapshot:(ref,options,cb)=>{if(!listeners.has(ref.uid))listeners.set(ref.uid,new Set());listeners.get(ref.uid).add(cb);queueMicrotask(()=>fire(ref.uid));return()=>listeners.get(ref.uid).delete(cb)},setDoc:async(ref,data)=>{if(failNext){failNext=false;throw Object.assign(Error('offline'),{code:'unavailable'})}if(!cloud.has(ref.uid))cloud.set(ref.uid,new Map());cloud.get(ref.uid).set(ref.id,data);queueMicrotask(()=>fire(ref.uid))}};
const ctx=vm.createContext({console,URL,AbortController,Event,CustomEvent:class{},queueMicrotask,fakeApp,fakeAuth,fakeFire,document:{getElementById:node,createElement:()=>node('created-dialog'),querySelector:node,querySelectorAll:()=>[],body:node('body'),documentElement:node('root'),addEventListener(){}},window:{innerHeight:844,dispatchEvent(){},addEventListener(){},ABGRUND_FIREBASE_CONFIG:{apiKey:'test',authDomain:'test',projectId:'test',appId:'test'}},navigator:{},location:{href:'https://example.test/'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},fetch:async()=>{throw Error('offline')}});
vm.runInContext(script,ctx);
for(const file of ['krillion-patch.js','krillion-archive-extra.js','answer-expansion.js','tier-calibration.js','answer-corrections.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),complete=points=>{ctx.points=points;run("save={started:true,idx:7,depth:1000,points,answers:Array.from({length:7},()=>({text:'x',points:0,meters:0})),done:false,counted:false,deckIds:Array(7).fill(0)};deck=save.deckIds.map(i=>bank[i]);finish()");};
let code=fs.readFileSync('accounts.js','utf8').replace("import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js')",'Promise.resolve(fakeApp)').replace("import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')",'Promise.resolve(fakeAuth)').replace("import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')",'Promise.resolve(fakeFire)');
vm.runInContext(code,ctx);
const flush=async()=>{for(let i=0;i<8;i++)await new Promise(resolve=>setImmediate(resolve))};
(async()=>{
 await flush();complete(100);assert.equal(run('readScoreHistory().length'),1);
 node('accountEmail').value='alice@example.com';node('accountPassword').value='password123';await node('accountLogin').onclick();await flush();
 assert.equal(storage.has('abgrundScoreHistoryV1'),false,'guest records moved once');assert.equal(cloud.get('alice').size,1,'guest score uploaded');assert.deepEqual([...cloud.get('alice').values()].map(x=>x.score),[100]);
 failNext=true;complete(200);await flush();assert.equal(run('readScoreHistory().length'),2,'failed upload remains on device');assert.equal(cloud.get('alice').size,1);node('accountRetry').onclick();await flush();assert.deepEqual([...cloud.get('alice').values()].map(x=>x.score).sort((a,b)=>a-b),[100,200]);
 await node('accountLogout').onclick();await flush();node('accountEmail').value='bob@example.com';node('accountPassword').value='password123';await node('accountRegister').onclick();await flush();
 assert.equal(run('readScoreHistory().length'),0,'second account cannot inherit first account history');complete(35);await flush();assert.deepEqual([...cloud.get('bob').values()].map(x=>x.score),[35]);
 await node('accountLogout').onclick();node('accountEmail').value='alice@example.com';node('accountPassword').value='password123';await node('accountLogin').onclick();await flush();
 assert.deepEqual(Array.from(run('readScoreHistory()'),x=>x.score).sort((a,b)=>a-b),[100,200]);assert.equal(run('scoreBests().all'),200);
 await node('accountLinkGoogle').onclick();assert(auth.currentUser.providerData.some(x=>x.providerId==='google.com'));
 await node('accountLogout').onclick();await node('accountGoogle').onclick();await flush();assert.equal(auth.currentUser.uid,'google');node('accountNewPassword').value='a strong password';await node('accountLinkPassword').onclick();assert(auth.currentUser.providerData.some(x=>x.providerId==='password'));
 const planner=state=>run('planSession('+JSON.stringify(state||null)+',"google")');
 const [first,second]=await Promise.all([ctx.window.ABGRUND_ACCOUNTS.reserveRotation(planner),ctx.window.ABGRUND_ACCOUNTS.reserveRotation(planner)]);
 assert.equal(rotations.get('google').round,2);assert(first.rotationCommitted&&second.rotationCommitted);
 assert(!first.deckQuestions.some(q=>second.deckQuestions.includes(q)),'concurrent reservations must not overlap');
 const before=JSON.stringify(rotations.get('google'));failNext=true;await assert.rejects(ctx.window.ABGRUND_ACCOUNTS.reserveRotation(planner));assert.equal(JSON.stringify(rotations.get('google')),before);
 console.log('Concurrent reservation retry and offline failure: OK (mock backend)');
 console.log('Guest migration, sync, account isolation, Google/email login and linking: OK (mock backend)');
})().catch(e=>{console.error(e);process.exitCode=1});
