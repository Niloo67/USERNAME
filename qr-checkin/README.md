# Kumon NDG – Check-In / Check-Out — QR / barcode version

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

1. Set a strong `STAFF_PIN` in `.env`  
2. Add students + parent email in Roster  
3. Print QR badge → tape to folder  
4. Leave Scan page open → scan badge when students **arrive** and **leave**  
5. Weekly: Settings → **Create backup** → copy `data/backups/` to USB/cloud (keep ≥ 2 years)  

Franchise checklist + staff procedure: [STAFF_SOP.md](../STAFF_SOP.md) and Settings → Franchise baseline checklist.

See the root [README](../README.md) for Windows laptop setup and comparison with the RFID version.
