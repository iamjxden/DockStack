#!/usr/bin/env bash
set -euo pipefail
HOST_NAME="io.dockstack.core"
EXTENSION_ID="__REPLACE_WITH_EXTENSION_ID__"
BIN_PATH="$(cd "$(dirname "$0")/.." && pwd)/target/release/native-core"
MANIFEST_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
mkdir -p "$MANIFEST_DIR"
cat > "$MANIFEST_DIR/$HOST_NAME.json" <<JSON
{
  "name": "$HOST_NAME",
  "description": "DockStack native core",
  "path": "$BIN_PATH",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$EXTENSION_ID/"
  ]
}
JSON
echo "installed native host manifest at $MANIFEST_DIR/$HOST_NAME.json"
