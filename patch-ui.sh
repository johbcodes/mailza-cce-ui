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
    
    echo "🌐 Patching live server directory: /usr/share/zextras/$MODULE/html/"
    
    # Optional: You can uncomment the line below to create backups
    # cp -r "/usr/share/zextras/$MODULE/html" "/usr/share/zextras/$MODULE/html.bak"
    
    # Sync the new build directly into the live Nginx path
    rsync -avz --delete dist/ "/usr/share/zextras/$MODULE/html/"
    
    cd ..
  else
    echo "⚠️ Warning: Directory $MODULE not found, skipping."
  fi
done

echo ""
echo "🔄 Restarting Nginx to flush cache..."
systemctl restart nginx

echo "✅ All UI modules successfully built and patched!"
