# Staff SOP — Kumon NDG – Check-In / Check-Out

Use this with the franchise **Baseline Requirements Checklist**. Annual certification expects these practices.

## Daily open

1. Turn on the desk laptop and start the app (`npm start` in `qr-checkin` or `rfid-checkin`).
2. Confirm Windows date/time is correct (entries must reflect **actual** arrival/departure).
3. Open the Scan/Tap page in the browser; plug in the USB scanner or RFID reader.
4. Test one known badge/tag in Notepad if the reader seems dead, then return to the app.

## During class

1. Students check in when they **arrive** and check out when they **leave** — do not enter later only for paperwork.
2. Use Auto mode unless you need Force In / Force Out.
3. Forgotten badge/tag: use **Manual check-in / check-out** on the Tap page (search by name → Check in / Check out).
4. Staff/employees: mark as **Staff** on Roster; they punch by name (or tag). Weekly accountant CSV is in Settings.
5. Watch the **Who is here** list whenever you need current presence.

## Staff PIN pages

Roster, Logs, and Settings require the **Staff PIN** (set `STAFF_PIN` in `.env` — do not leave `1234` in production).

- Roster: add students, parent email, print QR badges / link RFID tags.
- Logs: review history by date range; export CSV when needed.
- Settings: centre name, email toggles, **Create backup**, franchise checklist.

## Closing

1. Confirm everyone who left is checked out (Who is here should match reality).
2. Optionally create a backup from Settings before shutdown.

## Weekly backup (requirement 6 & 8)

1. Settings → **Create backup now**.
2. Copy the entire `data/backups/` folder to a USB drive or cloud folder.
3. Keep those copies for **at least 2 years**.
4. Do not delete `data/*.sqlite` or old backup files until they are older than 2 years **and** you have another copy.

## If the laptop or app is down

1. Use a paper sign-in sheet for the session (temporary only).
2. When the system is back, create a backup, then resume digital check-in immediately.
3. Do not use Excel as the ongoing baseline method.

## PII rules (requirement 7)

- Collect only what you need: student name, unique ID, subjects, parent email (phone optional).
- Parent contact is visible only after Staff PIN (Roster).
- Desk Wi‑Fi viewers see who is here (name/ID), not parent phone/email.
- Deactivating a student keeps attendance history for review.

## Training

Every staff member who works the desk should be able to:

1. Check a student in and out with the scanner/reader.
2. Use manual backup entry.
3. Open Who is here and Logs.
4. Create a backup and know where USB copies go.
