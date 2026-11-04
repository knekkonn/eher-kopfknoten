const {spawnSync}=require('node:child_process');
const {readdirSync}=require('node:fs');
for(const file of readdirSync('tests').filter(x=>x.endsWith('.cjs'))){
 const result=spawnSync(process.execPath,['tests/'+file],{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
