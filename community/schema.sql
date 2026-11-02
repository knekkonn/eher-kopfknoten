CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY, uid TEXT NOT NULL, day TEXT NOT NULL, version TEXT NOT NULL, questions TEXT NOT NULL, created INTEGER NOT NULL, completed INTEGER NOT NULL DEFAULT 0, eligible INTEGER NOT NULL DEFAULT 0, score INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS sessions_player_day ON sessions(uid,day,created);
CREATE INDEX IF NOT EXISTS sessions_completed ON sessions(completed,eligible,day);
CREATE TABLE IF NOT EXISTS challenges(round_id TEXT NOT NULL, idx INTEGER NOT NULL, qid TEXT NOT NULL, started INTEGER NOT NULL, answered INTEGER NOT NULL DEFAULT 0, answer_hash TEXT, response_ms INTEGER, baseline INTEGER, score INTEGER NOT NULL DEFAULT 0, eligible INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(round_id,idx));
CREATE TABLE IF NOT EXISTS observations(day TEXT NOT NULL,uid TEXT NOT NULL,qid TEXT NOT NULL,answer_hash TEXT NOT NULL,response_ms INTEGER NOT NULL,baseline INTEGER NOT NULL,PRIMARY KEY(day,uid,qid));
CREATE INDEX IF NOT EXISTS observations_day ON observations(day,qid,answer_hash);
CREATE TABLE IF NOT EXISTS snapshots(day TEXT PRIMARY KEY,ready INTEGER NOT NULL DEFAULT 0,started INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS daily_scores(day TEXT NOT NULL,qid TEXT NOT NULL,answer_hash TEXT NOT NULL,points INTEGER NOT NULL,players INTEGER NOT NULL,samples INTEGER NOT NULL,median_ms INTEGER NOT NULL,PRIMARY KEY(day,qid,answer_hash));
