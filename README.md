
# ☕ BeanLog Raspberry Pi Setup

This guide ensures your premium espresso logger is "Installable" on your Android phone using Tailscale and HTTPS.

## 🛠 1. Tailscale CLI Setup
Android browsers (Chrome/Vivaldi) **require** HTTPS to show the "Install App" button.

1. **Enable HTTPS on Tailscale:**
   - Go to the [Tailscale Admin Console](https://login.tailscale.com/admin/dns).
   - Enable **MagicDNS**.
   - Enable **HTTPS Certificates**.

2. **Get your Hostname:**
   Run this in your Pi terminal:
   ```bash
   tailscale status
   ```
   Note your Pi's full domain name (e.g., `espresso-pi.tail1234.ts.net`).

3. **Fetch SSL Certificates:**
   Run this in your project folder (replace with your actual domain):
   ```bash
   tailscale cert espresso-pi.tail1234.ts.net
   ```
   This will create two files: `espresso-pi.tail1234.ts.net.crt` and `espresso-pi.tail1234.ts.net.key`.

---

## 🚀 2. The HTTPS Server (REQUIRED FOR INSTALL)
Standard Python servers don't support SSL or `.tsx` files properly. Use this updated `serve_https.py`:

1. Create `serve_https.py` (replace the filenames with your cert files):
```python
import http.server
import ssl
import socketserver

PORT = 443 # Note: Running on 443 requires 'sudo'
CERT_FILE = "your-pi.tailnet.ts.net.crt"
KEY_FILE = "your-pi.tailnet.ts.net.key"

class BeanLogHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow PWA cross-origin features
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

BeanLogHandler.extensions_map.update({
    '.tsx': 'application/javascript',
    '.ts': 'application/javascript',
    '.js': 'application/javascript',
})

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)

with socketserver.TCPServer(("", PORT), BeanLogHandler) as httpd:
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    print(f"☕ BeanLog SECURE at https://your-pi.tailnet.ts.net")
    httpd.serve_forever()
```

2. Run with sudo:
```bash
sudo python3 serve_https.py
```

---

## 📱 3. Installing on Android
1. Open Vivaldi/Chrome on your phone.
2. Go to `https://your-pi.tailnet.ts.net`.
3. Look for the **"Lock" icon** in the address bar (it should be green/secure).
4. Open the browser menu (three dots) and tap **"Install App"**.

## 🔄 4. Data Safety
Your logs stay on your phone. Use the **Data Vault** (Database icon) to export backups to your Pi's storage via the browser download.
