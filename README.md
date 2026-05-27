# Mailza Carbonio CE UI Customization

This repository contains the physical Mailza UI redesign for Carbonio CE. It is designed to be cloned and built **directly on your live Carbonio CE server** to seamlessly override the default frontend interfaces.

## 🚀 Live Server Patching Guide

To apply these UI customizations, SSH into your live Carbonio CE server as `root` (or a user with `sudo` privileges) and follow the steps below.

### 1. Install Prerequisites
You will need `Node.js` and `pnpm` installed on your server to compile the React micro-frontends.

```bash
# Install Node.js v22 (Required by Carbonio CE micro-frontends)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm globally
sudo npm install -g pnpm
```

### 2. Clone the Repository
Clone this repository into a directory on your server (e.g., `/opt/mailza-ui`):

```bash
cd /opt
git clone https://github.com/johbcodes/mailza-cce-ui.git mailza-ui
cd mailza-ui
```

### 3. Build & Patch the Login Gateway
Compile the Login UI and copy the compiled static assets into the Nginx document root.

```bash
cd carbonio-login-ui
pnpm install
pnpm build

# Optional: Backup the original Zextras login files
cp -r /usr/share/zextras/carbonio-login-ui/html /usr/share/zextras/carbonio-login-ui/html.bak

# Patch the live directory
rsync -avz --delete dist/ /usr/share/zextras/carbonio-login-ui/html/
cd ..
```

### 4. Build & Patch the Core Shell
Compile the main Shell UI (which powers the global Sidebar and Top Navigation bar) and deploy it.

```bash
cd carbonio-shell-ui
pnpm install
pnpm build

# Optional: Backup the original Zextras shell files
cp -r /usr/share/zextras/carbonio-shell-ui/html /usr/share/zextras/carbonio-shell-ui/html.bak

# Patch the live directory
rsync -avz --delete dist/ /usr/share/zextras/carbonio-shell-ui/html/
cd ..
```

*(Note: You can follow the exact same pattern for `carbonio-mails-ui`, `carbonio-calendars-ui`, and `carbonio-ws-collaboration-ui` when needed).*

### 5. Clear Cache & Restart
Restart Nginx to flush out the old cached assets and serve the new Mailza interface immediately to your users.

```bash
systemctl restart nginx
```

---

## ⚠️ Upgrade Resilience Notice
When you perform future system updates (e.g., `apt-get upgrade carbonio-login-ui`), the `apt` package manager may overwrite the `/usr/share/zextras/.../html/` directories with the default Zextras files. 

Keep this `/opt/mailza-ui` folder on your server. After any core system upgrades, you can instantly restore your customization by simply re-running the `rsync` commands:

```bash
cd /opt/mailza-ui
rsync -avz --delete carbonio-login-ui/dist/ /usr/share/zextras/carbonio-login-ui/html/
rsync -avz --delete carbonio-shell-ui/dist/ /usr/share/zextras/carbonio-shell-ui/html/
systemctl restart nginx
```
