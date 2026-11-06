require("dotenv").config();

const path = require("path");
const express = require("express");
const studentsRouter = require("./routes/students");
const attendanceRouter = require("./routes/attendance");
const exportRouter = require("./routes/export");
const settingsRouter = require("./routes/settings");
const backupRouter = require("./routes/backup");
const reportsRouter = require("./routes/reports");
const { usingDefaultPin, staffPinConfigured } = require("./middleware/auth");
const { listStaffLogs, getWeekRange, getSetting, setSetting, dataDir, dbPath } = require("./db");
const { sendStaffWeekReport } = require("./services/email");
const { maybeAutoBackup } = require("./services/backup");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "Kumon NDG – Check-In / Check-Out",
    mode: "rfid",
    staffPinConfigured: staffPinConfigured(),
    usingDefaultPin: usingDefaultPin(),
  });
});

app.use("/api/students", studentsRouter);
app.use("/api", attendanceRouter);
app.use("/api/export", exportRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/backup", backupRouter);
app.use("/api/reports", reportsRouter);

/** Optional: email last week's staff punches every Monday while the app is running. */
async function maybeSendWeeklyStaffReport() {
  if (getSetting("staff_report_auto_weekly", "false") !== "true") return;
  const now = new Date();
  if (now.getDay() !== 1) return; // Monday
  const { from, to } = getWeekRange({ forPreviousWeek: true });
  const weekKey = `${from}_${to}`;
  if (getSetting("last_staff_report_week", "") === weekKey) return;
  const { logs } = listStaffLogs({ from, to });
  const result = await sendStaffWeekReport({ from, to, logs });
  if (result.status === "sent") {
    setSetting("last_staff_report_sent", new Date().toISOString());
    setSetting("last_staff_report_week", weekKey);
    console.log(`Staff week report emailed (${from} → ${to}, ${logs.length} entries)`);
  } else if (result.status !== "skipped") {
    console.warn("Staff week report failed:", result.detail);
  }
}

function runAutoBackup() {
  try {
    const outcome = maybeAutoBackup({ dataDir, dbPath, label: "kumon-rfid" });
    if (outcome.ran) {
      const cloud = outcome.result?.cloudCopied
        ? ` + cloud ${outcome.result.cloudDir}`
        : outcome.result?.cloudDir
          ? ` (cloud copy failed: ${outcome.result.cloudError})`
          : "";
      console.log(`Auto backup saved (${outcome.result.logCount} logs)${cloud}`);
    }
  } catch (err) {
    console.warn("Auto backup failed:", err.message);
  }
}

setInterval(() => {
  maybeSendWeeklyStaffReport().catch((err) => console.warn(err.message));
  runAutoBackup();
}, 60 * 60 * 1000);
setTimeout(() => {
  maybeSendWeeklyStaffReport().catch(() => {});
  runAutoBackup();
}, 20_000);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kumon NDG – Check-In / Check-Out (RFID) at http://localhost:${PORT}`);
  console.log(`Tap USB RFID/NFC reader → browser checks students in/out`);
  console.log(`On centre Wi-Fi: http://<this-computer-ip>:${PORT}`);
  if (!staffPinConfigured()) {
    console.warn("WARNING: STAFF_PIN is not set — roster/parent data is unprotected.");
  } else if (usingDefaultPin()) {
    console.warn("WARNING: STAFF_PIN is still the default 1234 — change it in .env.");
  }
});
