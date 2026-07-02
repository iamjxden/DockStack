use anyhow::Result;
use capture_core::CaptureRecord;
use duckdb::{params, Connection};
use std::path::PathBuf;

pub struct DuckStore {
    conn: Connection,
}

impl DuckStore {
    pub fn new(path: PathBuf) -> Result<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "
            create table if not exists captures_flat (
              id varchar,
              session_id varchar,
              kind varchar,
              url varchar,
              method varchar,
              status integer,
              content_type varchar,
              page_url varchar,
              created_at varchar,
              response_body varchar
            );
            ",
        )?;
        Ok(Self { conn })
    }

    pub fn materialize_capture(&self, capture: &CaptureRecord) -> Result<()> {
        self.conn.execute(
            "insert into captures_flat values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                capture.id,
                capture.session_id,
                capture.kind,
                capture.url,
                capture.method,
                capture.status.map(|v| v as i64),
                capture.content_type,
                capture.page_url,
                capture.created_at,
                capture.response_body
            ],
        )?;
        Ok(())
    }
}
