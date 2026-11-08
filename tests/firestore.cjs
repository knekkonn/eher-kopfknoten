if(!process.env.FIRESTORE_EMULATOR_HOST){console.log('Firestore authorization tests require the separate emulator job.');process.exit(0)}
const fs=require('node:fs'),assert=require('node:assert/strict'),{createRequire}=require('node:module');
const req=process.env.FIREBASE_TEST_MODULE_ROOT?createRequire(process.env.FIREBASE_TEST_MODULE_ROOT+'/package.json'):require;
const {initializeTestEnvironment,assertFails,assertSucceeds}=req('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,writeBatch,updateDoc,deleteDoc,serverTimestamp}=req('firebase/firestore');
(async()=>{
 const env=await initializeTestEnvironment({projectId:'demo-abgrund',firestore:{rules:fs.readFileSync('firestore.rules','utf8')}});
 try{
 const db=uid=>env.authenticatedContext(uid).firestore(),alice=db('alice'),bob=db('bob'),eve=db('eve'),guest=env.unauthenticatedContext().firestore();
 async function identity(db,uid,code,name){const b=writeBatch(db);b.set(doc(db,'users',uid,'profile','social'),{code,nickname:name});b.set(doc(db,'friendCodes',code),{uid});await assertSucceeds(b.commit())}
 await assertSucceeds(setDoc(doc(alice,'users/alice/profile/rotation'),{round:1,order:['known'],last:{known:1}}));await assertFails(setDoc(doc(alice,'users/alice/profile/rotation'),{round:2,order:[123],last:{'123':2}}));await assertFails(setDoc(doc(alice,'users/alice/profile/rotation'),{round:2,order:[{x:1}],last:{known:2}}));
 await identity(alice,'alice','a'.repeat(32),'Alice');await identity(bob,'bob','b'.repeat(32),'Bob');
 await assertFails(setDoc(doc(eve,'friendCodes','c'.repeat(32)),{uid:'alice'}));await assertFails(getDocs(collection(alice,'friendCodes')));await assertFails(getDoc(doc(guest,'friendCodes','a'.repeat(32))));
 await assertSucceeds(getDoc(doc(alice,'friendCodes','b'.repeat(32))));await assertFails(updateDoc(doc(alice,'users/alice/profile/social'),{code:'c'.repeat(32)}));
 const stats={nickname:'Bob',rounds:1,totalPoints:100,best:100,metricsRounds:1,answered:5,skipped:1,timeouts:1,measured:4,responseMs:20000,fastestMs:1000,slowestMs:8000,reports:1,failed:2,quick:1,rare:1,full:1,perfectRounds:0,recent:[100],updatedAt:serverTimestamp()};
 await assertSucceeds(setDoc(doc(bob,'users/bob/profile/stats'),stats));await assertSucceeds(setDoc(doc(alice,'users/alice/profile/stats'),{...stats,nickname:'Alice'}));
 await assertFails(getDoc(doc(alice,'users/bob/profile/stats')));await assertFails(getDoc(doc(eve,'users/bob/profile/stats')));await assertFails(getDoc(doc(guest,'users/bob/profile/stats')));
 await assertFails(setDoc(doc(eve,'users/bob/profile/stats'),stats));await assertFails(setDoc(doc(bob,'users/bob/profile/stats'),{...stats,isAdmin:true}));await assertFails(setDoc(doc(bob,'users/bob/profile/stats'),{...stats,recent:['100']}));
 const relation={from:'alice',to:'bob',fromName:'Alice',status:'pending',createdAt:serverTimestamp()};
 const pair=(db,data)=>{const b=writeBatch(db);b.set(doc(db,'users/alice/friends/bob'),data);b.set(doc(db,'users/bob/friends/alice'),data);return b.commit()};
 await assertFails(setDoc(doc(alice,'users/alice/friends/bob'),relation));await assertFails(pair(alice,{...relation,status:'accepted'}));await assertSucceeds(pair(alice,relation));
 await assertFails(getDoc(doc(alice,'users/bob/profile/stats')));
 const accept=db=>{const b=writeBatch(db);b.update(doc(db,'users/alice/friends/bob'),{status:'accepted'});b.update(doc(db,'users/bob/friends/alice'),{status:'accepted'});return b.commit()};
 await assertFails(accept(alice));await assertFails(updateDoc(doc(bob,'users/bob/friends/alice'),{status:'accepted'}));await assertSucceeds(accept(bob));
 await assertSucceeds(getDoc(doc(alice,'users/bob/profile/stats')));await assertSucceeds(getDoc(doc(bob,'users/alice/profile/stats')));await assertFails(getDoc(doc(eve,'users/bob/profile/stats')));await assertFails(getDoc(doc(alice,'users/bob/games/anything')));
 await assertSucceeds(deleteDoc(doc(alice,'users/alice/friends/bob')));await assertFails(getDoc(doc(alice,'users/bob/profile/stats')));await assertFails(getDoc(doc(bob,'users/alice/profile/stats')));
 const metrics={answered:5,skipped:1,timeouts:1,measured:4,responseMs:20000,fastestMs:1000,slowestMs:8000,reports:1,failed:2,quick:1,rare:1,full:1};
 await assertSucceeds(setDoc(doc(alice,'users/alice/games/test'),{score:100,metrics}));await assertFails(updateDoc(doc(alice,'users/alice/games/test'),{score:200}));await assertFails(setDoc(doc(alice,'users/alice/games/invalid'),{score:100,metrics:{...metrics,answered:7}}));
 await assertFails(setDoc(doc(eve,'users/alice/games/other'),{score:100}));
 const report={uid:'alice',question:'Frage',answer:'Antwort',status:'pending',priority:1,createdAt:serverTimestamp()},today=Math.floor(Date.now()/86400000),quotaRef=doc(alice,'users/alice/limits/reports');
 const send=(count,priority=1,extra={},day=today)=>{const id=count.toString(16).padStart(32,'0'),b=writeBatch(alice);b.set(quotaRef,{day,count,last:id});b.set(doc(alice,'rejectedAnswers','alice_'+id),{...report,priority,...extra});return b.commit()};
 await assertFails(setDoc(doc(alice,'rejectedAnswers/test'),report));
 await assertFails(setDoc(quotaRef,{day:today,count:1,last:'a'.repeat(32)}));
 await assertFails(send(1,2));await assertFails(send(1,1,{uid:'bob'}));await assertFails(send(1,1,{answer:'x'.repeat(181)}));await assertFails(send(1,1,{status:'approved'}));await assertFails(send(1,1,{},today+1));
 await assertSucceeds(send(1));const first=doc(alice,'rejectedAnswers','alice_'+'1'.padStart(32,'0'));
 await assertSucceeds(getDoc(first));await assertFails(getDoc(doc(bob,first.path)));await assertFails(getDocs(collection(alice,'rejectedAnswers')));await assertFails(updateDoc(first,{priority:0}));await assertFails(deleteDoc(first));
 await assertFails(send(1));await assertFails(send(3));await assertFails(deleteDoc(quotaRef));await assertFails(setDoc(doc(bob,'users/alice/limits/reports'),{day:today,count:2,last:'a'.repeat(32)}));
 for(let i=2;i<=80;i++)await assertSucceeds(send(i,0));
 await assertFails(send(81,0));for(let i=81;i<=100;i++)await assertSucceeds(send(i,1));await assertFails(send(101,1));
 await assertFails(setDoc(quotaRef,{day:today,count:0,last:'a'.repeat(32)}));
 // Only a real new UTC day can reset the counter; seed yesterday with admin privileges.
 await env.withSecurityRulesDisabled(async context=>setDoc(doc(context.firestore(),'users/alice/limits/reports'),{day:today-1,count:100,last:'f'.repeat(32)}));
 const reset=writeBatch(alice);reset.set(quotaRef,{day:today,count:1,last:'e'.repeat(32)});reset.set(doc(alice,'rejectedAnswers','alice_'+'e'.repeat(32)),report);await assertSucceeds(reset.commit());
 console.log('Firestore: private mutually accepted profiles, immutable games, bounded fields, and atomic 80 automatic / 100 total daily reports; no bypass, replay, quota reset or cross-user access: OK (emulator).');
 }finally{await env.cleanup()}
})().catch(e=>{console.error(e);process.exit(1)});
