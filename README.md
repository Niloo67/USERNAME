# Kumon Check-In / Check-Out

Scanner-first attendance for a Kumon learning centre. Runs on a desk computer; phones and tablets on the centre Wi‑Fi share the same live list. Parent alerts go by **email** (not SMS).

## Why a desk scanner (not phone-first)

| | USB / Bluetooth **2D QR** scanner | Phone camera |
| --- | --- | --- |
| Speed | Near-instant | Focus + decode lag |
| Lighting | Built-in illumination | Needs good light |
| Staff effort | Student presents badge | Hold phone steady |
| Best for | Main desk | Backup / roaming |

Buy any **2D** scanner in USB HID (keyboard) mode that reads QR codes. Avoid 1D-only laser scanners. Test: open Notepad, scan a printed QR — text should appear and usually end with Enter.

Examples in the same class: Zebra DS2208 / DS9308, Honeywell 2D models, or budget 2D units (~$40–$150).

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3000` on the desk PC. On other devices, use `http://<desk-pc-ip>:3000`.

### `.env` essentials

- `STAFF_PIN` — unlocks Roster, Logs, and Settings
- `CENTRE_NAME` — shown on badges and emails
- `SMTP_*` — optional; without them, check-in still works and parent email is skipped

**Gmail:** enable 2-Step Verification → create an App Password → set `SMTP_USER` and `SMTP_PASS`.

## Daily use

1. Start the app on the desk computer and leave the **Scan** page open.
2. Plug in the 2D scanner; keep the scan box focused (or just scan — global HID capture works when you are not typing in another field).
3. Add students under **Roster**, print QR badges, tape them to folders.
4. Modes: **Auto** (toggles in/out), **Force Check-In**, **Force Check-Out**.
5. Optional **Use camera** on a phone for backup.
6. Export history from **Logs**.

## Backup

Copy `data/kumon.sqlite`, or export CSV from Logs.

## Stack

Node.js, Express, SQLite (`better-sqlite3`), Nodemailer, static HTML + Tailwind CDN + Vanilla JS. No React build step.
