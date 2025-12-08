#!/usr/bin/env bash
# Helper used by npm start to choose between default Firefox or a custom binary via FIREFOX_BIN when running web-ext.
set -euo pipefail

CONFIG_PATH="./.web-ext-config.mjs"
extra_args=()

if [[ -n "${FIREFOX_BIN:-}" ]]; then
  echo "Using Firefox from FIREFOX_BIN=${FIREFOX_BIN}"
  extra_args+=(--firefox "$FIREFOX_BIN")
else
  echo "Using default Firefox"
fi

web-ext run --browser-console --keep-profile-changes --config "$CONFIG_PATH" "${extra_args[@]}"
