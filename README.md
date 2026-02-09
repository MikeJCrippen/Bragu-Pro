# ☕ BeanLog Raspberry Pi Setup

This guide will help you host your premium espresso logger on your Raspberry Pi so you can access it from your Android device anywhere on your home network.

## 🛠 Prerequisites
- A Raspberry Pi (any model) running Raspberry Pi OS.
- Your Android phone (Chrome or Vivaldi) connected to the same Wi-Fi.

---

## 📂 1. Transfer the Files
First, create a folder on your Pi and move your files (`index.html`, `App.tsx`, `types.ts`, `manifest.json`, etc.) into it.

```bash
mkdir ~/beanlog
# Use SCP, SFTP, or a USB stick to move your project files into this directory.
```

---

## 🚀 2. Hosting the App

### Option A: The "Quick Start" (Python)
Best for testing immediately.
1. Open a terminal on your Pi:
   ```bash
   cd ~/beanlog
   python3 -m http.server 8080
   ```
2. On your Android phone, go to: `http://<YOUR_PI_IP>:8080`

### Option B: The "Permanent" way (Nginx)
Best for a stable, always-on experience.
1. Install Nginx: `sudo apt update && sudo apt install nginx -y`
2. Copy your files to the web directory: `sudo cp -r ~/beanlog/* /var/www/html/`
3. Your app is live at `http://<YOUR_PI_IP>`

---

## 🔒 3. Making it "Installable" (HTTPS)
**Vivaldi and Chrome require HTTPS** to enable the PWA "Install" button.

### The Easiest Solution: Tailscale
1. Install Tailscale on your Pi: `curl -fsSL https://tailscale.com/install.sh | sh`
2. Run `sudo tailscale up`.
3. Enable **MagicDNS** and **HTTPS** in your Tailscale admin console.
4. Access your app via your private URL: `https://raspberrypi.your-tailscale-id.ts.net`

---

## 📱 4. Installation Steps

### If using Vivaldi (Android):
1. Open your app URL in Vivaldi.
2. Tap the **Vivaldi Menu Button** (top-right V icon or bottom-right menu).
3. Scroll down and tap **"Install app"**.
4. Confirm the installation. It will now appear in your App Drawer.

### If using Chrome (Android):
1. Open your app URL in Chrome.
2. Tap the **three dots (⋮)**.
3. Tap **"Install app"**.

---

## 🔄 5. Keeping Data Safe
Your data is stored in the **phone's browser cache**.

1. **Upgrades:** Updating the code on your Pi won't delete your logs. Just refresh the app.
2. **Backups:** Use the **Data Vault** icon inside the app to export a `.json` backup. This is your insurance policy.
