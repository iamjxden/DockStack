#!/usr/bin/env bash
set -euo pipefail

HOST_NAME="io.dockstack.core"
BROWSER="${1:-chrome}"
EXTENSION_ID="${2:-}"
BIN_PATH="$(cd "$(dirname "$0")/.." && pwd)/target/release/native-core"

if [ -z "$EXTENSION_ID" ]; then
  echo "usage: $0 <browser: chrome|chromium|edge> <extension-id>"
  exit 1
fi

case "$BROWSER" in
  chrome)
    MANIFEST_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
    ORIGIN_PREFIX="chrome-extension://"
    ;;
  chromium)
    MANIFEST_DIR="$HOME/.config/chromium/NativeMessagingHosts"
    ORIGIN_PREFIX="chrome-extension://"
    ;;
  edge)
    MANIFEST_DIR="$HOME/.config/microsoft-edge/NativeMessagingHosts"
    ORIGIN_PREFIX="chrome-extension://"
    ;;
  *)
    echo "unsupported browser: $BROWSER"
    exit 1
    ;;
esac

mkdir -p "$MANIFEST_DIR"
cat > "$MANIFEST_DIR/$HOST_NAME.json" <<JSON
{
  "name": "$HOST_NAME",
  "description": "DockStack native core",
  "path": "$BIN_PATH",
  "type": "stdio",
  "allowed_origins": [
    "${ORIGIN_PREFIX}${EXTENSION_ID}/"
  ]
}
JSON

echo "installed native host manifest at $MANIFEST_DIR/$HOST_NAME.json"
