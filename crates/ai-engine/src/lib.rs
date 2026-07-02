use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Debug, Clone)]
pub struct OllamaClient {
    pub endpoint: String,
    pub model: String,
}

impl Default for OllamaClient {
    fn default() -> Self {
        Self {
            endpoint: std::env::var("OLLAMA_URL").unwrap_or_else(|_| "http://127.0.0.1:11434/api/generate".into()),
            model: std::env::var("OLLAMA_MODEL").unwrap_or_else(|_| "qwen2.5-coder:1.5b".into()),
        }
    }
}

#[derive(Debug, Serialize)]
struct OllamaRequest<'a> {
    model: &'a str,
    prompt: &'a str,
    stream: bool,
}

#[derive(Debug, Deserialize)]
struct OllamaResponse {
    response: String,
}

impl OllamaClient {
    pub fn analyze(&self, prompt: &str, context: &Value) -> Result<Value> {
        let composed = format!("{}\n\nContext:\n{}", prompt, serde_json::to_string_pretty(context)?);
        let client = reqwest::blocking::Client::new();
        let response = client
            .post(&self.endpoint)
            .json(&OllamaRequest {
                model: &self.model,
                prompt: &composed,
                stream: false,
            })
            .send()?;
        if !response.status().is_success() {
            return Err(anyhow!("ollama request failed with status {}", response.status()));
        }
        let body: OllamaResponse = response.json()?;
        Ok(json!({ "model": self.model, "output": body.response }))
    }
}
