# Kumon Check-In / Check-Out

**Scanner-first** attendance for a Kumon learning centre. Each student gets a **QR badge**. A USB/Bluetooth **2D desk scanner** reads the badge and checks them in or out. Phones on the centre Wi‑Fi share the same live list. Parent alerts go by **email** (not SMS).

## How check-in works (hardware)

```
Student QR badge  →  2D desk scanner  →  types student ID + Enter  →  browser checks in/out
```

You do **not** type IDs at the desk. The scanner acts as a keyboard:

1. Add the student in **Roster** (ID like `K-0001`).
2. Click **Badge** → **Print badge** and tape the QR to their folder.
3. Leave the **Scan** page open on the desk computer with the green “Waiting for desk scanner…” banner.
4. Student presents the badge → pull the scanner trigger → done.

| | USB / Bluetooth **2D QR** scanner | Phone camera |
| --- | --- | --- |
| Role | **Primary** at the front desk | Backup only |
| Speed | Near-instant | Focus + decode lag |
| Best for | Peak arrivals / pickup | Roaming or overflow |

### What to buy

Must be a **2D imager** that reads **QR codes**, in **USB HID / keyboard** mode (types like a keyboard). Do **not** buy a cheap 1D laser-only scanner — those cannot read QR badges.

| Priority | Model | Notes | Approx. price |
| --- | --- | --- | --- |
| **Best default** | **Zebra DS2208** (corded USB) | Plug-and-play HID keyboard; widely used for web check-in; optional stand for hands-free | ~$100–180 |
| Strong alternative | Honeywell Voyager XP **1470g** (2D SKU) | Durable 2D; confirm the listing says 2D/QR, not 1D-only | ~$120–200 |
| Hands-free desk | Zebra **DS9308** presentation scanner | Sits on the counter; student holds badge under it | ~$200–300 |
| Budget | Any Amazon “2D QR USB barcode scanner” with HID keyboard mode (e.g. Tera / Symcode class) | Fine for a small centre; test with Notepad before relying on it | ~$40–80 |

**Avoid:** “1D only”, “laser barcode scanner” without 2D/QR, and scanners that only work in serial/COM mode (need drivers).

**Setup tip:** After plugging in USB, open Notepad and scan a printed student badge. You should see something like `K-0001` appear, usually ending with Enter. If Notepad works, this app will work. If Enter is missing, scan the manufacturer’s “suffix CR/Enter” programming barcode from the manual.

### Manual backup (already in the app)

If the scanner fails or a badge is damaged:

1. Open **Backup options** on the Scan page  
2. Search by student name, or type the ID printed under the QR  
3. Or use **Phone camera** / **Scan badge image**  

So the desk can keep running even without the hardware scanner.

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3000` on the desk PC. On other devices: `http://<desk-pc-ip>:3000`.

### `.env` essentials

- `STAFF_PIN` — unlocks Roster, Logs, and Settings
- `CENTRE_NAME` — shown on badges and emails
- `SMTP_*` — optional; without them, check-in still works and parent email is skipped

**Gmail:** enable 2-Step Verification → create an App Password → set `SMTP_USER` and `SMTP_PASS`.

## Daily use

1. Start the app on the desk computer; leave **Scan** open (scanner target stays focused).
2. Plug in the 2D scanner.
3. Modes: **Auto** (toggles in/out), **Force Check-In**, **Force Check-Out**.
4. Backups (under “Backup options”): phone camera, search by name, or scan a badge photo.
5. Export history from **Logs**.

## Backup

Copy `data/kumon.sqlite`, or export CSV from Logs.

## Stack

Node.js, Express, SQLite (`better-sqlite3`), Nodemailer, static HTML + Tailwind CDN + Vanilla JS. No React build step.
