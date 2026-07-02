# Architecture Notes

DockStack is built as a split system rather than a single browser-runtime-only bundle.

## Why the architecture is split

A modern browser extension is a good place for:
- UI
- permission-managed browser interaction
- content/page capture hooks
- lightweight session control

It is not the ideal place for all of the following at once:
- durable local storage orchestration
- heavy export work
- broader analytical query execution
- native OS-level integration
- serious local AI wiring

That is why DockStack is structured as:
- extension layer
- native processing core
- operational data store
- analytical data store
- local AI integration path

## Extension layer

The extension is implemented using:
- TypeScript
- React
- WXT

Its current responsibilities include:
- capture start/stop control
- scope selection
- consent gating for sensitive mode
- display of recent captures
- request detail inspection
- dataset candidate presentation
- popup and options UI

## Capture path

Current capture logic focuses on page-level network observation through injected hooks for:
- `fetch`
- `XMLHttpRequest`

The extension background worker receives the resulting messages and binds them to the currently active session.

## Native core

The native core is implemented in Rust and communicates with the extension via native messaging.

Its responsibilities include:
- durable session persistence
- durable capture persistence
- policy enforcement before persistence
- export execution
- analytical materialization
- local AI request handling

## SQLite role

SQLite is used as the operational store.

That means it is a good fit for:
- session records
- capture indexes
- operational metadata
- lightweight durable state

## DuckDB role

DuckDB is used as the analytical store.

That makes it a better fit for:
- flattened analytical capture views
- future extraction tables
- large local queries
- structured export preparation

## Why both databases exist

SQLite and DuckDB are not being used redundantly.

They serve different roles:
- SQLite = application and operational state
- DuckDB = analytical and extraction-oriented data work

## Export path

Export currently supports:
- JSON
- CSV

The intended evolution is toward richer packaged artifacts and more structured output modes.

## Local AI path

DockStack is intentionally aligned around local AI rather than mandatory paid cloud APIs.

The repository currently includes an Ollama integration path and leaves room for llama.cpp-compatible use cases.

## Distribution model

The browser extension and the native host are separate runtime pieces, but they ship as one product experience.

That means public distribution must eventually account for:
- browser store packaging
- native host install UX
- platform-specific release bundles
- permissions and privacy explanations

## Design principle

DockStack is being built as a local-first technical workstation for browser capture and structured extraction, not a decorative browser add-on.
