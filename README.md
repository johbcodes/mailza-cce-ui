# Mailza Carbonio CE UI Customization

This repository contains the physical Mailza UI redesign for Carbonio CE. It is designed to be cloned and built **directly on your live Carbonio CE server** to seamlessly override the default frontend interfaces in `/opt/zextras/web/`.

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

### 3. Install Dependencies
You only need to install dependencies once after cloning or pulling new changes.
```bash
pnpm install -r
```

### 4. Run the Patch Script
I have included a `patch-ui.sh` script that recursively iterates through all the micro-frontends (Login, Shell, Mails, Calendars, Files, Chat), builds them, and patches the live Nginx directories automatically.

```bash
chmod +x patch-ui.sh
./patch-ui.sh
```

This script will automatically restart `nginx` at the end to serve the new Mailza interface!

---

## ⚠️ Upgrade Resilience Notice
When you perform future system updates (e.g., `apt-get upgrade carbonio-login-ui`), the `apt` package manager may overwrite the `/opt/zextras/web/` directories with the default Zextras files. 

Keep this `/opt/mailza-ui` folder on your server. After any core system upgrades, you can instantly restore your customization by simply re-running the patch script:

```bash
cd /opt/mailza-ui
./patch-ui.sh
```
