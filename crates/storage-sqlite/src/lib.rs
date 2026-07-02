use anyhow::Result;
use capture_core::{CaptureRecord, CaptureSession};
use rusqlite::{params, Connection};
use std::collections::BTreeMap;
use std::path::PathBuf;

pub struct SqliteStore {
    conn: Connection,
}

impl SqliteStore {
    pub fn new(path: PathBuf) -> Result<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "
            create table if not exists sessions (
              id text primary key,
              started_at text not null,
              stopped_at text,
              scope text not null,
              sensitive_mode integer not null,
              terms_accepted integer not null
            );
            create table if not exists captures (
              id text primary key,
              session_id text not null,
              kind text not null,
              url text not null,
              method text not null,
              status integer,
              request_headers text,
              response_headers text,
              request_body text,
              response_body text,
              content_type text,
              page_url text,
              created_at text not null
            );
            create index if not exists idx_captures_session on captures(session_id);
            create index if not exists idx_captures_url on captures(url);
            ",
        )?;
        Ok(Self { conn })
    }

    pub fn insert_session(&self, session: &CaptureSession) -> Result<()> {
        self.conn.execute(
            "insert or replace into sessions (id, started_at, stopped_at, scope, sensitive_mode, terms_accepted) values (?, ?, ?, ?, ?, ?)",
            params![
                session.id,
                session.started_at,
                session.stopped_at,
                session.scope,
                session.sensitive_mode as i64,
                session.terms_accepted as i64
            ],
        )?;
        Ok(())
    }

    pub fn stop_session(&self, session_id: &str) -> Result<()> {
        self.conn.execute(
            "update sessions set stopped_at = datetime('now') where id = ?",
            [session_id],
        )?;
        Ok(())
    }

    pub fn insert_capture(&self, capture: &CaptureRecord) -> Result<()> {
        self.conn.execute(
            "insert or replace into captures (id, session_id, kind, url, method, status, request_headers, response_headers, request_body, response_body, content_type, page_url, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                capture.id,
                capture.session_id,
                capture.kind,
                capture.url,
                capture.method,
                capture.status,
                capture.request_headers.as_ref().map(serde_json::to_string).transpose()?,
                capture.response_headers.as_ref().map(serde_json::to_string).transpose()?,
                capture.request_body,
                capture.response_body,
                capture.content_type,
                capture.page_url,
                capture.created_at
            ],
        )?;
        Ok(())
    }

    pub fn list_sessions(&self) -> Result<Vec<CaptureSession>> {
        let mut stmt = self.conn.prepare(
            "select id, started_at, stopped_at, scope, sensitive_mode, terms_accepted from sessions order by started_at desc",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(CaptureSession {
                id: row.get(0)?,
                started_at: row.get(1)?,
                stopped_at: row.get(2)?,
                scope: row.get(3)?,
                sensitive_mode: row.get::<_, i64>(4)? != 0,
                terms_accepted: row.get::<_, i64>(5)? != 0,
            })
        })?;
        Ok(rows.collect::<rusqlite::Result<Vec<_>>>()?)
    }

    pub fn list_captures(&self, session_id: Option<&str>) -> Result<Vec<CaptureRecord>> {
        let sql = if session_id.is_some() {
            "select id, session_id, kind, url, method, status, request_headers, response_headers, request_body, response_body, content_type, page_url, created_at from captures where session_id = ? order by created_at desc limit 500"
        } else {
            "select id, session_id, kind, url, method, status, request_headers, response_headers, request_body, response_body, content_type, page_url, created_at from captures order by created_at desc limit 500"
        };
        let mut stmt = self.conn.prepare(sql)?;
        let map_headers = |raw: Option<String>| -> Option<BTreeMap<String, String>> {
            raw.and_then(|v| serde_json::from_str::<BTreeMap<String, String>>(&v).ok())
        };
        let mapper = |row: &rusqlite::Row| {
            Ok(CaptureRecord {
                id: row.get(0)?,
                session_id: row.get(1)?,
                kind: row.get(2)?,
                url: row.get(3)?,
                method: row.get(4)?,
                status: row.get(5)?,
                request_headers: map_headers(row.get(6)?),
                response_headers: map_headers(row.get(7)?),
                request_body: row.get(8)?,
                response_body: row.get(9)?,
                content_type: row.get(10)?,
                page_url: row.get(11)?,
                created_at: row.get(12)?,
            })
        };
        let rows = if let Some(id) = session_id {
            stmt.query_map([id], mapper)?
        } else {
            stmt.query_map([], mapper)?
        };
        Ok(rows.collect::<rusqlite::Result<Vec<_>>>()?)
    }
}
