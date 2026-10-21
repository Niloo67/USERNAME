# Kumon Check-In — two separate apps

You can try either system. They are **independent** folders with their own database.

| Folder | Method | Port | Hardware |
| --- | --- | --- | --- |
| [`qr-checkin/`](qr-checkin/) | Printed **QR** badges + USB **2D** scanner | `3000` | ~$20–40 scanner |
| [`rfid-checkin/`](rfid-checkin/) | **RFID tags** on folders + USB tap reader | `3001` | ~$12–30 reader + tag pack |

Run **only one** on the desk laptop at a time (or both on different ports if you are comparing).

---

## Which should you buy?

### Option A — QR (print badges)

- Cheapest long-term (reprint stickers for free)  
- Phone camera can be a backup  
- Buy: **USB 2D QR scanner** (Tera / NetumScan / Eyoyo class, ~$20–40)  
- Details: [qr-checkin/README.md](qr-checkin/README.md)

### Option B — RFID tags (tap)

- Feels nicer for kids (tap folder on pad)  
- Buy matching **125 kHz USB keyboard reader** + **EM4100 tags/fobs**  
- Reassign tags when a student leaves  
- Details: [rfid-checkin/README.md](rfid-checkin/README.md)

**Quick RFID shopping list**

1. `USB RFID reader 125kHz keyboard emulation` — ~$12–30  
2. `EM4100 RFID key fobs 50 pack` (or sticker tags) — ~$10–20  
3. Confirm both say **125 kHz** / **EM4100**  
4. Test in **Notepad** on the laptop before relying on it  

---

## Move from Mac → Windows laptop

Yes — copy the project folder (USB drive, zip, git clone, etc.). Then on Windows:

1. Install [Node.js LTS](https://nodejs.org/)  
2. Install Chrome or Edge  
3. Open PowerShell in the app folder you chose:

```powershell
cd qr-checkin
copy .env.example .env
npm install
npm start
```

or

```powershell
cd rfid-checkin
copy .env.example .env
npm install
npm start
```

4. Open `http://localhost:3000` (QR) or `http://localhost:3001` (RFID)  
5. Plug in scanner/reader → test in Notepad first  
6. Power settings: **never sleep** when plugged in  

**Do not copy `node_modules`** from Mac — run `npm install` on Windows (native modules differ).  
**Do copy** `.env` if you already filled SMTP settings, or recreate from `.env.example`.

---

## Parent emails (both apps)

In `.env` inside the folder you run:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_ON_CHECKIN=true
EMAIL_ON_CHECKOUT=true
```

Gmail: enable 2-Step Verification → create an App Password.

---

## Staff PIN

Default in `.env.example` is `1234`. Change `STAFF_PIN` before using with real families.
