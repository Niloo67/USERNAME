# Kumon Check-In — QR / barcode version

Desk **2D QR scanner** + printed badges on student folders. Parent email on check-in/out (optional SMTP).

## Run

```bash
cd qr-checkin
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3000`

## What to buy

| Item | Buy |
| --- | --- |
| Scanner | USB **2D** QR scanner, keyboard/HID mode (~$20–40): Tera D5100Y, NetumScan, Eyoyo |
| Badges | Free — print from Roster → Badge |
| Avoid | 1D-only laser scanners |

**Test:** Notepad → scan printed QR → you see `K-0001` + Enter.

## Daily use

1. Add students + parent email in Roster  
2. Print QR badge → tape to folder  
3. Leave Scan page open → scan badge to check in/out  

See the root [README](../README.md) for Windows laptop setup and comparison with the RFID version.
