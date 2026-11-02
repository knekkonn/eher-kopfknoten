import sqlite3,json,sys
con=sqlite3.connect(sys.argv[1]);con.row_factory=sqlite3.Row;items=json.load(sys.stdin);result=[]
try:
 with con:
  for item in items:
   cur=con.execute(item['sql'],item.get('params',[]));rows=[dict(x) for x in cur.fetchall()] if cur.description else [];result.append({'results':rows,'success':True,'meta':{'changes':cur.rowcount if cur.rowcount>=0 else 0}})
 print(json.dumps(result))
finally:con.close()
