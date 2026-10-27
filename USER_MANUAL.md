# Kumon NDG – Check-In / Check-Out  
## User Manual (RFID version)

This guide is for staff using the **RFID / tap-tag** app on the desk Windows laptop.

App address on the desk computer: **http://localhost:3001**

---

## 1. What this app does

- Students **tap** an RFID sticker on their folder to check **in** and **out**
- The desk screen shows **who is here right now**
- Parents can get an **email** when their child checks in or out (once email is set up)
- Staff can review **past attendance** and export it
- If someone forgets their tag, use **Manual check-in / check-out** on the Tap page (search by name)
- Employees can be marked as **Staff** and punch in/out the same way; a **weekly CSV** can be emailed to your accountant

---

## 2. Pages in the app

| Page | Who uses it | What it’s for |
| --- | --- | --- |
| **Tap** | Desk (main screen) | Tag tap + always-visible manual name check-in/out |
| **Roster** | Staff (PIN) | Add students/staff, parent emails, link/unlink tags |
| **Logs** | Staff (PIN) | Review past check-ins/outs, export CSV |
| **Settings** | Staff (PIN) | Centre name, emails, accountant report, backups |

**Staff PIN** is required for Roster, Logs, and Settings. Ask the centre manager for the PIN (set in the `.env` file as `STAFF_PIN`).

---

## 3. Starting the app each day

1. Turn on the **Windows desk laptop**
2. Plug in the **USB RFID reader**
3. Open **PowerShell** (or use a desktop shortcut if you made one) and run:

```powershell
cd path\to\rfid-checkin
npm start
```

4. Open **Chrome** or **Edge**
5. Go to: **http://localhost:3001**
6. Leave the **Tap** page open all session

### Quick reader check (if taps do nothing)

1. Open **Notepad**
2. Tap a known sticker on the reader  
3. You should see a number appear, then Enter  
4. Close Notepad and go back to the app Tap page  
5. Click **Focus reader box** if needed

Also confirm the Windows **date and time** are correct — attendance times come from the laptop clock.

---

## 4. First-time setup (manager)

Do this once before the first busy class.

### A. Set the Staff PIN

1. In the `rfid-checkin` folder, open `.env` in Notepad  
2. Change:

```
STAFF_PIN=your-secret-pin
```

3. Save the file  
4. Restart the app (`Ctrl+C` in PowerShell, then `npm start` again)

### B. Add students and link tags

1. Open **Roster** → enter Staff PIN  
2. Fill in:
   - Student name  
   - Student ID (or click **Suggest**)  
   - Subjects (optional)  
   - **Parent email** (needed for email alerts)  
   - Parent phone (optional)  
3. Click **Save student**  
4. Click **Select** on that student  
5. Tap their **new sticker** on the reader (in “Tap tag to link…”)  
6. Click **Link tag**  
7. Peel the sticker and stick it on that student’s folder  

Repeat for each student.

### C. Student leaves — reuse a tag

1. Roster → **Select** the old student  
2. Click **Unlink tag** (or Delete/deactivate the student)  
3. **Select** the new student  
4. Tap the same physical sticker → **Reassign tag**

---

## 5. Daily check-in / check-out (desk)

### Normal flow (recommended)

1. Keep mode on **Auto**
2. When a student **arrives**, tap their folder tag on the reader → **check-in**
3. When they **leave**, tap again → **check-out**
4. Watch **Who is here** on the right — it should match reality

You will hear a short sound:
- Higher chime ≈ checked in  
- Lower tone ≈ checked out  
- Error tone ≈ problem (unknown tag, inactive student, etc.)

### Force modes (use only when needed)

| Mode | Use when |
| --- | --- |
| **Auto** | Normal day — tap toggles in/out |
| **Force Check-In** | You need to check someone in even if the system thinks they are already in |
| **Force Check-Out** | You need to force a checkout |

Switch back to **Auto** after using Force.

### Manual check-in / check-out (always on the Tap page)

Use this when a tag is forgotten, or for **staff punching in/out by name**.

1. On the **Tap** page, find **Manual check-in / check-out** (always visible under the reader box)  
2. Type a **full name** or **last name** in the search box  
3. Click the matching person in the list  
4. Click **Check in** or **Check out**  

You can also type a student/staff ID and click **Find ID**.

### Add staff for payroll / accountant reports

1. **Roster** → add the employee (name + ID)  
2. Check **Staff member (weekly accountant report)**  
3. Save (RFID tag optional — they can use manual name punch)  
4. They punch in/out on the Tap page like anyone else  

Staff punches do **not** send parent emails.

### Unknown tag

If the app says no student is linked to that tag:

1. Go to **Roster**  
2. Select the correct student  
3. Tap the tag → **Link tag** (or **Reassign**)

---

## 6. Who is here

On the **Tap** page, the right side lists everyone currently checked in, with a timer.

- Click **Check out** next to a name to check them out without tapping  
- Other phones/tablets on centre Wi‑Fi can open the same laptop address (ask the manager for the laptop’s IP, e.g. `http://192.168.x.x:3001`) to **view** who is here — they will not see parent phone/email

---

## 7. Reviewing past days (Logs)

1. Open **Logs** → enter Staff PIN  
2. Set **From** and **To** dates (example: last Monday → today)  
3. Optionally search by name or student ID  
4. Click **Refresh** if needed  
5. Click **Export CSV** to download a spreadsheet for printing or filing  

Attendance history is kept for **at least 2 years** (do not delete the database or old backups).

---

## 8. Parent emails

Once SMTP is configured in `.env` (usually a Gmail App Password):

- Parents get an email on **check-in** and/or **check-out** (toggles in **Settings**)  
- Check-in/out still works even if email is not set up yet  
- In Logs, the Email column shows `sent`, `failed`, or `skipped`

Ask the manager to fill `SMTP_USER`, `SMTP_PASS`, etc. in `.env` if emails are not sending.

---

## 8b. Weekly staff report to the accountant

1. Mark employees as **Staff** on Roster (see above)  
2. **Settings** → **Weekly staff report emails** should include both:
   - `Nassershayan@gmail.com` (accountant)  
   - `montreal-ndg@ikumon.com` (Kumon NDG)  
   (comma-separated; both are the default) → Save  
3. Each week either:
   - Click **Email last week’s staff report now**, or  
   - Turn on **Auto-email last week’s staff CSV every Monday** (laptop + app must be running), or  
   - Click **Download staff CSV** and forward it yourself  

The report is a spreadsheet of staff check-in / check-out times for the previous Monday–Sunday. It goes to **both** addresses when both are listed.

SMTP must be configured for emailing (same as parent emails).

---

## 9. Settings & weekly backup

1. Open **Settings** → Staff PIN  
2. You can change the centre name (used on emails)  
3. Turn parent email alerts on/off  
4. Click **Create backup now**  

**Every week:**

1. Create a backup in Settings  
2. Copy the folder `rfid-checkin\data\backups\` to a **USB drive** or cloud folder  
3. Keep those copies for **at least 2 years**

---

## 10. Closing the centre

1. Check **Who is here** — check out anyone who has left  
2. Optional: create a backup  
3. Close the browser  
4. In PowerShell, press `Ctrl+C` to stop the app (or shut down the laptop)

---

## 11. Troubleshooting

| Problem | What to try |
| --- | --- |
| Tap does nothing | Click **Focus reader box**. Test tag in Notepad. Unplug/replug USB reader. |
| “No student linked to tag” | Link the tag on Roster first. |
| Wrong student checked in | Wrong sticker on folder — unlink and re-link the correct tag. |
| Duplicate tap ignored | Wait 2–3 seconds and tap again. |
| Can’t open Roster/Logs | Enter the Staff PIN. If forgotten, open `.env` and check `STAFF_PIN`. |
| Page won’t load | Confirm `npm start` is running. Use `http://localhost:3001`. |
| Emails not sending | SMTP not configured, or Gmail App Password missing — check Settings status. |
| Laptop / app down | Use a **paper sign-in sheet** for that session only; resume digital check-in when the app is back. |

---

## 12. Rules to remember (franchise)

1. Use this **digital** app as the normal method (not paper/Excel as the everyday system)  
2. Every student needs a **unique ID** and ideally a linked tag  
3. Tap at **real** arrival and departure — don’t enter times later just for paperwork  
4. Staff should know this process and follow it every day  
5. Use **Who is here** and **Logs** when you need current or past attendance  
6. **Back up weekly** to USB/cloud  
7. Protect parent emails/phones — only on PIN pages  
8. Keep records/backups for **at least 2 years**

---

## 13. Updating the app (after a new GitHub version)

You do **not** need Cursor on the Windows laptop.

1. Download the new ZIP from GitHub (or `git pull` if you cloned)  
2. Copy your existing `rfid-checkin\data` folder into the new `rfid-checkin` folder (keeps students, tags, logs)  
3. Copy your existing `.env` file too (PIN, SMTP, accountant email)  
4. In PowerShell:

```powershell
cd path\to\rfid-checkin
npm install
npm start
```

Reader and tags stay the same.

---

## 14. Quick cheat sheet

**Open app:** `npm start` → http://localhost:3001  

**Arrive:** tap folder → check in  

**Leave:** tap folder → check out  

**Forgot tag / staff punch:** Manual check-in / check-out → search name → Check in / Check out  

**New student:** Roster → Save → Select → tap sticker → Link tag → stick on folder  

**New staff:** Roster → check Staff member → Save → punch by name on Tap  

**See history:** Logs → pick dates → Export CSV if needed  

**Accountant:** Settings → accountant email → Email last week’s staff report  

**Weekly backup:** Settings → Create backup → copy `data\backups` to USB  

---

*App name: Kumon NDG – Check-In / Check-Out*  
*Centre name on emails/badges: Kumon NDG Learning Centre*  
*Related files: `STAFF_SOP.md`, `rfid-checkin/README.md`*
