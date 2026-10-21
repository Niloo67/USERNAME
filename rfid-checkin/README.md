# Kumon Check-In — RFID / NFC tag version

USB **RFID/NFC reader** + tags on student folders. Tap to check in/out. Parent email on both events.

## Run

```bash
cd rfid-checkin
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3001` (default port — different from the QR app)

## What to buy (cheap starter kit)

Buy reader and tags that match **the same frequency**. Easiest beginner kit:

### Recommended combo (simplest)

| Piece | What to search / buy | Approx. |
| --- | --- | --- |
| **Reader** | USB **125 kHz RFID reader**, “keyboard emulation” / HID / plug-and-play | **~$12–30** |
| **Tags** | **EM4100 / TK4100** 125 kHz key fobs **or** sticker tags (same 125 kHz) | **~$10–20** for a pack of 50–100 |
| Optional | Thin RFID **sticker** tags to tape inside folders | often in the same packs |

**Amazon search terms that work:**
- `USB RFID reader 125kHz keyboard emulation`
- `EM4100 key fob 125kHz` or `RFID keychain tags 125kHz 50 pack`

Example product classes (names change often — check the listing):
- Riversmerge / DollaTek / Navfmru / FissaiD style **125 kHz USB keyboard readers**
- Kits that include **reader + 5 cards/fobs** (~$25–35) are fine to start

### Must say on the listing

1. **125 kHz** (or “EM4100”) — match your tags  
2. **USB keyboard emulation / HID** — no special driver  
3. Tags: **EM4100 / TK4100** if you bought a 125 kHz reader  

### What NOT to buy

| Avoid | Why |
| --- | --- |
| ACR122U-only “NFC writer” kits without HID keyboard mode | Often needs special software, not Notepad-style typing |
| 13.56 MHz tags with a 125 kHz reader (or vice versa) | Won’t read |
| “Wiegand only” door access readers | Wrong interface for a laptop browser |

### Hardware test (before the app)

1. Plug reader into the Windows laptop  
2. Open **Notepad**  
3. Tap a tag on the reader  
4. You should see a number appear (and usually Enter)  

If Notepad works, this app will work.

## Link parents + tags

1. Roster → Add student → fill **parent email** (and phone if you want) → Save  
2. Click **Select** on that student  
3. Tap their folder tag into “Tap tag here” → **Link tag**  
4. Tape that same physical tag to their folder  

### Student leaves — reuse the tag

1. Select the old student → **Unlink tag** (or Delete / mark Inactive)  
2. Select the new student → tap the same tag → **Reassign tag**  

## Parent emails

Set `SMTP_*` in `.env` (Gmail App Password works). Defaults: email on check-in **and** check-out.

See the root [README](../README.md) for Windows setup and the QR alternative.
