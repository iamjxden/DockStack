# Security Notes

DockStack is designed as a local-first browser capture and extraction tool. That makes its security model fundamentally different from a pure UI extension or a cloud-first SaaS product.

## Threat model summary

DockStack may handle:
- application request metadata
- response payloads
- authenticated application flows
- structured datasets derived from captured traffic
- user-triggered exports

That means the security surface includes:
- extension permissions
- content/page injection behavior
- native messaging
- local storage
- export generation
- optional local AI integrations

## Current controls in the repository

### Sensitive mode is explicit
Sensitive capture mode is not enabled silently. The user must explicitly turn it on and accept the warning inside the UI.

### Local-first storage model
The architecture is intended to keep captured data on the user’s own machine by default. This reduces accidental dependence on remote infrastructure.

### Masking rules
Common secret-bearing headers are masked before persistence. This is not a complete DLP system, but it is a meaningful control for the most obvious credential-bearing header names.

### Explicit export actions
Export generation is an intentional user action. DockStack is not designed to upload session data silently as part of default behavior.

## Current limitations

The current codebase should not be described as a fully audited secure appliance.

Areas still worth hardening include:
- encrypted-at-rest storage partitions for sensitive captures
- OS-native secure key storage integration
- stronger binary signing and installer verification
- more granular permission-gating for future advanced capture paths
- formal audit of secret masking edge cases
- better handling of very large or mixed-content payloads

## Safe operational guidance

Use DockStack only in environments where you are authorized to inspect the traffic and application data being captured.

When sensitive capture mode is enabled:
- treat exports as sensitive files
- review local storage hygiene
- avoid sharing raw artifacts without redaction
- verify whether downstream tooling should receive masked or unmasked data

## Native host considerations

The native host increases capability but also expands the trust boundary. Production distribution should eventually include:
- deterministic release assets
- strong installer documentation
- platform-specific signing where practical
- clear mapping between browser extension IDs and native host manifests

## Browser store posture

Because DockStack is a powerful tool, store-facing material should be direct and transparent about:
- what it captures
- why it needs its permissions
- what remains local
- what sensitive mode means

A strong security posture is not only about implementation. It is also about user comprehension and informed consent.
