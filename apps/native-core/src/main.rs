use anyhow::Result;
use capture_core::{CaptureRecord, CaptureSession, NativeEnvelope};
use serde_json::json;
use std::fs;
use std::io::{Read, Write};
use std::path::PathBuf;
use tracing_subscriber::EnvFilter;

fn read_message() -> Result<Option<NativeEnvelope>> {
    let mut stdin = std::io::stdin();
    let mut len_buf = [0u8; 4];
    if stdin.read_exact(&mut len_buf).is_err() {
        return Ok(None);
    }
    let len = u32::from_ne_bytes(len_buf) as usize;
    let mut buf = vec![0u8; len];
    stdin.read_exact(&mut buf)?;
    let msg = serde_json::from_slice::<NativeEnvelope>(&buf)?;
    Ok(Some(msg))
}

fn write_message(value: serde_json::Value) -> Result<()> {
    let mut stdout = std::io::stdout();
    let payload = serde_json::to_vec(&value)?;
    stdout.write_all(&(payload.len() as u32).to_ne_bytes())?;
    stdout.write_all(&payload)?;
    stdout.flush()?;
    Ok(())
}

fn main() -> Result<()> {
    tracing_subscriber::fmt().with_env_filter(EnvFilter::from_default_env()).with_writer(std::io::stderr).init();

    let runtime_dir = PathBuf::from("apps/native-core/runtime");
    let data_dir = PathBuf::from("apps/native-core/data");
    fs::create_dir_all(&runtime_dir)?;
    fs::create_dir_all(&data_dir)?;

    let sqlite = storage_sqlite::SqliteStore::new(data_dir.join("dockstack.sqlite3"))?;
    let duck = storage_duckdb::DuckStore::new(data_dir.join("dockstack.duckdb"))?;
    let exporter = export_engine::Exporter::new(data_dir.join("exports"))?;
    let ollama = ai_engine::OllamaClient::default();

    while let Some(message) = read_message()? {
        let response = match message.kind.as_str() {
            "ping" => json!({ "ok": true, "data": { "service": "dockstack-core" } }),
            "start_session" => {
                let session: CaptureSession = serde_json::from_value(message.payload)?;
                sqlite.insert_session(&session)?;
                json!({ "ok": true, "data": session })
            }
            "stop_session" => {
                let session_id = message.payload.get("sessionId").and_then(|v| v.as_str()).unwrap_or_default();
                sqlite.stop_session(session_id)?;
                json!({ "ok": true })
            }
            "ingest_capture" => {
                let capture: CaptureRecord = serde_json::from_value(message.payload)?;
                let sanitized = secret_policy::mask_capture(&capture);
                sqlite.insert_capture(&sanitized)?;
                duck.materialize_capture(&sanitized)?;
                json!({ "ok": true })
            }
            "list_sessions" => json!({ "ok": true, "data": sqlite.list_sessions()? }),
            "list_captures" => {
                let session_id = message.payload.get("sessionId").and_then(|v| v.as_str());
                json!({ "ok": true, "data": sqlite.list_captures(session_id)? })
            }
            "export_session" => {
                let session_id = message.payload.get("sessionId").and_then(|v| v.as_str()).unwrap_or_default();
                let format = message.payload.get("format").and_then(|v| v.as_str()).unwrap_or("json");
                let captures = sqlite.list_captures(Some(session_id))?;
                let path = if format == "csv" { exporter.export_csv(session_id, &captures)? } else { exporter.export_json(session_id, &captures)? };
                json!({ "ok": true, "data": { "path": path } })
            }
            "ollama_analyze" => {
                let prompt = message.payload.get("prompt").and_then(|v| v.as_str()).unwrap_or_default();
                let context = message.payload.get("context").cloned().unwrap_or(json!({}));
                let output = ollama.analyze(prompt, &context);
                json!({ "ok": output.is_ok(), "data": output.ok(), "error": output.err().map(|e| e.to_string()) })
            }
            _ => json!({ "ok": false, "error": "unknown message kind" }),
        };
        write_message(response)?;
    }

    Ok(())
}
