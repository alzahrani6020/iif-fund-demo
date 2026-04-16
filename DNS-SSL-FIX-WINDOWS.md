# Fix `ERR_SSL_PROTOCOL_ERROR` on Windows (DNS/Router)

If `iiffund.com` fails in Chrome with `ERR_SSL_PROTOCOL_ERROR`, but the site works elsewhere, it’s usually **DNS resolver timeouts** (router/ISP) — not the website code.

## Quick diagnosis

Run in PowerShell:

```powershell
nslookup iiffund.com
nslookup www.iiffund.com
curl.exe -Iv https://iiffund.com/ 2>&1 | Select-Object -First 40
```

- If `nslookup` times out (often showing DNS server like `fe80::1`) → your DNS is broken/unreachable.
- If `curl` returns `HTTP/1.1 200 OK` but Chrome fails → Chrome/network features (QUIC/extensions/HTTPS inspection).

## Fix (recommended): set DNS to Cloudflare/Google

### Option A — per PC (fastest)

Windows:
- Settings → Network & Internet → (Wi‑Fi/Ethernet) → Hardware properties
- DNS server assignment → Edit → Manual
- IPv4:
  - Preferred: `1.1.1.1`
  - Alternate: `8.8.8.8`
- (Optional) IPv6:
  - Preferred: `2606:4700:4700::1111`
  - Alternate: `2001:4860:4860::8888`

Then:

```powershell
ipconfig /flushdns
```

Restart Chrome.

### Option B — router (fixes all devices)

Change router DNS to Cloudflare/Google (same values above). Then reconnect devices.

## Chrome-only workaround

- `chrome://flags` → disable **Experimental QUIC protocol** → relaunch
- Disable VPN/proxy and any antivirus “HTTPS scanning” temporarily to test.

