# DockStack

DockStack is a local-first, DevTools-grade browser extension workspace for capturing network activity, inspecting rendered pages, extracting usable datasets, and storing everything locally.

## Stack

- Extension/UI: TypeScript + React + WXT
- Native core: Rust
- Local AI: Ollama / llama.cpp bridge hooks
- Storage: SQLite + DuckDB

## Current capabilities in this repository

- Extension session control (start/stop capture)
- Sensitive-mode consent gate
- Background capture pipeline
- Page-level fetch/XHR hook injection
- DevTools network tap entrypoint
- Local native-messaging integration scaffolding
- SQLite operational store
- DuckDB analytics/materialization store
- CSV/JSON export engine
- Ollama integration hook for local schema analysis
- GitHub Actions CI/build scaffolding

## Monorepo layout

- `apps/extension` — browser extension (WXT)
- `apps/native-core` — native messaging host
- `crates/*` — Rust libraries for storage, capture, policy, AI, export
- `packages/shared-types` — shared message/event types

## Development

### Extension
```bash
cd apps/extension
pnpm install
pnpm dev
```

### Native core
```bash
cargo build --workspace
cargo run -p native-core
```

### CI
GitHub Actions builds the extension bundle and Rust workspace.

## Security stance

DockStack is designed to be local-first. Sensitive capture is disabled by default and must be explicitly enabled and accepted by the user.
