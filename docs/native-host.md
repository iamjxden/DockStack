# Native Host

DockStack uses a native messaging host to move durable storage, export logic, and heavier local processing out of the browser runtime.

## Why the host exists

The browser extension is the right place for:
- capture controls
- tab and domain context
- popup and options UI
- content and page-side hooks

The native host is the right place for:
- SQLite persistence
- DuckDB materialization
- export generation
- masking policy enforcement
- local AI dispatch
- future replay and deeper analysis tasks

## Responsibilities

Current host responsibilities:
- receive messages from the extension
- store sessions
- store captures
- materialize analytics-friendly records in DuckDB
- export JSON and CSV payloads
- dispatch analysis requests to local Ollama

## Native messaging host name

```text
io.dockstack.core
```

## Linux manifest path examples

### Chrome
```text
~/.config/google-chrome/NativeMessagingHosts/io.dockstack.core.json
```

### Chromium
```text
~/.config/chromium/NativeMessagingHosts/io.dockstack.core.json
```

### Microsoft Edge
```text
~/.config/microsoft-edge/NativeMessagingHosts/io.dockstack.core.json
```

## macOS manifest path examples

### Chrome
```text
~/Library/Application Support/Google/Chrome/NativeMessagingHosts/io.dockstack.core.json
```

### Edge
```text
~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/io.dockstack.core.json
```

## Windows registration model

On Windows, native messaging hosts are usually registered through the Registry instead of a simple user-space manifest directory.

Typical registry locations include:

### Chrome
```text
HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\io.dockstack.core
```

### Edge
```text
HKEY_CURRENT_USER\Software\Microsoft\Edge\NativeMessagingHosts\io.dockstack.core
```

The registry value points to a JSON manifest file on disk.

## Installer helpers in this repository

- `scripts/install-native-host.sh`
- `scripts/install-native-host.ps1`

## Production packaging expectations

Before a broad public release, DockStack should ship platform-specific native host installers for:
- Linux
- macOS
- Windows

Those installers should:
- place the binary in a deterministic application location
- write the native host manifest correctly for the selected browser family
- avoid requiring the user to manually edit paths
- document the expected extension ID mapping clearly

## Security notes

The native host receives sensitive data paths if the user enables sensitive mode.

That means packaging and installation should eventually be treated as a security-sensitive surface, including:
- signed binaries where practical
- deterministic release assets
- integrity verification
- explicit extension ID allowlists
- strong local file permissions
