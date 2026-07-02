# DockStack Architecture

## High-level

- Browser extension captures page-level and DevTools-visible events.
- Background worker normalizes messages and forwards to local native core.
- Native core stores operational records in SQLite.
- Native core materializes analytics-friendly views in DuckDB.
- Export engine writes JSON and CSV artifacts.
- Local AI calls route through Ollama and are designed to stay local-first.

## Security

- Sensitive mode is explicit and opt-in.
- Authorization-like headers are masked before persistence.
- Local-first architecture avoids cloud exfiltration by default.
