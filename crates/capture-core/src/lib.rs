use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::BTreeMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureSession {
    pub id: String,
    #[serde(rename = "startedAt")]
    pub started_at: String,
    #[serde(rename = "stoppedAt", default)]
    pub stopped_at: Option<String>,
    pub scope: String,
    #[serde(rename = "sensitiveMode")]
    pub sensitive_mode: bool,
    #[serde(rename = "termsAccepted")]
    pub terms_accepted: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaptureRecord {
    pub id: String,
    #[serde(rename = "sessionId")]
    pub session_id: String,
    pub kind: String,
    pub url: String,
    pub method: String,
    #[serde(default)]
    pub status: Option<u16>,
    #[serde(rename = "requestHeaders", default)]
    pub request_headers: Option<BTreeMap<String, String>>,
    #[serde(rename = "responseHeaders", default)]
    pub response_headers: Option<BTreeMap<String, String>>,
    #[serde(rename = "requestBody", default)]
    pub request_body: Option<String>,
    #[serde(rename = "responseBody", default)]
    pub response_body: Option<String>,
    #[serde(rename = "contentType", default)]
    pub content_type: Option<String>,
    #[serde(rename = "pageUrl", default)]
    pub page_url: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NativeEnvelope {
    pub kind: String,
    pub payload: Value,
}
