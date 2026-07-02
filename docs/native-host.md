# Native Host

DockStack uses a native messaging host to move heavy work out of the browser runtime.

## Responsibilities
- session persistence
- capture persistence
- masking policy enforcement
- DuckDB materialization
- export generation
- local AI dispatch

## Current state
The repository includes the host implementation and a Linux-oriented installation script. Platform-specific installers and packaging should be added before public distribution.
