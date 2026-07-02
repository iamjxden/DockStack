use anyhow::Result;
use capture_core::CaptureRecord;
use std::fs;
use std::path::PathBuf;

pub struct Exporter {
    dir: PathBuf,
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
        let mut out = String::from("id,session_id,kind,method,status,url,content_type,page_url,created_at
");
        for c in captures {
            out.push_str(&format!(
                ""{}","{}","{}","{}","{}","{}","{}","{}","{}"
",
                c.id,
                c.session_id,
                c.kind,
                c.method,
                c.status.map(|v| v.to_string()).unwrap_or_default(),
                c.url.replace('"', "''"),
                c.content_type.clone().unwrap_or_default().replace('"', "''"),
                c.page_url.clone().unwrap_or_default().replace('"', "''"),
                c.created_at
            ));
        }
        fs::write(&path, out)?;
        Ok(path.display().to_string())
    }
}
