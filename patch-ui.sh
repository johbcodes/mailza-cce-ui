#!/bin/bash
# ====================================================================
# Mailza -> Carbonio CE Production Patch Script
# Builds each UI module and deploys it into the Carbonio iris directory
# using hash-versioned folders, index.html asset injection, and symlinks.
# ====================================================================

set -e

IRIS_BASE="/opt/zextras/web/iris"

# Map: local repo dir -> carbonio module name in iris
declare -A MODULES=(
  ["carbonio-login-ui"]="login"
  ["carbonio-shell-ui"]="carbonio-shell-ui"
)

# ──────────────────────────────────────────────────────────────────
# Helper: deploy one module
# ──────────────────────────────────────────────────────────────────
deploy_module() {
  local REPO="$1"           # e.g. carbonio-shell-ui
  local CARBONIO_MOD="$2"   # e.g. carbonio-shell-ui  (iris folder name)

  echo ""
  echo "============================================================"
  echo "📦  $REPO"
  echo "============================================================"

  cd "$REPO"

  # ── 1. Build ──────────────────────────────────────────────────
  echo "⚙️  Installing dependencies…"
  pnpm install --ignore-scripts

  echo "⚙️  Building…"
  pnpm build

  # ── 2. Collect artefact names & hashes ───────────────────────
  COMMIT=$(git rev-parse --short HEAD)
  FULL_HASH=$(git rev-parse HEAD)

  # Grab hashed JS bundle — handles index.hash.js, index.js, app.hash.js
  NEW_JS=$(ls dist/index.*.js dist/index.js dist/app.*.js 2>/dev/null | grep -v chunk | head -1 | xargs -r basename 2>/dev/null || true)
  NEW_CSS=$(ls dist/style.*.css dist/index.*.css dist/*.css 2>/dev/null | head -1 | xargs -r basename 2>/dev/null || true)

  echo "   Commit : $COMMIT"
  echo "   JS     : ${NEW_JS:-<none>}"
  echo "   CSS    : ${NEW_CSS:-<none>}"

  # ── 3. Stage build into a Mailza-namespaced versioned folder ──
  MAILZA_DIR="$IRIS_BASE/mailza-${REPO}/${COMMIT}"
  echo "📂  Staging → $MAILZA_DIR"
  sudo mkdir -p "$MAILZA_DIR"
  sudo cp -rf dist/* "$MAILZA_DIR/"

  # Drop the Mailza logo into the static path so our hardcoded React img src works
  sudo cp ../mailza-logo.png "$IRIS_BASE/mailza-logo.png"

  # ── 4. Patch the Carbonio module's index.html ─────────────────
  INDEX_HTML="$IRIS_BASE/$CARBONIO_MOD/current/index.html"

  if [ -f "$INDEX_HTML" ]; then
    echo "🔧  Patching $INDEX_HTML"

    sudo python3 - << PYEOF
import re, sys

index_path = "$INDEX_HTML"
mailza_dir = "mailza-${REPO}/${COMMIT}"

try:
    content = open(index_path).read()
    patched = content

    if "$NEW_JS":
        patched = re.sub(
            r'src="/static/iris/[^"]+/index\.[^"]+\.js"',
            f'src="/static/iris/{mailza_dir}/$NEW_JS"',
            patched
        )

    if "$NEW_CSS":
        patched = re.sub(
            r'href="/static/iris/[^"]+/style\.[^"]+\.css"',
            f'href="/static/iris/{mailza_dir}/$NEW_CSS"',
            patched
        )

    if patched == content:
        print("   ⚠️  No asset references matched in index.html – check the regex patterns.")
    else:
        open(index_path, 'w').write(patched)
        print("   ✅  index.html updated.")
except Exception as e:
    print(f"   ❌  Failed to patch index.html: {e}", file=sys.stderr)
    sys.exit(1)
PYEOF

  else
    echo "   ⚠️  $INDEX_HTML not found – skipping index.html patch."
  fi

  # ── 5. Create / replace the Carbonio versioned symlink ────────
  CARBONIO_VERSION_DIR="$IRIS_BASE/$CARBONIO_MOD/$FULL_HASH"
  echo "🔗  Symlinking $CARBONIO_VERSION_DIR → $MAILZA_DIR"
  sudo mkdir -p "$(dirname "$CARBONIO_VERSION_DIR")"
  sudo rm -f "$CARBONIO_VERSION_DIR"
  sudo ln -sf "$MAILZA_DIR" "$CARBONIO_VERSION_DIR"

  cd ..
  echo "✅  $REPO deployed."
}

# ──────────────────────────────────────────────────────────────────
# Main loop
# ──────────────────────────────────────────────────────────────────
echo "🚀  Starting Mailza full-stack patch…"

for REPO in "${!MODULES[@]}"; do
  if [ -d "$REPO" ]; then
    deploy_module "$REPO" "${MODULES[$REPO]}"
  else
    echo "⚠️  Directory '$REPO' not found – skipping."
  fi
done

# ──────────────────────────────────────────────────────────────────
# Reload Carbonio Nginx
# ──────────────────────────────────────────────────────────────────
echo ""
echo "🔄  Reloading carbonio-nginx…"
sudo systemctl reload carbonio-nginx.service && echo "✅  carbonio-nginx reloaded." \
  || echo "⚠️  Reload failed – try: sudo systemctl restart carbonio-nginx.service"

echo ""
echo "🎉  All Mailza modules deployed to Carbonio!"
