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
 const report={uid:'alice',question:'Frage',answer:'Antwort',status:'pending',priority:1,createdAt:serverTimestamp()};await assertSucceeds(setDoc(doc(alice,'rejectedAnswers/test'),report));await assertFails(setDoc(doc(alice,'rejectedAnswers/invalid'),{...report,priority:2}));await assertFails(getDoc(doc(bob,'rejectedAnswers/test')));
 console.log('Firestore: mutual-consent friends, revocation, profile privacy, immutable games, metrics validation, priority bounds and code-directory protection: OK (emulator).');
 }finally{await env.cleanup()}
})().catch(e=>{console.error(e);process.exit(1)});
