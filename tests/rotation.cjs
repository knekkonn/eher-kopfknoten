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


for(const q of run('bank')){assert(q.q&&q.answers?.length,'base question must have local answers: '+q.q)}
const unique=run('new Set(bank.map(questionIdentity)).size');
let state,seen=new Set(),boundary=false;
for(let r=0;r<Math.ceil(unique*2/7);r++){
 ctx.state=state;const result=run('planSession(state,"alice")');state=result.state;
 assert.equal(result.session.deckQuestions.length,7);
 assert.equal(new Set(result.session.deckQuestions).size,7);
 for(const question of result.session.deckQuestions){
  ctx.question=question;const id=run('normalizeFactText(question)');
  if(seen.size===unique){seen.clear();boundary=true}
  assert(!seen.has(id),'repeat before exhausting cycle: '+question);seen.add(id);
 }
}
assert(boundary,'exercise partial final batch across cycle boundary');
ctx.q={q:'Nenne einen Schauspieler.',answers:['Leonardo DiCaprio','Johnny Depp'],answerAliases:{}};
assert.equal(run("suggestCompletion(q,'Johnny')"),'');
assert.equal(run("suggestCompletion(q,'Leonardo di')"),'Leonardo DiCaprio');
assert.equal(run("verifyFact(q,'Johnny')"),false);
console.log('Rotation: two complete cycles without early repeats; proper-name suggestions: OK');
