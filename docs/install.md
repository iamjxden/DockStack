# Installation Guide

This document covers the expected installation flow for DockStack.

## Browser extension installation

### Development install
1. Build the extension package or build the unpacked extension locally.
2. Open your Chromium browser’s extension management page.
3. Enable Developer Mode.
4. Load the unpacked extension directory from `.output/chrome-mv3` or install the packaged build if applicable.

### Public release install
For a public release, users should be able to install DockStack from a browser extension store listing and then complete the native host setup if they want advanced local features.

## Native host installation

DockStack’s advanced local architecture depends on a native host.

### Linux / Chromium-family
Use the included shell helper:

```bash
scripts/install-native-host.sh chrome <extension-id>
```

Supported browser arguments currently documented:
- `chrome`
- `chromium`
- `edge`

### Windows
Use the included PowerShell helper:

```powershell
./scripts/install-native-host.ps1 -Browser chrome -ExtensionId <extension-id>
```

## Release asset expectation

A public release should ideally contain:
- extension package
- native host binary bundle
- browser-specific install instructions
- native host helper scripts
- release notes

## First-run onboarding recommendation

A production onboarding flow should explain:
- what DockStack captures
- how capture sessions work
- how sensitive mode works
- that advanced local features require native host installation
- how local AI integration works

## Support note

If you distribute DockStack publicly, make sure the install guide published with the release matches the actual package names and platform-specific paths in the shipped build.
