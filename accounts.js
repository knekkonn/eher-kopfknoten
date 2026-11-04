/* Optional Firebase accounts. Local guest play works without a configuration. */
(()=>{
'use strict';
const cfg=window.ABGRUND_FIREBASE_CONFIG;
const trigger=document.getElementById('accountButton');
if(!trigger||!cfg?.apiKey||!cfg?.authDomain||!cfg?.projectId||!cfg?.appId)return;
trigger.hidden=false;
const box=document.createElement('div');box.className='account-backdrop';box.hidden=true;
box.innerHTML=`<section class="account-card" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
 <h2 id="accountTitle">DEIN KONTO</h2><p>Speichere deine Ergebnisse und deinen Durchschnitt auf allen Geräten.</p>
 <div id="accountSignedOut"><div class="account-actions"><button id="accountGoogle" type="button">MIT GOOGLE ANMELDEN</button></div>
 <label for="accountEmail">E-MAIL</label><input id="accountEmail" type="email" autocomplete="email" inputmode="email">
 <label for="accountPassword">PASSWORT</label><input id="accountPassword" type="password" autocomplete="current-password">
 <div class="account-actions"><div class="account-row"><button id="accountLogin" type="button">ANMELDEN</button><button id="accountRegister" type="button">REGISTRIEREN</button></div><button id="accountReset" type="button">PASSWORT ZURÜCKSETZEN</button></div></div>
 <div id="accountSignedIn" hidden><p class="account-user" id="accountUser"></p><p id="accountSync"></p><div class="account-actions"><button id="accountRetry" type="button">SYNCHRONISIERUNG ERNEUT VERSUCHEN</button><button id="accountLinkGoogle" type="button">GOOGLE-KONTO VERBINDEN</button></div>
 <div id="accountPasswordLink"><label for="accountNewPassword">PASSWORT FÜR E-MAIL-ANMELDUNG</label><input id="accountNewPassword" type="password" autocomplete="new-password"><div class="account-actions"><button id="accountLinkPassword" type="button">E-MAIL-ANMELDUNG HINZUFÜGEN</button></div></div>
 <div class="account-actions"><button id="accountVerify" type="button">E-MAIL BESTÄTIGEN</button><button id="accountLogout" type="button">ABMELDEN</button></div></div>
 <p class="account-status" id="accountStatus" role="status" aria-live="polite"></p><div class="account-actions"><button id="accountClose" type="button">SCHLIESSEN</button></div>
 </section>`;
document.body.appendChild(box);
const $=id=>document.getElementById(id),status=message=>{$('accountStatus').textContent=message};
trigger.onclick=()=>{box.hidden=false;status('');$('accountClose').focus()};
$('accountClose').onclick=()=>{box.hidden=true;trigger.focus()};
box.addEventListener('click',event=>{if(event.target===box)box.hidden=true});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!box.hidden){box.hidden=true;trigger.focus()}});
const errorText=error=>({
 'auth/invalid-credential':'E-Mail oder Passwort ist falsch.','auth/invalid-email':'Bitte gib eine gültige E-Mail-Adresse ein.',
 'auth/email-already-in-use':'Für diese E-Mail gibt es bereits ein Konto. Melde dich an und verbinde dort die andere Anmeldemethode.',
 'auth/weak-password':'Das Passwort ist zu schwach. Wähle ein längeres Passwort.',
 'auth/popup-blocked':'Das Anmeldefenster wurde blockiert. Erlaube Pop-ups und versuche es erneut.',
 'auth/popup-closed-by-user':'Das Google-Anmeldefenster wurde geschlossen.',
 'auth/credential-already-in-use':'Diese Anmeldung ist bereits mit einem anderen Konto verbunden.',
 'auth/account-exists-with-different-credential':'Für diese E-Mail gibt es bereits ein Konto. Melde dich zuerst damit an und verbinde dann Google.',
 'auth/network-request-failed':'Keine Verbindung. Bitte prüfe dein Internet.',
 'auth/too-many-requests':'Zu viele Versuche. Bitte versuche es später erneut.',
 'permission-denied':'Die Speicherung ist noch nicht richtig eingerichtet.'
}[error?.code]||'Das hat nicht geklappt. Bitte prüfe deine Verbindung und versuche es erneut.');
let auth,api,db,unlisten=()=>{},restartSync=()=>{},epoch=0,pending=new Set(),failed=new Set(),serverIds=new Set(),serverReady=false;
const user=()=>auth?.currentUser||null;
function render(){
 const u=user(),signed=!!u;trigger.textContent=signed?'◎ KONTO':'◎ ANMELDEN';
 $('accountSignedOut').hidden=signed;$('accountSignedIn').hidden=!signed;
 if(!u)return;
 $('accountVerify').hidden=!!u.emailVerified||!u.email;
 $('accountUser').textContent=u.email||u.displayName||'Angemeldet';
 const providers=new Set(u.providerData.map(p=>p.providerId));
 $('accountLinkGoogle').hidden=providers.has('google.com');
 $('accountPasswordLink').hidden=providers.has('password')||!u.email;
}
async function syncPending(){
 const u=user();if(!u||!serverReady)return;
 const uid=u.uid,myEpoch=epoch,items=window.ABGRUND_HISTORY.list();
 for(const item of items){
  if(user()?.uid!==uid||epoch!==myEpoch)return;
  if(serverIds.has(item.id)||pending.has(item.id)||failed.has(item.id))continue;
  pending.add(item.id);
  const payload={score:item.score};if(/^\d{4}-\d{2}-\d{2}$/.test(item.day))payload.day=item.day;
  api.setDoc(api.doc(db,'users',uid,'games',item.id),payload).then(()=>{
   if(epoch!==myEpoch)return;pending.delete(item.id);serverIds.add(item.id);if(!pending.size&&!failed.size)$('accountSync').textContent='Deine Ergebnisse sind synchronisiert.';
  }).catch(error=>{if(epoch!==myEpoch)return;pending.delete(item.id);failed.add(item.id);$('accountSync').textContent='Noch lokal gespeichert. Bitte Synchronisierung erneut versuchen.';console.warn('Account sync:',error.code||'unavailable')});
 }
}
let rotationReady=Promise.resolve();let rotationRevision=0;
window.ABGRUND_ACCOUNTS={identity:()=>user()?.uid||null,waitRotation:()=>rotationReady,onRotationChanged:state=>{const u=user();if(!u||!db||!api)return;api.setDoc(api.doc(db,'users',u.uid,'profile','rotation'),{round:state.round,order:state.order.slice(-2000),last:state.last},{merge:false}).catch(e=>console.warn('Rotation sync:',e.code||e.message))},getToken:async()=>user()?.getIdToken?user().getIdToken():null,onLocalGame:()=>{if(user()){serverReady&&($('accountSync').textContent='Ergebnisse werden synchronisiert …');syncPending()}}};
async function start(){
 try{
  const [appMod,authMod,fireMod]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')]);
  api={...authMod,...fireMod};const app=appMod.initializeApp(cfg);auth=api.getAuth(app);db=api.getFirestore(app,window.ABGRUND_FIRESTORE_DATABASE||'(default)');
  const perform=async fn=>{status('');try{await fn();$('accountPassword').value='';$('accountNewPassword').value='';render()}catch(error){status(errorText(error))}};
  $('accountGoogle').onclick=()=>perform(()=>api.signInWithPopup(auth,new api.GoogleAuthProvider()));
  $('accountLogin').onclick=()=>perform(()=>api.signInWithEmailAndPassword(auth,$('accountEmail').value.trim(),$('accountPassword').value));
  $('accountRegister').onclick=()=>perform(()=>api.createUserWithEmailAndPassword(auth,$('accountEmail').value.trim(),$('accountPassword').value));
  $('accountReset').onclick=()=>perform(async()=>{await api.sendPasswordResetEmail(auth,$('accountEmail').value.trim());status('Wenn ein Konto existiert, wurde eine E-Mail zum Zurücksetzen versendet.')});
  $('accountVerify').onclick=()=>perform(async()=>{await api.sendEmailVerification(user());status('Bestätigungslink versendet. Öffne ihn und melde dich danach erneut an, damit deine Runden zur Community zählen.')});
  $('accountLogout').onclick=()=>perform(()=>api.signOut(auth));
  $('accountRetry').onclick=()=>{failed.clear();if(serverReady)syncPending();else restartSync()};
  $('accountLinkGoogle').onclick=()=>perform(()=>api.linkWithPopup(user(),new api.GoogleAuthProvider()));
  $('accountLinkPassword').onclick=()=>perform(()=>api.linkWithCredential(user(),api.EmailAuthProvider.credential(user().email,$('accountNewPassword').value)));
  api.onAuthStateChanged(auth,u=>{
   epoch++;const myEpoch=epoch;unlisten();unlisten=()=>{};restartSync=()=>{};pending=new Set();failed=new Set();serverIds=new Set();serverReady=false;
   window.ABGRUND_HISTORY.select(u?.uid||'guest');render();window.dispatchEvent(new CustomEvent('abgrund-auth',{detail:{uid:u?.uid||null}}));
   if(!u){rotationReady=Promise.resolve();return;}
   const rotationId=++rotationRevision;rotationReady=api.getDoc(api.doc(db,'users',u.uid,'profile','rotation')).then(snapshot=>{if(rotationRevision!==rotationId||user()?.uid!==u.uid)return;const remote=snapshot.data();if(!remote||!Array.isArray(remote.order))return;const key='abgrundRotationV2:'+u.uid;let local;try{local=JSON.parse(localStorage.getItem(key)||'null')}catch{}if(!local||Number(remote.round)>Number(local.round))localStorage.setItem(key,JSON.stringify(remote))}).catch(e=>console.warn('Rotation load:',e.code||e.message));
   try{window.ABGRUND_HISTORY.migrateGuest()}catch{status('Gastspiele konnten nicht übernommen werden. Bitte schaffe Speicherplatz und melde dich erneut an.');return}
   $('accountSync').textContent='Deine Ergebnisse werden geladen …';
   restartSync=()=>{unlisten();unlisten=api.onSnapshot(api.collection(db,'users',u.uid,'games'),{includeMetadataChanges:true},snapshot=>{
    if(epoch!==myEpoch||user()?.uid!==u.uid)return;
    const rows=snapshot.docs.map(doc=>({id:doc.id,score:doc.data().score,day:doc.data().day}));
    if(!snapshot.metadata.fromCache){serverIds=new Set(rows.filter((_,i)=>!snapshot.docs[i].metadata.hasPendingWrites).map(x=>x.id));serverReady=true}
    try{window.ABGRUND_HISTORY.mergeRemote(rows);window.ABGRUND_HISTORY.refresh()}catch{status('Ergebnisse konnten auf diesem Gerät nicht gespeichert werden.')}
    $('accountSync').textContent=snapshot.metadata.fromCache?'Offline: Ergebnisse bleiben auf diesem Gerät gespeichert.':'Ergebnisse werden synchronisiert …';
    syncPending();
    if(serverReady&&pending.size===0&&failed.size===0)$('accountSync').textContent='Deine Ergebnisse sind synchronisiert.';
   },error=>{if(epoch===myEpoch){serverReady=false;$('accountSync').textContent='Synchronisierung fehlgeschlagen. Ergebnisse bleiben lokal gespeichert.';status(errorText(error))}})};
   restartSync();
  });
  window.addEventListener('online',()=>{failed.clear();if(serverReady)syncPending();else if(user())restartSync()});render();
 }catch(error){status('Die Anmeldung konnte nicht geladen werden. Bitte prüfe deine Internetverbindung.');console.warn('Account setup unavailable:',error.code||'network')}
}
start();
})();
