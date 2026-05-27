#!/bin/bash
# ====================================================================
# Mailza -> Carbonio CE CSS Injection Patch
# Strategy: CSS-only overlay. No JS builds. No version conflicts.
# Works with any installed version of Carbonio CE.
# ====================================================================

set -e

IRIS_BASE="/opt/zextras/web/iris"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MAILZA_CSS_DIR="$IRIS_BASE/mailza-css"

echo "🚀  Starting Mailza CSS injection..."

# ── 1. Deploy CSS files into iris ─────────────────────────────────
echo ""
echo "📁  Deploying Mailza CSS to $MAILZA_CSS_DIR..."
sudo mkdir -p "$MAILZA_CSS_DIR"
sudo cp "$SCRIPT_DIR/mailza-theme.css" "$MAILZA_CSS_DIR/mailza-theme.css"
sudo cp "$SCRIPT_DIR/mailza-style.css" "$MAILZA_CSS_DIR/mailza-style.css"
echo "   ✅  CSS files deployed."

# ── 2. Inject <link> tags into every module's current/index.html ──
echo ""
echo "🔧  Injecting CSS into all module index.html files..."

sudo python3 - << 'PYEOF'
import glob, os, sys

IRIS = "/opt/zextras/web/iris"
INJECT = (
    '<link rel="stylesheet" href="/static/iris/mailza-css/mailza-theme.css">'
    '<link rel="stylesheet" href="/static/iris/mailza-css/mailza-style.css">'
)

htmls = glob.glob(f"{IRIS}/*/current/index.html")
if not htmls:
    print("   ❌  No current/index.html files found. Check the iris path.")
    sys.exit(1)

for html_path in htmls:
    try:
        content = open(html_path).read()
        if 'mailza-css' in content:
            print(f"   ⏭️   Already injected: {html_path}")
            continue
        if '</head>' not in content:
            print(f"   ⚠️   No </head> tag found in {html_path}, skipping.")
            continue
        patched = content.replace('</head>', INJECT + '</head>', 1)
        open(html_path, 'w').write(patched)
        print(f"   ✅  Patched: {html_path}")
    except Exception as e:
        print(f"   ❌  Error patching {html_path}: {e}", file=sys.stderr)
PYEOF

# ── 3. Logo replacement ────────────────────────────────────────────
echo ""
echo "🖼️   Replacing logos..."

# Find and replace all known Carbonio logo PNGs with the Mailza logo
MAILZA_LOGO="$SCRIPT_DIR/mailza-logo.png"
if [ ! -f "$MAILZA_LOGO" ]; then
    echo "   ⚠️   Mailza logo PNG not found at $MAILZA_LOGO — skipping logo replacement."
    echo "       Drop a mailza-logo.png into the repo root to enable this."
else
    # Replace logos in the installed (hash-versioned) directories
    # Look in each module's installed version directory (not current/ which is often a copy)
    while IFS= read -r logo_path; do
        sudo cp "$MAILZA_LOGO" "$logo_path"
        echo "   ✅  Replaced: $logo_path"
    done < <(sudo find "$IRIS_BASE" -not -path "*/mailza-*" -not -path "*/i18n/*" \
              \( -name "logo-carbonio.png" -o -name "carbonio_logo.png" \
              -o -name "logo-product-grey.png" -o -name "zextras-logo-gray.png" \) 2>/dev/null)
fi

# ── 4. Reload nginx ────────────────────────────────────────────────
echo ""
echo "🔄  Reloading carbonio-nginx..."
sudo systemctl reload carbonio-nginx.service \
    && echo "   ✅  carbonio-nginx reloaded." \
    || echo "   ⚠️   Reload failed — try: sudo systemctl restart carbonio-nginx.service"

echo ""
echo "🎉  Mailza CSS injection complete!"
echo "    Open your browser (hard-refresh with Ctrl+Shift+R) to see the changes."
