# Security Notes

DockStack is local-first by design.

## Current controls
- sensitive capture is opt-in
- common secret-bearing headers are masked before persistence
- local native core owns durable storage
- export paths are explicit operations, not background uploads

## Areas to harden further
- encrypted-at-rest secrets and payload partitions
- OS-specific secure key storage
- signed release packaging for native host installers
- end-to-end review of permission scope per browser
