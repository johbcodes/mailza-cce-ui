#!/bin/bash
echo "Reverting CSS injection from index.html files..."

sudo python3 - << 'PYEOF'
import glob, os

IRIS = "/opt/zextras/web/iris"
htmls = glob.glob(f"{IRIS}/*/current/index.html")

for html_path in htmls:
    try:
        content = open(html_path).read()
        
        # Remove the injected tags
        content = content.replace('<link rel="stylesheet" href="/static/iris/mailza-css/mailza-theme.css">', '')
        content = content.replace('<link rel="stylesheet" href="/static/iris/mailza-css/mailza-style.css">', '')
        
        open(html_path, 'w').write(content)
        print(f"Reverted: {html_path}")
    except Exception as e:
        print(f"Error reverting {html_path}: {e}")
PYEOF

sudo systemctl reload carbonio-nginx.service
echo "Done! Refresh your browser."
