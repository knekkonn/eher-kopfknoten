const {spawnSync}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'abgrund-review-')),preload=path.join(dir,'fixture.mjs'),output=path.join(dir,'summary.json');
try{
 fs.writeFileSync(preload,`
 const entry=(question,answer,status='pending')=>({fields:{uid:{stringValue:'PRIVATE_USER'},question:{stringValue:question},answer:{stringValue:answer},status:{stringValue:status}}});
 globalThis.fetch=async(url,options)=>{
  if(!String(url).startsWith('https://firestore.googleapis.com/'))throw Error('Unexpected network');
  if(options.headers.Authorization!=='Bearer fixture')throw Error('Wrong token');
  if(process.env.REVIEW_PRIORITY_TEST){
   const {createHash}=await import('node:crypto'),q='Nenne einen griechischen Gott oder eine griechische Göttin.',day=new Date().toISOString().slice(0,10),hash=s=>createHash('sha256').update(s).digest('hex');
   const rank=a=>hash(day+hash(JSON.stringify([q,a.toLocaleLowerCase('de-DE').trim()]))),limit=rank('Hermes'),documents=[];
   for(let i=0;documents.length<205&&i<100000;i++)if(rank('Unknown-'+i)<limit)documents.push(entry(q,'Unknown-'+i));
   if(documents.length<205)throw Error('Fixture generation failed');const manual=entry(q,'Hermes');manual.fields.priority={integerValue:'1'};documents.push(manual);return Response.json({documents});
  }
  return Response.json({documents:[entry('Nenne einen griechischen Gott oder eine griechische Göttin.','Hermes'),entry('Nenne einen griechischen Gott oder eine griechische Göttin.','Hermes'),entry('Nenne einen griechischen Gott oder eine griechische Göttin.','PRIVATE_ANSWER_<script>alert(1)</script>'),entry('Unknown question','PRIVATE_ANSWER'),entry('Nenne einen griechischen Gott oder eine griechische Göttin.','constructor'),entry('ignored','ignored','approved')]});
 };
 `);
 const result=spawnSync(process.execPath,['--import',preload,'scripts/review-rejected.mjs'],{env:{...process.env,FIREBASE_REVIEW_TOKEN:'fixture',REVIEW_OUTPUT:output},encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);const report=JSON.parse(fs.readFileSync(output));
 assert.equal(report.scanned,6);assert.equal(report.pending,5);assert.equal(report.uniquePending,4);assert.equal(report.duplicates,1);assert.equal(report.recognized,1);assert.equal(report.needsHumanReview,3);
 assert(!result.stdout.includes('PRIVATE_'));assert(!fs.readFileSync(output,'utf8').includes('PRIVATE_'));
 const prioritized=spawnSync(process.execPath,['--import',preload,'scripts/review-rejected.mjs'],{env:{...process.env,FIREBASE_REVIEW_TOKEN:'fixture',REVIEW_OUTPUT:output,REVIEW_PRIORITY_TEST:'1'},encoding:'utf8'});assert.equal(prioritized.status,0,prioritized.stderr);const capacity=JSON.parse(fs.readFileSync(output));assert.equal(capacity.prioritized,1);assert.equal(capacity.recognized,1,'explicit known report must be included before a full automatic queue');assert.equal(capacity.notChecked,6);
 const missing=spawnSync(process.execPath,['scripts/review-rejected.mjs'],{env:{...process.env,FIREBASE_REVIEW_TOKEN:'',REVIEW_OUTPUT:output},encoding:'utf8'});assert.notEqual(missing.status,0);
 console.log('Daily reviewer: exact local recognition, deduplication, untrusted text, private-output filtering, missing credentials fail closed: OK (mock REST).');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
