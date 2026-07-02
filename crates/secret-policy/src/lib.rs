use capture_core::CaptureRecord;

const SENSITIVE_HEADERS: &[&str] = &[
    "authorization",
    "cookie",
    "set-cookie",
    "x-csrf-token",
    "x-xsrf-token",
    "csrf-token",
];

pub fn mask_capture(capture: &CaptureRecord) -> CaptureRecord {
    let mut sanitized = capture.clone();
    if let Some(headers) = sanitized.request_headers.as_mut() {
        for (k, v) in headers.iter_mut() {
            if SENSITIVE_HEADERS.contains(&k.to_lowercase().as_str()) {
                *v = "***masked***".into();
            }
        }
    }
    if let Some(headers) = sanitized.response_headers.as_mut() {
        for (k, v) in headers.iter_mut() {
            if SENSITIVE_HEADERS.contains(&k.to_lowercase().as_str()) {
                *v = "***masked***".into();
            }
        }
    }
    sanitized
}
