// Read-only daily triage. User text is data and is never executed or sent to an AI.
import {createHash} from 'node:crypto';
import engine from './game-engine.cjs';
import {writeFileSync} from 'node:fs';
const project='krillion-d74e1',database='abgrund';
const token=process.env.FIREBASE_REVIEW_TOKEN;
if(!token)throw Error('Daily review requires a short-lived Google access token with datastore.viewer access. No review was performed.');
await engine.ready;
const questions=engine.run('bank'),normalize=engine.run('normalizeFactText'),verify=engine.run('verifyFact');
const byQuestion=new Map(questions.map(q=>[normalize(q.q),q]));
let recognized=0,needsHumanReview=0,notChecked=0;
const base=`https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents`;
let pageToken='',scanned=0,pending=0;const groups=new Map();
do{
 const url=new URL(base+'/rejectedAnswers');url.searchParams.set('pageSize','300');if(pageToken)url.searchParams.set('pageToken',pageToken);
 const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(`Review read failed (${response.status}); no data changed.`);
 const data=await response.json();
 for(const document of data.documents||[]){
  scanned++;const f=document.fields||{};if(f.status?.stringValue!=='pending')continue;pending++;
  const question=f.question?.stringValue,answer=f.answer?.stringValue;
  if(typeof question!=='string'||typeof answer!=='string'||question.length>250||answer.length>180)continue;
  const key=createHash('sha256').update(JSON.stringify([question,answer.toLocaleLowerCase('de-DE').trim()])).digest('hex');
  const group=groups.get(key);if(group)group.count++;else groups.set(key,{question,answer,count:1});
 }
 pageToken=data.nextPageToken||'';
 if(scanned>100000)throw Error('Review safety limit exceeded; use a server-side pending query before increasing the limit.');
}while(pageToken);
// Rotate the bounded sample daily so a large queue does not permanently starve later records.
const day=new Date().toISOString().slice(0,10);
const selected=[...groups.entries()].sort(([a],[b])=>{
 const rank=id=>createHash('sha256').update(day+id).digest('hex');return rank(a).localeCompare(rank(b));
}).slice(0,200);
for(const [,group] of selected){
 const q=byQuestion.get(normalize(group.question));
 if(q){await engine.ctx.window.ABGRUND_ARCHIVE.loadQuestion(q);if(verify(q,group.answer))recognized++;else needsHumanReview++}
 else needsHumanReview++;
}
notChecked=groups.size-selected.length;
// No UIDs, submitted text or tokens in public logs/artifacts.
const report={checkedAt:new Date().toISOString(),project,database,scanned,pending,uniquePending:groups.size,recognized,needsHumanReview,notChecked,duplicates:pending-groups.size,mode:'read-only-human-approval-required'};
writeFileSync(process.env.REVIEW_OUTPUT||'review-summary.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
