use anyhow::Result;
use capture_core::CaptureRecord;
use std::fs;
use std::path::PathBuf;

pub struct Exporter {
    dir: PathBuf,
}

fn csv_escape(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}

impl Exporter {
    pub fn new(dir: PathBuf) -> Result<Self> {
        fs::create_dir_all(&dir)?;
        Ok(Self { dir })
    }

    pub fn export_json(&self, session_id: &str, captures: &[CaptureRecord]) -> Result<String> {
        let path = self.dir.join(format!("{}-captures.json", session_id));
        fs::write(&path, serde_json::to_vec_pretty(captures)?)?;
        Ok(path.display().to_string())
    }

    pub fn export_csv(&self, session_id: &str, captures: &[CaptureRecord]) -> Result<String> {
        let path = self.dir.join(format!("{}-captures.csv", session_id));
        let mut out = String::from("id,session_id,kind,method,status,url,content_type,page_url,created_at\n");
        for c in captures {
            let row = [
                csv_escape(&c.id),
                csv_escape(&c.session_id),
                csv_escape(&c.kind),
                csv_escape(&c.method),
                csv_escape(&c.status.map(|v| v.to_string()).unwrap_or_default()),
                csv_escape(&c.url),
                csv_escape(&c.content_type.clone().unwrap_or_default()),
                csv_escape(&c.page_url.clone().unwrap_or_default()),
                csv_escape(&c.created_at),
            ]
            .join(",");
            out.push_str(&row);
            out.push('\n');
        }
        fs::write(&path, out)?;
        Ok(path.display().to_string())
    }
}
