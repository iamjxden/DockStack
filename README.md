<div align="center">
  <img src="assets/header.svg" alt="DockStack header" width="100%" />
</div>

# DockStack

**DockStack** is a local-first browser data workspace built for serious capture, inspection, extraction, and export workflows.

It combines a **WXT + React + TypeScript extension**, a **Rust native core**, **SQLite** for operational storage, **DuckDB** for analytics and extraction tables, and **local AI hooks** for **Ollama / llama.cpp**.

> Goal: capture what sites actually load, store it safely, analyze it locally, and export useful datasets without depending on paid cloud APIs.

---

## Why DockStack exists

Most scraping tools focus only on HTML and selectors. DockStack is designed around a stronger idea:

- capture the **real network activity** modern apps use
- inspect **rendered page state** where needed
- keep data **local-first**
- make extraction **repeatable**
- support **sensitive-mode controls** instead of pretending secrets do not exist

DockStack is meant to become a serious developer and analyst tool, not a toy popup.

---

## Core capabilities in this repository

### Capture
- page-level `fetch` interception
- page-level `XMLHttpRequest` interception
- session-based capture workflow
- current-tab / domain / workspace capture scopes
- local background pipeline for ingesting records
- extension-native staging of recent captures

### Storage
- **SQLite** for:
  - sessions
  - capture indexes
  - operational state
  - metadata and preferences
- **DuckDB** for:
  - analytics-friendly materialization
  - queryable flattened capture data
  - future structured extraction tables

### Export
- JSON export
- CSV export
- foundation for future richer session bundles

### Sensitive-data controls
- explicit consent gate for sensitive mode
- masked-by-default secret policy in Rust core
- local-first architecture to avoid unnecessary remote exfiltration

### Local AI hooks
- local Ollama endpoint integration scaffold
- future-compatible llama.cpp/local inference path
- analysis request path from extension to native core

---

## Architecture overview

<div align="center">
  <img src="assets/architecture.svg" alt="DockStack architecture" width="100%" />
</div>

### High-level flow
1. The **extension** captures network or page-level events.
2. The **background worker** normalizes messages.
3. The **native Rust core** receives events over native messaging.
4. **SQLite** stores operational records.
5. **DuckDB** materializes analytics/query-ready rows.
6. The **export engine** writes JSON/CSV artifacts.
7. Optional **local AI** analyzes context through Ollama.

---

## Stack

### Extension / frontend
- TypeScript
- React
- WXT

### Native core
- Rust

### Databases
- SQLite
- DuckDB

### Local AI
- Ollama
- llama.cpp integration path

### CI / automation
- GitHub Actions

---

## Monorepo layout

```text
DockStack/
  apps/
    extension/          # WXT + React + TypeScript browser extension
    native-core/        # Rust native messaging host
  crates/
    capture-core/       # shared Rust capture models
    storage-sqlite/     # operational data store
    storage-duckdb/     # analytics/materialization store
    export-engine/      # JSON/CSV export logic
    ai-engine/          # Ollama bridge
    secret-policy/      # masking and sensitive-data rules
  packages/
    shared-types/       # shared TS types/protocols
  assets/               # project images
  docs/
    architecture.md
  scripts/
    install-native-host.sh
```

---

## Current extension surfaces

### Popup
Current repository includes a functional popup for:
- starting a capture session
- stopping a capture session
- enabling sensitive mode
- accepting sensitive capture terms
- viewing recent captures
- checking native-core connectivity

### Content script
The extension injects a page-level hook that captures:
- `fetch`
- `XMLHttpRequest`

### Background worker
The background worker:
- receives capture events
- binds them to the active session
- persists recent local records
- forwards them to the Rust native core

---

## Native core responsibilities

The Rust native core currently owns:
- native messaging request handling
- session persistence
- capture persistence
- secret masking
- DuckDB materialization
- JSON/CSV export generation
- local AI request dispatch to Ollama

---

## Security model

DockStack is designed to be **local-first** and **consent-aware**.

### Current security decisions
- sensitive mode is **disabled by default**
- user must explicitly accept terms before enabling sensitive capture
- common secret-bearing headers are masked before persistence:
  - `authorization`
  - `cookie`
  - `set-cookie`
  - `x-csrf-token`
  - `x-xsrf-token`
  - `csrf-token`

### Important note
This repository currently provides the **foundation and policy structure** for a stronger secure system, but it is not yet a formally audited security product.

---

## Build and development

### Requirements
- Node.js 20+
- pnpm 9.12.0
- Rust stable toolchain
- a desktop Chromium browser for extension testing
- optional local Ollama installation

### Install extension dependencies
```bash
cd apps/extension
pnpm install
```

### Build the extension
```bash
cd apps/extension
pnpm build
pnpm zip
```

### Build Rust workspace
```bash
cargo build --workspace
```

### Run native core locally
```bash
cargo run -p native-core
```

---

## Native host installation

A helper script is included:

```bash
scripts/install-native-host.sh
```

Before using it, update the script with the actual extension ID after loading/packaging the extension.

---

## GitHub Actions

The repository includes CI workflows that:
- build the browser extension
- build the Rust workspace
- produce release artifacts for extension output and native core binaries

---

## What is implemented vs. what still needs hardening

### Implemented in repo
- working monorepo structure
- extension popup and capture wiring
- content-side fetch/XHR hook
- background ingest path
- native messaging protocol shape
- SQLite store
- DuckDB store
- export engine
- Ollama call path
- GitHub Actions workflows

### Still needs deeper hardening / production polish
- native host installation UX per OS
- robust release packaging for all platforms
- structured extraction rules beyond raw capture persistence
- richer analytics queries in DuckDB
- more advanced DevTools/CDP-based capture mode
- stronger end-to-end tests
- store-ready privacy/compliance materials
- Firefox/Edge/Safari packaging specifics

This repository is intended to be the **real base** for DockStack, not a fake README-only placeholder.

---

## Publishing targets

Planned browser targets:
- Chrome / Chromium
- Microsoft Edge
- Firefox
- Safari later through platform-specific packaging

---

## Suggested next engineering priorities

1. compile and validate Rust workspace end-to-end on CI
2. finalize native host install flow
3. add DuckDB-backed structured extraction queries
4. add replay/analysis tools
5. add richer export bundles and session workspaces
6. add cross-browser packaging and store metadata

---

## License

Apache-2.0

---

## Project identity

**DockStack**

A local-first capture, inspection, extraction, and export workspace for modern websites and web apps.
