#!/bin/bash
# ====================================================================
# Mailza -> Carbonio CE Recursive Build & Patch Script
# Run this on your live server inside the cloned repository directory
# ====================================================================

# Stop execution if any command fails
set -e

echo "🚀 Starting Mailza UI Build and Patch Process..."

# List of standalone UI modules to build and deploy
# (carbonio-ui-commons is intentionally excluded as it's a shared library)
UI_MODULES=(
  "carbonio-login-ui"
  "carbonio-shell-ui"
  "carbonio-mails-ui"
  "carbonio-calendars-ui"
  "carbonio-files-ui"
  "carbonio-ws-collaboration-ui"
)

for MODULE in "${UI_MODULES[@]}"; do
  if [ -d "$MODULE" ]; then
    echo ""
    echo "============================================================"
    echo "📦 Processing $MODULE..."
    echo "============================================================"
    
    cd "$MODULE"
    
    echo "⚙️ Running pnpm build..."
    pnpm build
    
    # Calculate target directory (e.g., carbonio-login-ui -> login)
    TARGET_DIR=$(echo "$MODULE" | sed 's/^carbonio-//' | sed 's/-ui$//')
    LIVE_PATH="/opt/zextras/web/$TARGET_DIR"
    
    echo "🌐 Patching live server directory: $LIVE_PATH/"
    
    # Optional: Backup
    cp -r "$LIVE_PATH" "${LIVE_PATH}.bak" || true
    
    # Sync the new build directly into the live Nginx path
    rsync -avz --delete dist/ "$LIVE_PATH/"
    
    cd ..
  else
    echo "⚠️ Warning: Directory $MODULE not found, skipping."
  fi
done

echo ""
echo "🔄 Restarting Zextras service / Nginx..."
systemctl restart nginx || echo "Note: If nginx restart fails, the web server might be integrated into a different service (e.g. mailboxd)."

echo "✅ All UI modules successfully built and patched!"
