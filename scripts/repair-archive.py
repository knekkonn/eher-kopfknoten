"""Rebuild the damaged Dive 110 from a separately downloaded dated source page."""
import gzip, json, re, sys, zlib
from pathlib import Path
source=Path(sys.argv[1]).read_text()
data=json.loads(re.search(r'<script type="application/json" id="krilling-practice-data">(.*?)</script>',source,re.S)[1])
assert data['date']=='2026-11-02' and data['dayNumber']==110
path=Path('archive-data/dive-110.json.gz')
# Salvage intact JSON rows before the damaged part of the old stream.
d=zlib.decompressobj(31);out=b''
for offset in range(0,len(path.read_bytes()),256):
 try:out+=d.decompress(path.read_bytes()[offset:offset+256])
 except zlib.error:break
text=out.decode('utf-8',errors='ignore');salvaged={};decoder=json.JSONDecoder()
for match in re.finditer(r'\["',text):
 try:
  row,_=decoder.raw_decode(text,match.start())
  if isinstance(row,list) and len(row) in (2,3) and isinstance(row[0],str) and isinstance(row[1],int) and row[1] in [10,15,30,60,85,100]:salvaged[row[0]]=row
 except (ValueError,TypeError):pass
manifest=json.loads(Path('archive-manifest.json').read_text());records=[]
for prompt in data['prompts']:
 ident='d110-'+prompt['id'];meta=next((x for x in manifest if x['id']==ident),None)
 if not meta:continue
 rows=[];seen=set()
 for answer in prompt['answers']:
  name=answer['answer'];score=answer['score']
  if name in seen:continue
  seen.add(name);old=salvaged.get(name)
  rows.append([name,score]+([old[2]] if old and len(old)==3 else []))
 records.append({'id':ident,'date':data['date'],'rows':rows});meta['count']=len(rows)
path.write_bytes(gzip.compress(json.dumps(records,ensure_ascii=False,separators=(',',':')).encode(),mtime=0))
Path('archive-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
report=json.loads(Path('archive-import-report.json').read_text());report['importedAnswerRows']=sum(x['count'] for x in manifest)
report['repair']={'date':'2026-11-04','dive':110,'source':'https://krilliongame.com/krillion-answers/2026-11-02/','reason':'invalid deflate stream','salvagedRows':len(salvaged),'note':'Source refreshed; intact aliases retained. Original German-alias count is historical.'}
Path('archive-import-report.json').write_text(json.dumps(report,ensure_ascii=False,separators=(',',':')))
print('Rebuilt',sum(len(x['rows']) for x in records),'rows; total',report['importedAnswerRows'])
